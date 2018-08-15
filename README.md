# Community Portal

Community Engineering team is a bridge between community of open-source developers and the Magento organization. Together with community we develop open-source projects of different complexity, starting from small improvements to the large-scale project which lasts for years. Recently we came to understanding that in order to expand our business objectives, we need more tools to communicate with open-source community, share ideas and get their feedback. 

Specifically, one area of the focus are the projects itself. From one side, we have Magento team where product managers create a list of features (backlog) they'd like to have implemented so that product can address more functional requests. From the other side, there is a community, who want to participate in important project, while every member has own set of skills and interest. Letting contributors to express interest in the projects would help product organization to understand what projects would be moving faster and what projects are of less interest. For the contributors, it is a way to see the activity on the projects, personal ranking and organize around those activities.


# Setup

Please see [Setup](https://github.com/magento-engcom/community-portal/wiki/Setup) section on wiki

# Contributing
Contribution to this project happens through the pull requests. Pull request should be related to the issue

# Definition of Done
- code is covered with automated tests and tests are passing on CI/CD
- static tests are passing for the code
- code review passed
- code fulfills the acceptance criteria of the issue

# Technologies
System is written in TypeScript which is strictly-typed language compatible with the Javascript. It is not natively supported neither by NodeJS nor in browsers, that's why we will transpile it in ES6 syntax.

## Backend

- Serverless.js
- TypeScript https://www.typescriptlang.org/
- Nodejs V8.10
- AWS DynamoDB
- AWS Lambda
- AWS API Gateway

## Frontend

- React, Redux, Google Material Design
- AWS S3
- Chart Library (i.e D3)

# Code Structure

Code consists of two parts: frontend and backend. 
- Frontend resides in the `frontend` directory and is packaged with the webpack.
- Backend is in `functions` directory and is implemented as serverless functions mapped to the HTTP endpoints. They should be deployed using `sls deploy`


