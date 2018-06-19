const rp = require('request-promise');

class GithubService {
    getGithubToken(code:string) {
        const options = {
            url: 'https://github.com/login/oauth/access_token',
            json: true,
            headers: { 'content-length': 256 },
            qs: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            }
        };

        return rp.post(options);
    }

    getUserDataByToken(token:string) {
        const options = {
            url: 'https://api.github.com/user',
            json: true,
            qs: { access_token: token },
            headers: { 'User-Agent': 'community-portal-app' }
        };

        return rp(options);
    }
}

module.exports = GithubService;