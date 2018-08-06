import { S3, Endpoint } from 'aws-sdk';

const IS_OFFLINE = process.env.IS_OFFLINE;

export default class DatabaseConnection {

  connect() {
    if (IS_OFFLINE === 'true') {
      return new S3({
        s3ForcePathStyle: true,
        endpoint: new Endpoint('http://localhost:8888'),
      });
    }
    return new S3();
  }

}
