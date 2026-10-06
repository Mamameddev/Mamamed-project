'use client';
import { useRouter } from 'next/navigation';
export function PreviewBar() {
  const router = useRouter();
  return <aside className="cms-preview" aria-label="Draft preview">
    <strong>Draft preview — not published</strong>
    <button type="button" onClick={() => router.refresh()}>Refresh preview</button>
    <form action="/api/draft-mode/disable" method="post"><button type="submit">Exit preview</button></form>
  </aside>;
}
