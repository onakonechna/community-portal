import * as AWS from 'aws-sdk';
import * as AWSConfig from 'aws-sdk/lib/config'

export class Context
{
    configuration: AWSConfig.Config

    constructor(configuration) {
        this.configuration = AWS.config
        this.configuration.update(configuration);
    }

    getConfig(): AWSConfig.Config {
        return this.configuration
    }
}