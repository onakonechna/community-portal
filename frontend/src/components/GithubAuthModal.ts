import * as qs from 'qs';

export const toQuery = (params: any, delimiter = '&') => {
  const keys = Object.keys(params);

  return keys.reduce(
    (str, key, index) => {
      let query = `${str}${key}=${params[key]}`;

      if (index < (keys.length - 1)) {
        query += delimiter;
      }

      return query;
    }, '');
};

class GithubAuthModal {
  public static open(id: string, url: string, options = {}) {
    const popup = new this(id, url, options);

    popup.open();
    popup.poll();

    return popup;
  }

  private id: string;
  private url: string;
  private options: any;
  private window: any;
  private promise: Promise<any>;
  private iid: number | null;

  constructor(id: string, url: string, options = {}) {
    this.id = id;
    this.url = url;
    this.options = options;
  }

  open() {
    const { url, id, options } = this;
    this.window = window.open(url, id, toQuery(options, ','));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this.iid = window.setInterval(() => {
        try {
          const popup = this.window;

          if (!popup || popup.closed !== false) {
            this.close();
            reject(new Error('The popup was closed'));
          }

          if (popup.location.href === this.url ||
            popup.location.pathname === 'blank' ||
            !popup.location.pathname
          ) {
            return;
          }
          const params = qs.parse(popup.location.search.substr(1)).code;
          resolve(params);
          this.close();
        } catch (error) {
          console.error(error);
        }
      }, 500);
    });
  }

  cancel() {
    if (this.iid) {
      window.clearInterval(this.iid);
      this.iid = null;
    }
  }

  then(...args: any[]) {
    return this.promise.then(...args);
  }

  catch(...args: any[]) {
    return this.promise.then(...args);
  }
}

export default GithubAuthModal;
