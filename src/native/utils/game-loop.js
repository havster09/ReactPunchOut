export default class GameLoop {
  loop = () => {
    this.now = Date.now();
    this.elapsed = this.now - this.then;
    if (this.elapsed > this.fpsInterval) {
      this.then = this.now - this.elapsed % this.fpsInterval;
      this.subscribers.forEach(callback => {
        callback.call();
      });
    }
    this.loopID = window.requestAnimationFrame(this.loop);
  };

  constructor(fps) {
    this.subscribers = [];
    this.loopID = null;
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.elapsed = 0;
    this.startTime = this.then;
  }

  start() {
    if (!this.loopID) {
      this.loop();
    }
  }

  stop() {
    window.cancelAnimationFrame(this.loop);
  }

  subscribe(callback) {
    return this.subscribers.push(callback);
  }
  unsubscribe(id) {
    delete this.subscribers[id - 1];
  }
}
