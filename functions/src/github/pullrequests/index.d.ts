declare namespace PullRequest {
    export interface Repo {
        name: string;
        full_name: string;
    }

    export interface Branch {
        user: User
        repo: Repo
    }

    export interface User {
        id: number;
        login: string
    }

    export interface PullRequest {
        id: number;
        number: number;
        state: string;
        title: string;
        created_at: string;
        merged_at?: string;
        closed_at: string;
        updated_at: string;
        labels: string[];
        user: User;
        head: Branch;
        base: Branch;
    }
}