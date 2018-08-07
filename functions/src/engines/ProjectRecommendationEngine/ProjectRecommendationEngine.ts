import S3Adapter from './../S3Adapter';
import S3Connection from './../S3Connection';
import trainProjectRecommendationModel from './../../algorithms/trainProjectRecommendationModel';

const PROJECT_RECOMMENDATION_BUCKET = process.env.PROJECT_RECOMMENDATION_BUCKET;

interface ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any>;
}

export default class ProjectRecommendationEngine implements ProjectRecommendationEngineInterface {
  private adapter: any;

  constructor(s3: S3Connection) {
    this.adapter = new S3Adapter(s3);
  }

  getRecommendations(data: any): Promise<any> {
    const { last_visited, project_id } = data;

    return this.adapter.get(PROJECT_RECOMMENDATION_BUCKET, 'recommended');
  }

  trainModel(data: any): Promise<any> {
    const { projects, traffic } = data;
    const model = trainProjectRecommendationModel(projects, traffic);
    return this.adapter.put(PROJECT_RECOMMENDATION_BUCKET, 'model', model);
  }
}
