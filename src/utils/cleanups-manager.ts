export class CleanupsManager {
  private cleanups: Array<() => void> = [];

  public add(cleanup: () => void) {
    this.cleanups.unshift(cleanup);
  }

  public cleanup() {
    const cleanups = this.cleanups;
    this.cleanups = [];
    cleanups.forEach((cleanup) => cleanup());
  }
}
