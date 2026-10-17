import { selectVideo, type PlaybackCandidate } from '@/lib/video-playback';

type Entry = PlaybackCandidate & { activate: () => void; deactivate: () => void };
type Connection = EventTarget & { saveData?: boolean };

/** One coordinator for every muted preview, so only one plays at a time across the page. */
class PlaybackCoordinator {
  private entries = new Map<string, Entry>();
  private active: string | null = null;
  private hovered: string | null = null;
  private blocked = false;
  private suspended = false;
  private cleanup: (() => void) | undefined;
  private automatic = false;

  register(id: string, element: HTMLElement, handlers: Pick<Entry, 'activate' | 'deactivate'>) {
    if (!this.entries.size) this.listen();
    this.entries.set(id, { id, ratio: 0, failed: false, ...handlers });
    const observer = new IntersectionObserver(([entry]) => {
      const item = this.entries.get(id);
      if (item) item.ratio = entry.intersectionRatio;
      this.choose();
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    observer.observe(element);
    return () => {
      observer.disconnect();
      this.entries.get(id)?.deactivate();
      this.entries.delete(id);
      if (this.active === id) this.active = null;
      if (this.hovered === id) this.hovered = null;
      if (!this.entries.size) { this.cleanup?.(); this.cleanup = undefined; this.blocked = false; }
      else this.choose();
    };
  }

  private listen() {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const update = () => {
      this.automatic = !motion.matches && !connection?.saveData;
      this.choose();
    };
    motion.addEventListener('change', update);
    connection?.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    this.automatic = !motion.matches && !connection?.saveData;
    this.cleanup = () => {
      motion.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }

  private choose() {
    const winner = selectVideo([...this.entries.values()], this.hovered, this.automatic && !this.blocked, !document.hidden && !this.suspended);
    if (winner === this.active) return;
    if (this.active) this.entries.get(this.active)?.deactivate();
    this.active = winner;
    if (winner) this.entries.get(winner)?.activate();
  }

  hover(id: string | null) { this.hovered = id; this.choose(); }
  fail(id: string) {
    const entry = this.entries.get(id);
    if (entry) entry.failed = true;
    this.choose();
  }
  denyAutoplay() { this.blocked = true; this.choose(); }
  /** Stops previews while the full-size viewer is open. */
  suspend() { this.suspended = true; this.choose(); }
  resume() { this.suspended = false; this.choose(); }
}
export const playback = new PlaybackCoordinator();
