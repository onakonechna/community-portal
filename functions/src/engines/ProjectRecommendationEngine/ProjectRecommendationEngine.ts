import S3Adapter from './../S3Adapter';
import S3Connection from './../S3Connection';

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
}
