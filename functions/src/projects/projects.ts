interface getProjectParams {
    project_id: string;
    per_page?: number;
    page?: number;
}

class Project {
    getProjects(event:getProjectParams) {
        return {
            message: 'Go Serverless v1.0! Your function executed successfully!',
            input: event,
        };
    }
}

module.exports = Project;

export {}; // for TypeScript to recognize local scoping
