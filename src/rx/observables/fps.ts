import { Observable } from "rxjs";

function getCurrentSecond() {
  return Math.floor(performance.now() / 1000);
}

export const fps$ = new Observable<number>((subscriber) => {
  let fps = 0;
  let lastSecond = 0;
  let rafId: number | null = null;

  function callback() {
    const now = getCurrentSecond();
    // TODO: May prev - now >= 2
    if (now > lastSecond) {
      subscriber.next(fps);
      fps = 0;
      lastSecond = now;
    }
    fps++;
    requestAnimationFrame(callback);
  }

  lastSecond = getCurrentSecond();
  rafId = requestAnimationFrame(callback);

  return function cleanup() {
    cancelAnimationFrame(rafId as number);
    rafId = null;
  };
});
