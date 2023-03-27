import { subscribeFrametime } from "frametime";
import { Observable } from "rxjs";

export const frametime$ = new Observable<number>((subscriber) => {
  return subscribeFrametime((frametime) => subscriber.next(frametime));
});
