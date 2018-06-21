import { Observable, Observer, Subject, ReplaySubject, from, of, range} from 'rxjs';
import { map, filter, switchMap, mergeMap, debounceTime, catchError } from 'rxjs/operators';
import {Logger} from 'log4js';

import * as Github from '@octokit/rest'



export interface PullRequests {

    retrieve(): any[]

}


export class GithubAPIInvoker implements PullRequests {
    
    logger: Logger
    gitHubToken
    github: Github
    prsListeners: Observer<any>[] = []
    commitsListeners: Observer<any>[] = []
    commitsBodyListeners: Observer<any>[] = []
    
    constructor(logger: Logger, gitHubToken) {
        this.logger = logger
        this.gitHubToken = gitHubToken

        this.github = new Github({
            headers: {
                "user-agent": "GitHub-Magento-Partners-Statistic" 
            },
            timeout: 5000
        });
        this.github.authenticate({
            type: "token",
            token: gitHubToken,
        })
    }

    getObservable(): Observable<Github.AnyResponse> {
        return from(
            this.github.pullRequests.getAll({
                owner: 'magento-engcom',
                repo: 'msi', 
                state: 'closed',
                sort: 'updated',
                direction: 'desc'
            })
        )
    }

    // createCommitObservable(pr) {
    //     return from(
    //         this.github.pullRequests.getCommits({
    //             owner: 'magento-engcom',
    //             repo: 'msi',
    //             direction: 'desc',
    //             number: pr.number
    //         })
    //     )
    // }

    addPRsListener(listener: Observer<any>) {
        this.prsListeners.push(listener)
    }

    addCommitsListener(listener: Observer<any>) {
        this.commitsListeners.push(listener)
    }

    addCommitsBodyListener(listener: Observer<any>) {
        this.commitsBodyListeners.push(listener)
    }

    processPrsResponse(PRsData)
    {
        // // const PRsData = PRs.pipe(mergeMap(responseData => {this.logger.debug("debug", responseData.meta); return responseData.data.map(pr => pr)}))
            
        // //     PRsData.subscribe(this.prsListeners[0])
            //.pipe(map(responseData => responseData.data.map(pr => of(pr.number))))
            // const commits = PRsData.pipe(
            //     mergeMap(pr =>  
            //         from(
            //             this.github.pullRequests.getCommits({
            //                 owner: 'magento-engcom',
            //                 repo: 'msi',
            //                 direction: 'desc',
            //                 number: pr.number
            //             })
            //         )
            //     )    
            // ).pipe(mergeMap(responseData => responseData.data.map(commit => commit)))
            // //.pipe(mergeMap(prNumber => prNumber))
            // commits.subscribe(this.commitsListeners[0])

            // commits.pipe(
            //     mergeMap(commit =>  
            //         from(
            //             this.github.repos.getCommit({
            //                 owner: 'magento-engcom',
            //                 repo: 'msi', 
            //                 sha: commit.sha
            //             })
            //         )
            //     ) 
            // ).pipe(map(responseData => responseData.data))
            // .subscribe(this.commitsBodyListeners[0])
    }

    getPrsStream(responseData) {
        if (responseData == null) {
            const prsObservable = from(
                this.github.pullRequests.getAll({
                    owner: 'magento-engcom',
                    repo: 'msi', 
                    state: 'closed',
                    sort: 'updated',
                    direction: 'desc'
                })
            ).pipe(
                catchError(error => {this.logger.debug(`Bad Promise: ${error}`); return of(`Bad Promise: ${error}`)})
            )
            prsObservable.subscribe(responseData => this.getPrsStream(responseData))
            this.subscribePrsListeners(prsObservable)
        } else if (this.github.hasNextPage(responseData)) {
            this.logger.debug("debug", "new request")
            const prsObservable = from(this.github.getNextPage(responseData))
            .pipe(
                catchError(error => {
                    this.logger.debug(`Bad Promise: ${error}`); 
                    this.logger.debug(`Retrying next page`); 
                    return debounceTime(5000).from(this.github.getNextPage(responseData))
                })
            )
            prsObservable
                .pipe(debounceTime(10000)) // wait 10 sec before getting next batch of PRs.
                .subscribe(responseData => this.getPrsStream(responseData))
            this.subscribePrsListeners(prsObservable)
        }
    }

    getCommitsStreamObservable(pr)
    {
        return from(
            this.github.pullRequests.getCommits({
                owner: 'magento-engcom',
                repo: 'msi',
                direction: 'desc',
                number: pr.number
            })
        )    
    }

    getCommitsStream(prsStream) {
        const commitsStream = prsStream
        .pipe(debounceTime(5000))
        .pipe(
            mergeMap(pr => this.getCommitsStreamObservable(pr)
            .pipe(
                catchError(error => {
                    this.logger.debug(`Bad Promise: ${error}`);
                    this.logger.debug(`Retrying: ${pr}`);
                    return this.getCommitsStreamObservable(pr)
                })
            ))
        )
        .pipe(mergeMap(responseData => responseData.data.map(commit => commit)))
        this.subscribeCommitsListeners(commitsStream)
    }

    getCommitsDataStreamObservable(sha) {
        return from(
            this.github.repos.getCommit({
                owner: 'magento-engcom',
                repo: 'msi', 
                sha: sha
            })
        )
    }

    getCommitsDataStream(commitsStream) {
        const commitsDataStream = commitsStream
        .pipe(debounceTime(5000)) // wait 5 sec before getting commits
        .pipe(
            mergeMap(commit =>  
                this.getCommitsDataStreamObservable(commit.sha).pipe(
                    catchError(error => {
                        this.logger.debug(`Bad Promise: ${error}`);
                        this.logger.debug(`Retrying: ${commit.sha}`);
                        return this.getCommitsDataStreamObservable(commit.sha)
                    })
                )
            )
        )
        .pipe(map(responseData => responseData.data))
        this.subscribeCommitsDataListeners(commitsDataStream)
    }

    subscribeCommitsDataListeners(commitsDataStream) {
        commitsDataStream.subscribe(this.commitsBodyListeners[0])
    }

    subscribeCommitsListeners(commitsStream) {
        commitsStream.subscribe(this.commitsListeners[0])
        this.getCommitsDataStream(commitsStream)
    }

    subscribePrsListeners(prsObservable) {
        const prsStream = prsObservable.pipe(
            mergeMap(responseData => responseData.data.map(pr => pr))
        )
        prsStream.subscribe(this.prsListeners[0])
        this.getCommitsStream(prsStream)
    }

    retrieve() {

        this.getPrsStream()
        //.
        //    subscribe(responseData => this.getPrsStream(responseData))
        // this.getPrsStream().pipe(
        //     mergeMap(responseData => this.getPrsStream(responseData))
        // ).subscribe(this.prsListeners[0])

        // if (this.prsListeners.length > 0 || this.commitsListeners.length > 0) {
        //     let PRs = from(
        //         this.github.pullRequests.getAll({
        //             owner: 'magento-engcom',
        //             repo: 'msi', 
        //             state: 'closed',
        //             sort: 'updated',
        //             direction: 'desc'
        //         })
        //     )
        //     //this.processPrsResponse(PRs)
        //     let PRsData = PRs.pipe(mergeMap(responseData => {
        //         //this.logger.debug("debug", responseData.meta); 
        //         return responseData.data.map(pr => pr)}))
        //     PRsData.subscribe(this.prsListeners[0])
        //     this.processPrsResponse(PRsData)
        //     let hasNext = true;
        //     //while (hasNext) {
        //         let PRSpipe = PRs.pipe(
        //             mergeMap(
        //                 responseData => {
        //                     this.logger.debug("response", responseData.meta)
        //                     if (this.github.hasNextPage(responseData)) {
        //                         this.logger.debug('info', 'Process Next Page')
        //                         PRs = from(this.github.getNextPage(responseData))
                                
        //                     } else (
        //                         hasNext = false
        //                     )
        //                     return PRs;
        //                 }
        //             )
        //         )
        //         PRSpipe.subscribe(prs => {
        //             this.logger.debug("prs", prs)
        //             if (hasNext) {
        //                 PRsData = prs.pipe(mergeMap(responseData => {
        //                     //this.logger.debug("debug", responseData.meta); 
        //                     return responseData.data.map(pr => pr)}))
        //                 PRsData.subscribe(this.prsListeners[0])
        //                 this.processPrsResponse(PRsData)
        //             }
        //         })

                
            //}
            
            
            
            
            
            

            
            // .pipe(mergeMap(
            //     data => {
            //     //this.logger.debug("outer value", data)
            //         return data.data.map(pr => of(pr.number))
            //     }, (prs, comments, outerIndex, innerIndex) => [prs, comments]
            // )).subscribe(this.prsListeners[0])

            
            // if (this.commitsListeners.length > 0) {
            //     PRs.subscribe(commitObservable => {
            //         for (const subscriber of this.commitsListeners) {
            //             commitObservable.subscribe(subscriber)
            //         }
            //     })
                
            // }
            
            // for (const subscriber of this.prsListeners) {
            //     PRs.subscribe(subscriber)
            // }

        }
        
        
        
        
        
        //.map(data => console.log(data))
        
        //.subscribe(subscriber)//.switchMap(prs => console.log(prs))
        
        
        // from(
        //     this.github.pullRequests.getAll({
        //         owner: 'magento-engcom',
        //         repo: 'msi', 
        //         state: 'closed',
        //         sort: 'updated',
        //         direction: 'desc'
        //     })
        // ).pipe(
        //     mergeMap(val => val.data.map(pr => pr
        //     ))
        // //)
        // )
    
    
    //observable.subscribe(subscriber)
    //observable.subscribe(subscriber)


   


    //)//
            
        // of ('Hello')
        // .pipe(mergeMap(val => of(`${val} World!`))).subscribe(subscriber)

        // this.getObservable()
        //     .subscribe(subscriber)
            //.subscribe(this.createCommitObservable)
        
        //.
        
        
        //then(subscriber).catch(e => this.logger.debug("error", e))

        // range(1, 200)
        //     .pipe(filter(x => x % 2 === 1), map(x => x + x))
        //     .subscribe(subscriber);
        return []
    }
}
