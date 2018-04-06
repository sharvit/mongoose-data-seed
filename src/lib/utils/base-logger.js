export default class BaseLogger {
  asObserver() {
    return {
      next: (...args) => this.next(...args),
      error: (...args) => this.error(...args),
      complete: (...args) => this.complete(...args),
    };
  }
  next() {}
  error() {}
  complete() {}
}
