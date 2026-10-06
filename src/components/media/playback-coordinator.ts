import { selectVideo, type PlaybackCandidate } from '@/lib/video-playback';

type Entry = PlaybackCandidate & { activate: (manual: boolean) => void; deactivate: () => void };
type Connection = EventTarget & { saveData?: boolean };

/** One coordinator for every outreach player, including the separate testimonial. */
class PlaybackCoordinator {
  private entries = new Map<string, Entry>();
  private active: string | null = null;
  private manual: string | null = null;
  private blocked = false;
  private cleanup: (() => void) | undefined;
  private automatic = false;

  register(id: string, element: HTMLElement, handlers: Pick<Entry, 'activate' | 'deactivate'>) {
    if (!this.entries.size) this.listen();
    this.entries.set(id, { id, ratio: 0, paused: false, failed: false, ...handlers });
    const observer = new IntersectionObserver(([entry]) => {
      const item = this.entries.get(id);
      if (item) item.ratio = entry.intersectionRatio;
      if (this.manual === id && entry.intersectionRatio < 0.15) this.manual = null;
      this.choose();
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    observer.observe(element);
    return () => {
      observer.disconnect();
      this.entries.get(id)?.deactivate();
      this.entries.delete(id);
      if (this.active === id) this.active = null;
      if (this.manual === id) this.manual = null;
      if (!this.entries.size) { this.cleanup?.(); this.cleanup = undefined; this.blocked = false; }
      else this.choose();
    };
  }

  private listen() {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const update = () => {
      this.automatic = !motion.matches && !connection?.saveData;
      if (document.hidden) this.manual = null;
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
    const winner = selectVideo([...this.entries.values()], this.manual, this.automatic && !this.blocked, !document.hidden);
    if (winner === this.active) return;
    if (this.active) this.entries.get(this.active)?.deactivate();
    this.active = winner;
    if (winner) this.entries.get(winner)?.activate(winner === this.manual);
  }

  play(id: string) {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.paused = false;
    entry.failed = false;
    // A user gesture may arrive before the observer's first callback.
    entry.ratio = Math.max(entry.ratio, 0.15);
    this.manual = id;
    if (this.active === id) entry.activate(true);
    else this.choose();
  }
  pause(id: string) {
    const entry = this.entries.get(id);
    if (entry) entry.paused = true;
    if (this.manual === id) this.manual = null;
    this.choose();
  }
  fail(id: string) {
    const entry = this.entries.get(id);
    if (entry) entry.failed = true;
    if (this.manual === id) this.manual = null;
    this.choose();
  }
  denyAutoplay() { this.blocked = true; this.choose(); }
}
export const playback = new PlaybackCoordinator();
