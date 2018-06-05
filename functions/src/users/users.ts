interface usersParams {
    q: string;
    sort?: string;
    order?: string;
    per_page?: number;
    page?: number;
}

class Users {
    getUsers(event:usersParams) {
        return {
            message: 'Go Serverless v1.0! Your function executed successfully!'
        };
    }
}

module.exports = Users;

export {}; // for TypeScript to recognize local scoping
