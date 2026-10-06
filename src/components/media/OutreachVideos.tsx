'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Video, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import type { OutreachVideo, GalleryItem } from '@/lib/content';
import { playback } from './playback-coordinator';

export function VideoCard({ video }: { video: OutreachVideo }) {
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(false);
  const manualRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [manual, setManual] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!frame.current) return;
    return playback.register(video.id, frame.current, {
      activate(userInitiated) {
        activeRef.current = true;
        manualRef.current = userInitiated;
        setActive(true); setManual(userInitiated); setMounted(true);
        setMuted(!userInitiated);
        // Existing players start inside the click gesture, important on mobile Safari.
        if (player.current) {
          player.current.muted = !userInitiated;
          void player.current.play().catch(() => {});
        }
      },
      deactivate() {
        activeRef.current = false;
        manualRef.current = false;
        if (player.current) { player.current.pause(); player.current.muted = true; }
        setActive(false); setManual(false); setMuted(true);
      },
    });
  }, [video.id]);

  useEffect(() => {
    const element = player.current;
    if (!mounted || !element || !active || failed) return;
    element.muted = muted;
    void element.play().catch(error => {
      if (!activeRef.current || error?.name === 'AbortError') return;
      // Restore the poster when the browser refuses autoplay. Manual playback remains available.
      if (!manualRef.current) { playback.denyAutoplay(); setMounted(false); }
      else setPlaying(false);
    });
  }, [mounted, active, failed, muted, manual]);

  const play = () => { setFailed(false); playback.play(video.id); };
  const pause = () => playback.pause(video.id);
  const toggleSound = () => {
    if (muted) { playback.play(video.id); }
    else { if (player.current) player.current.muted = true; setMuted(true); }
  };

  return <article className="reel-card" data-video-id={video.id}>
    <div className="reel-frame" ref={frame}>
      {failed ? <div className="video-error"><Video size={32} aria-hidden="true" /><p>This video couldn’t load.</p><a href={video.originalSrc ?? video.src}>Open original video</a><button type="button" onClick={play}>Try again</button></div> : <>
        {!mounted ? <button className="reel-poster" type="button" aria-label={`Play ${video.title}`} onClick={play}>
          {video.poster && <Image src={video.poster} alt="" fill sizes="(max-width: 639px) 85vw, 360px" loading="lazy" unoptimized />}
          <span className="reel-play"><Play size={25} fill="currentColor" aria-hidden="true" /></span>
          <span className="reel-watch">Watch video{video.duration && <span>{video.duration}</span>}</span>
        </button> : <video ref={player} data-outreach-video playsInline controls={manual} muted={muted} loop={!manual} preload="none" poster={video.poster} aria-label={video.title} src={video.src}
          crossOrigin={video.captions ? 'anonymous' : undefined}
          onPlay={() => {
            if (!activeRef.current) { player.current?.pause(); return; }
            document.querySelectorAll<HTMLVideoElement>('video[data-outreach-video]').forEach(other => { if (other !== player.current) other.pause(); });
            setPlaying(true);
          }}
          onPause={() => { setPlaying(false); if (activeRef.current && manualRef.current && !player.current?.ended) playback.pause(video.id); }}
          onEnded={pause}
          onError={() => { setFailed(true); setMounted(false); playback.fail(video.id); }}>
          {video.captions && <track kind="captions" src={video.captions.src} srcLang={video.captions.language} label={video.captions.label} default />}
        </video>}
        {mounted && <div className="reel-controls">
          <button type="button" aria-label={`${playing ? 'Pause' : 'Play'} ${video.title}`} onClick={playing ? pause : play}>{playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}<span>{playing ? 'Pause' : 'Play'}</span></button>
          <button type="button" aria-label={`${muted ? 'Enable sound for' : 'Mute'} ${video.title}`} onClick={toggleSound}>{muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}<span>{muted ? 'Sound off' : 'Sound on'}</span></button>
        </div>}
      </>}
    </div>
    <h3>{video.title}</h3><p>{video.description}</p>
    {video.transcript && <details className="transcript"><summary>Read transcript</summary><p>{video.transcript}</p></details>}
  </article>;
}

export function OutreachVideos({ videos }: { videos: OutreachVideo[] }) {
  if (!videos.length) return <div className="media-pending"><div><h3>Stories from our community</h3><p>We’re preparing real moments from MamaMeds outreach to share here.</p></div></div>;
  return <div className="reel-grid" data-video-gallery>{videos.map(video => <VideoCard key={video.id} video={video} />)}</div>;
}

export function OutreachGallery({ items }: { items: GalleryItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const cards = [...element.children] as HTMLElement[];
      const index = cards.reduce((best, card, i) => Math.abs(card.offsetLeft - element.offsetLeft - element.scrollLeft) < Math.abs(cards[best].offsetLeft - element.offsetLeft - element.scrollLeft) ? i : best, 0);
      setPosition(index);
      setEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 3);
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update); resize.observe(element);
    return () => { element.removeEventListener('scroll', update); resize.disconnect(); };
  }, [items.length]);
  if (!items.length) return null;
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const width = element.firstElementChild?.getBoundingClientRect().width ?? element.clientWidth;
    element.scrollBy({ left: direction * (width + 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <div className="outreach-gallery" role="region" aria-labelledby="gallery-title">
    <div className="gallery-heading"><div><h3 id="gallery-title">More outreach moments</h3><p>Swipe or use the controls to explore.</p></div><div className="gallery-buttons">
      <button type="button" onClick={() => move(-1)} disabled={position === 0} aria-label="Previous outreach moment" aria-controls="outreach-gallery-track"><ChevronLeft size={22} aria-hidden="true" /></button>
      <button type="button" onClick={() => move(1)} disabled={end} aria-label="Next outreach moment" aria-controls="outreach-gallery-track"><ChevronRight size={22} aria-hidden="true" /></button>
    </div></div>
    <div id="outreach-gallery-track" className="gallery-track" ref={track} tabIndex={0} aria-label="Outreach photos and videos" onKeyDown={event => { if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
      {items.map(item => item.kind === 'video' ? <VideoCard key={item.video.id} video={item.video} /> : <article className="reel-card gallery-photo" key={item.id}><div className="reel-frame"><Image {...item.photo} alt={item.photo.alt} sizes="(max-width: 639px) 85vw, 360px" loading="lazy" /></div>{item.caption && <p>{item.caption}</p>}</article>)}
    </div>
    <p className="gallery-position" aria-live="polite">{position + 1} of {items.length} moments</p>
  </div>;
}
