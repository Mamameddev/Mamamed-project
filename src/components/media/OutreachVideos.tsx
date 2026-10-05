'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Video, Play, ChevronDown } from 'lucide-react';
import type { OutreachVideo } from '@/lib/content';

export function VideoCard({ video }: { video: OutreachVideo }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <article className="reel-card">
      <div className="reel-frame">
        {!started ? (
          <button className="reel-poster" type="button" aria-label={`Play ${video.title}`} onClick={() => setStarted(true)}>
            {video.poster && <Image src={video.poster} alt="" fill sizes="(max-width: 639px) 85vw, 360px" loading="lazy" unoptimized />}
            <span className="reel-play"><Play size={25} fill="currentColor" aria-hidden="true" /></span>
            <span className="reel-watch">Watch video{video.duration && <span>{video.duration}</span>}</span>
          </button>
        ) : failed ? (
          <div className="video-error"><Video size={32} aria-hidden="true" /><p>This video couldn’t load.</p><a href={video.originalSrc ?? video.src}>Open original video</a><button type="button" onClick={() => { setFailed(false); setStarted(false); }}>Try again</button></div>
        ) : (
          <video
            data-outreach-video
            controls playsInline preload="none" poster={video.poster} aria-label={video.title}
            src={video.src} crossOrigin={video.captions ? 'anonymous' : undefined}
            // The element and its URL exist only after the visitor presses Play.
            ref={(element) => {
              if (element) {
                element.focus({ preventScroll: true });
                void element.play().catch(() => { /* Native controls remain usable if playback is restricted. */ });
              }
            }}
            onError={() => setFailed(true)}
            onPlay={(event) => {
              const current = event.currentTarget;
              document.querySelectorAll<HTMLVideoElement>('video[data-outreach-video]').forEach(other => { if (other !== current) other.pause(); });
            }}
          >
            {video.captions && <track kind="captions" src={video.captions.src} srcLang={video.captions.language} label={video.captions.label} default />}
            Your browser does not support video playback. <a href={video.originalSrc ?? video.src}>Open video</a>.
          </video>
        )}
      </div>
      <h3>{video.title}</h3><p>{video.description}</p>
      {video.transcript && <details className="transcript"><summary>Read transcript</summary><p>{video.transcript}</p></details>}
    </article>
  );
}

export function OutreachVideos({ videos }: { videos: OutreachVideo[] }) {
  if (!videos.length) return (
    <div className="media-pending">
      <div className="portrait-outline" aria-hidden="true"><Video size={36} strokeWidth={1.5} /></div>
      <div><h3>Stories from our community</h3><p>We’re preparing real moments from MamaMeds outreach to share here.</p></div>
    </div>
  );
  return <div className="reel-grid" data-video-gallery>{videos.map(video => <VideoCard key={video.id} video={video} />)}</div>;
}

export function MoreOutreachVideos({ videos }: { videos: OutreachVideo[] }) {
  const [open, setOpen] = useState(false);
  if (!videos.length) return null;
  return <div className="more-outreach">
    <button className="more-videos-toggle" type="button" aria-expanded={open} aria-controls="more-outreach-videos" onClick={() => setOpen(!open)}>
      {open ? 'Fewer outreach moments' : `More outreach moments (${videos.length})`}<ChevronDown size={18} aria-hidden="true" />
    </button>
    <div id="more-outreach-videos" hidden={!open}>{open && <OutreachVideos videos={videos} />}</div>
  </div>;
}
