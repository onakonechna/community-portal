import { S3 } from 'aws-sdk';

const IS_OFFLINE = process.env.IS_OFFLINE;

export default class S3Connection {

  connect() {
    if (IS_OFFLINE === 'true') {
      return new S3({
        s3ForcePathStyle: true,
        endpoint: 'http://localhost:8888',
      });
    }
    return new S3();
  }

}
