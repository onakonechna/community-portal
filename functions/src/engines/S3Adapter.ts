import { S3 } from 'aws-sdk';
import * as _ from 'lodash';

import S3Connection from './S3Connection';

export default class S3Adapter {
  private s3: S3;

  constructor(s3: S3Connection) {
    this.s3 = s3.connect();
  }

  put(bucketName: string, key: string, data: any): Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(data),
    };
    return this.s3.upload(params).promise();
  }

  get(bucketName: string, key: string): Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    return this.s3.getObject(params).promise();
  }

}
