# examples/lb4-express

This example shows how to use the [serverless framework](https://www.serverless.com/framework/docs/providers/aws/) to run loopback4 (with express) in [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html).

## Overview

A RDS (MySQL) database is created, along with all necessary virtual AWS infrastructure (VPC, subnets, DBSubnetGroup) to connect a lambda function running loopback4 to the MySQL database. The MySQL connection parameters are retrieved from lambda environment variables.
<!--
For ease of management RDS (MySQL) username/password can be retrieved from [AWS SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) and used in `serverless.yml` [see section *Handling Secrets for Small Teams & Projects*]](https://serverless.com/blog/serverless-secrets-api-keys/). -->

<!--
Check out [this article](https://medium.com/smac-4u/serverless-loopback-9ff0d6fa539d) for a more in-depth explanation of this sample.
-->

## About Sample Provided

The sample loopback4 application provided was created by following the process below:

1.  Create an Express Application with LoopBack REST API by following [this tutorial](https://loopback.io/doc/en/lb4/express-with-lb4-rest-tutorial.html). We followed the shortcut by running the command `lb4 example express-composition`.

2.  Remove the `file` parameter from the [memory datasource](src/datasources/ds.datasource.ts) to avoid lambda errors.

3.  Create the following files required to deploying it all to AWS Lambda using the [serverless framework](https://www.serverless.com/framework/docs/providers/aws/):

    -   [`src/lambda-wrapper.js`](src/lambda-wrapper.js): this file uses [`serverless-http`](https://www.npmjs.com/package/serverless-http) to wrap the loopback4 application via [express](https://www.npmjs.com/package/express).

    -   [`serverless.yml`](serverless.yml): our [*serverless* service definition](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml/). Here is where we create all AWS resources (including Lambda, and API Gateway).

4.  Update your `tsconfig.json` file to include `"allowJs": true` in your `compilerOptions` section to ensire the [`src/lambda-wrapper.js`](src/lambda-wrapper.js) file is included in the loopback4 build.

5.  Install the `serverless-http` module and its dependencies with command `npm install serverless-http`.

6.  Install the `serverless` module and its dependencies with command `npm install -D serverless`.

7.  As we planed to troubleshoot locally, we installed the `serverless-offline` module and its dependencies with command `npm install -D serverless-offline`.

8.  In order to ensure your loopback4 application is built prior to deploying it to AWS Lambda or running it locally we included the following scripts in the `package.json` file:

```
    "presls-deploy": "npm run build",
    "sls-deploy": "serverless deploy --verbose",
    "sls-cleanup": "serverless remove --verbose",
    "presls-offline": "npm run build",
    "sls-offline": "serverless offline",
```

Please note that `serverless-http` also supports [other web frameworks](https://www.npmjs.com/package/serverless-http#supported-frameworks). The loopback support indicated is for [`@loopback-rest`](https://www.npmjs.com/package/@loopback/rest). Please feel free to contribute your examples of using loopback4 with other web frameworks under the `examples` folder.

## Customizing & Deploying This Sample

The following steps can be used to customize this sample to your needs and then deploy:

<!-- 0. (*optional*) For ease of management add MySQL username/password to the AWS SSM Parameter Store (using [AWS Console(https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-console.html)] or [AWS CLI(https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-cli.html)]).
-->
1.  Create your own loopback models, datasources, repositories, and controllers.

2.  Deploy your project to AWS using the command `npm run sls-deploy`

3.  From the serverless `Stack Outputs`, retrieve `LoopbackApiExplorer` to access the loopback4 API explorer (it should look something like `https://API_GATEWAY_ID.execute-api.AWS_REGION.amazonaws.com/SERVERLESS_STAGE/api/explorer/`). You should end up with an URL similar to `https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/dev/api/explorer/`.

4.  From the lopback4 API explorer download the `openapi.json` file and [import it into Postman](https://learning.postman.com/docs/postman/collections/importing-and-exporting-data/#importing-api-specifications). After importing, make sure to edit the imported collection and change the `baseUrl` variable to the value of the serverless `LoopbackPostman` `Stack Outputs`. This will make sure Postman works with your serverless API Gateway rather than the loopback4 only path.

## Cleaning Up The Sample

Once you are done with the sample environment, avoid unnecessary AWS charges by removing your serverless deployment with the command `npm run sls-cleanup`.

## Known Issues

While the serverless deployment works fine, invoking the API through API explorer never reaches API Gateway as CloudFront responds with Code 403:

**Response body**
```
{
  "message": "Forbidden"
}
```
**Response headers**
```
 content-length: 24
 content-type: application/json
 date: Sun14 Jun 2020 14:14:09 GMT  via: 1.1 0dfe6f02dbba7c39906cae47653ae6b3.cloudfront.net (CloudFront)
 x-amz-apigw-id: OOYDwFjZiYcFSAA=
 x-amz-cf-id: 3SvwvE27qb1KIrS34rgRRwet-QOkfZyFeJOIMUbHMgi6dA5-BgBEeg==
 x-amz-cf-pop: DEN50-C2
 x-amzn-errortype: ForbiddenException
 x-amzn-requestid: 31a0c024-6ffe-4c3c-b9d9-adfca9add4b0
 x-cache: Error from cloudfront
 x-firefox-spdy: h2
```
## License

MIT © [BotBits<sup>SM</sup>](https://github.com/botbits)
