import * as _ from 'lodash';

import S3Adapter from './../S3Adapter';
import S3Connection from './../S3Connection';
import trainProjectRecommendationModel from './../../algorithms/trainProjectRecommendationModel';

const PROJECT_RECOMMENDATION_BUCKET = process.env.PROJECT_RECOMMENDATION_BUCKET;

interface ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any>;
  getDefaultRecommendations(data: any): Promise<any>;
  trainModel(data: any): Promise<any>;
}

function getSignature(array: string[]) {
  return JSON.stringify(array);
}

function makePromise(data: any) {
  return new Promise((resolve: any) => resolve(data));
}

export default class ProjectRecommendationEngine implements ProjectRecommendationEngineInterface {
  private adapter: any;

  constructor(s3: S3Connection) {
    this.adapter = new S3Adapter(s3);
  }

  getRecommendations(data: any): Promise<any> {
    const { last_visited, project_id } = data;

    const state: any = [];
    last_visited.slice().reverse().forEach((prev_state: any) => state.push(prev_state.project_id));
    state.push(project_id);

    return new Promise((resolve: any) => {
      this.adapter.get(PROJECT_RECOMMENDATION_BUCKET, getSignature(state))
        .then((result: any) => resolve(result))
        .catch((error: any) => resolve());
    });
  }

  getDefaultRecommendations(data: any): Promise<any> {
    return new Promise((resolve: any) => {
      this.adapter.get(PROJECT_RECOMMENDATION_BUCKET, 'defaultRecommendations')
        .then((result: any) => resolve(result))
        .catch((error: any) => resolve());
    });
  }

  trainModel(data: any): Promise<any> {
    const { projects, traffic } = data;
    const promises: any = [];
    const {
      recommendations,
      defaultRecommendations,
    } = trainProjectRecommendationModel(projects, traffic);

    promises.push(this.adapter.put(
      PROJECT_RECOMMENDATION_BUCKET,
      'defaultRecommendations',
      defaultRecommendations,
    ));
    _.forOwn(recommendations, (recommendations: string[], signature: string) => {
      promises.push(this.adapter.put(PROJECT_RECOMMENDATION_BUCKET, signature, recommendations));
    });

    return Promise.all(promises);
  }

  // special method
  null(data: any): Promise<any> {
    return makePromise({});
  }
}
