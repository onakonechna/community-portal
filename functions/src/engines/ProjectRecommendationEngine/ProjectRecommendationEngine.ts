import S3Adapter from './../S3Adapter';
import S3Connection from './../S3Connection';
import trainProjectRecommendationModel from './../../algorithms/trainProjectRecommendationModel';

const PROJECT_RECOMMENDATION_BUCKET = process.env.PROJECT_RECOMMENDATION_BUCKET;

interface ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any>;
}

function getRandomElements(array: any[], n: number) {
  const shuffled = array.sort(() => .5 - Math.random());
  return shuffled.slice(0,n);
}

export default class ProjectRecommendationEngine implements ProjectRecommendationEngineInterface {
  private adapter: any;

  constructor(s3: S3Connection) {
    this.adapter = new S3Adapter(s3);
  }

  getRecommendations(data: any): Promise<any> {
    const { last_visited, project_id } = data;

    // return this.adapter.get(PROJECT_RECOMMENDATION_BUCKET, 'recommended');
    
    const projects = [
      '8f1b18ab-907f-4c59-8778-f56154fd6c27',
      'd2de6415-403f-41d1-b722-c178653828c7',
      'b8c129ed-d004-4fa7-9012-61f3e95bd757',
      'e701e6b3-c39c-408e-9188-2df4e6fc6a81',
    ];
    return new Promise((resolve: any) => resolve({ recommended: getRandomElements(projects, 2) });
  }

  trainModel(data: any): Promise<any> {
    const { projects, traffic } = data;
    const model = trainProjectRecommendationModel(projects, traffic);
    return this.adapter.put(PROJECT_RECOMMENDATION_BUCKET, 'model', model);
  }
}
