import { Observable, animationFrames } from "rxjs";

export const fps$ = new Observable<number>((subscriber) => {
  let fps = 0;
  let prevSecond = 0;

  const subscription = animationFrames().subscribe(({ timestamp }) => {
    const now = Math.floor(timestamp / 1000);
    for (let i = 0; i < now - prevSecond; i++) {
      subscriber.next(fps);
      fps = 0;
      prevSecond = now;
    }
    fps++;
  });

  return () => subscription.unsubscribe();
});
