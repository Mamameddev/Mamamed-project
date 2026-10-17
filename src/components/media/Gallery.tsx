'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Play, X } from 'lucide-react';
import type { OutreachVideo, GalleryItem } from '@/lib/content';
import { playback } from './playback-coordinator';

const itemKey = (item: GalleryItem) => item.kind === 'video' ? item.video.id : item.id;

/** Poster first; the small muted preview only mounts while this tile is the coordinator's pick. */
function VideoPreview({ video }: { video: OutreachVideo }) {
  const frame = useRef<HTMLSpanElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!frame.current) return;
    return playback.register(video.id, frame.current, {
      activate: () => setActive(true),
      deactivate: () => setActive(false),
    });
  }, [video.id]);

  useEffect(() => {
    if (!active || !player.current) return;
    void player.current.play().catch(error => {
      if (error?.name === 'AbortError') return;
      // Keep the poster when the browser refuses muted autoplay. The tile still opens the viewer.
      playback.denyAutoplay();
    });
  }, [active]);

  return <span className="media-frame" ref={frame}>
    {video.poster && <Image src={video.poster} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" loading="lazy" unoptimized />}
    {active && <video ref={player} data-outreach-video muted playsInline loop preload="auto" src={video.src} aria-hidden="true" tabIndex={-1} onError={() => playback.fail(video.id)} />}
    <span className="media-play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
  </span>;
}

function Tile({ item, onOpen, showTitle }: { item: GalleryItem; onOpen: () => void; showTitle?: boolean }) {
  if (item.kind === 'photo') return <li><button type="button" className="media-tile" aria-haspopup="dialog" aria-label={`View photo: ${item.photo.alt}`} onClick={onOpen}>
    <span className="media-frame"><Image src={item.photo.src} alt={item.photo.alt} fill sizes="(min-width: 1024px) 30vw, 50vw" loading="lazy" /></span>
  </button></li>;
  const { video } = item;
  return <li>
    <button type="button" className="media-tile" aria-haspopup="dialog" aria-label={`Play ${video.title} with sound`} onClick={onOpen}
      onPointerEnter={event => { if (event.pointerType === 'mouse') playback.hover(video.id); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') playback.hover(null); }}>
      <VideoPreview video={video} />
    </button>
    {showTitle && <h3 className="media-title">{video.title}</h3>}
  </li>;
}

/** A grid of photo and video tiles that open full size, videos with sound, in one shared viewer. */
export function MediaGrid({ items, className = 'media-grid', showTitles = false }: { items: GalleryItem[]; className?: string; showTitles?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewerVideo = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const [failed, setFailed] = useState(false);

  const show = (item: GalleryItem) => {
    playback.suspend();
    // Render synchronously so playback with sound starts inside the click, as mobile Safari requires.
    flushSync(() => { setOpen(item); setFailed(false); });
    dialog.current?.showModal();
    void viewerVideo.current?.play().catch(() => {});
  };
  const close = () => dialog.current?.close();

  if (!items.length) return null;
  return <>
    <ul className={className}>{items.map(item => <Tile key={itemKey(item)} item={item} showTitle={showTitles} onOpen={() => show(item)} />)}</ul>
    <dialog ref={dialog} className="media-viewer" aria-label={open?.kind === 'video' ? open.video.title : open?.photo.alt ?? 'Media viewer'}
      onClose={() => { viewerVideo.current?.pause(); setOpen(null); playback.resume(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {open && <div className="viewer-body">
        <button type="button" className="viewer-close" onClick={close} aria-label="Close"><X size={22} aria-hidden="true" /></button>
        {open.kind === 'photo'
          // Eager: Safari may never start a lazy image inside a modal dialog.
          ? <Image src={open.photo.src} alt={open.photo.alt} width={open.photo.width} height={open.photo.height} sizes="92vw" className="viewer-media" loading="eager" />
          : failed
            ? <p className="viewer-error">This video couldn’t load. <a href={open.video.fullSrc ?? open.video.src}>Open the video file</a></p>
            : <video key={open.video.id} ref={viewerVideo} className="viewer-media" controls playsInline preload="auto" poster={open.video.poster} src={open.video.fullSrc ?? open.video.src}
              crossOrigin={open.video.captions ? 'anonymous' : undefined} onError={() => setFailed(true)}
              // Clips of a few seconds loop like a reel instead of stopping almost immediately.
              onLoadedMetadata={event => { event.currentTarget.loop = event.currentTarget.duration < 15; }}>
              {open.video.captions && <track kind="captions" src={open.video.captions.src} srcLang={open.video.captions.language} label={open.video.captions.label} default />}
            </video>}
      </div>}
    </dialog>
  </>;
}
