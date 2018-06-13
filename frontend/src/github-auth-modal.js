import qs from 'qs';

const toQuery = (params, delimiter = '&') => {
    const keys = Object.keys(params);

    return keys.reduce((str, key, index) => {
        let query = `${str}${key}=${params[key]}`;

        if (index < (keys.length - 1)) {
            query += delimiter;
        }

        return query;
    }, '');
};

class GithubAuthModal {
    constructor(id, url, options = {}) {
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
            this._iid = window.setInterval(() => {
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
                    console.log(error);
                }
            }, 500);
        });
    }

    cancel() {
        if (this._iid) {
            window.clearInterval(this._iid);
            this._iid = null;
        }
    }

    then(...args) {
        return this.promise.then(...args);
    }

    catch(...args) {
        return this.promise.then(...args);
    }

    static open(...args) {
        const popup = new this(...args);

        popup.open();
        popup.poll();

        return popup;
    }
}

export default GithubAuthModal;
