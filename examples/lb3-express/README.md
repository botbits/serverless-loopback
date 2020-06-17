# examples/lb3-express

This example shows how to use the [serverless framework](https://www.serverless.com/framework/docs/providers/aws/) to run loopback3 (with express) in [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html).

## Overview

A RDS (MySQL) database is created, along with all necessary virtual AWS infrastructure (VPC, subnets, DBSubnetGroup) to connect a lambda function running loopback to the MySQL database. The MySQL connection parameters are retrieved from lambda environment variables.
<!--
For ease of management RDS (MySQL) username/password can be retrieved from [AWS SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) and used in `serverless.yml` [see section *Handling Secrets for Small Teams & Projects*]](https://serverless.com/blog/serverless-secrets-api-keys/). -->

Check out [this article](https://medium.com/smac-4u/serverless-loopback-9ff0d6fa539d) for a more in-depth explanation of this sample.

## About Sample Provided

The sample loopback application provided was created by following the process below:

1.  Using the command `npm run lb` and selecting:

-   What kind of application do you have in mind? `api-server (A LoopBack API server with local User auth)`

2.  Adding a new MySQL database to `lib/server/datasources.json`.

3.  Adding the CoffeeShop model and initializing it with data:

-   `lib/common/coffee-shop.json`: CoffeeShop model definition
-   `lib/server/model-config.json`: add CoffeeShop model so it can be loaded
-   `lib/server/boot/create-sample-models.js`: initialize CoffeeShop model with data

## Customizing & Deploying This Sample

The following steps can be used to customize this sample to your needs and then deploy:

<!-- 0. (*optional*) For ease of management add MySQL username/password to the AWS SSM Parameter Store (using [AWS Console(https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-console.html)] or [AWS CLI(https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-cli.html)]).
-->
1.  Create your own loopback models with the command `npm run lb-model`

2.  The RDS `mySqlDb` in `serverless.yml` is configured to be as low cost as possible (not suitable for production!) so feel free to [customize it to your needs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html).

3.  Deploy your project to AWS using the command `npm run sls-deploy`

4.  From the serverless `Stack Outputs`, retrieve `LoopbackApiExplorer` to access the loopback4 API explorer (it should look something like `https://API_GATEWAY_ID.execute-api.AWS_REGION.amazonaws.com/SERVERLESS_STAGE/api/explorer/`). You should end up with an URL similar to `https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/dev/api/explorer/`.

*Note*: An error might be observed the first time lambda runs after (re-)creating the RDS database as the CoffeeTable model table might not be initialized before your API is invoked. This error would look something like:

```json
{
    "error": {
        "statusCode": 500,
        "name": "Error",
        "message": "ER_NO_SUCH_TABLE: Table 'MY_TEST_DB.CoffeeShop' doesn't exist",
        "code": "ER_NO_SUCH_TABLE",
        "errno": 1146,
        "sqlMessage": "Table 'MY_TEST_DB.CoffeeShop' doesn't exist",
        "sqlState": "42S02",
        "index": 0,
        "sql": "SELECT count(*) as \"cnt\" FROM `CoffeeShop` ",
        "stack": "Error: ER_NO_SUCH_TABLE: Table 'MY_TEST_DB.CoffeeShop' doesn't exist\n    at ..."
    }
}
```

Retry after a few seconds and it all should work.

## Cleaning Up The Sample

Once you are done with the sample environment, avoid unnecessary AWS charges by removing your serverless deployment with the command `npm run sls-cleanup`.

If you run into a cleanup [error similar to the one below](https://forum.serverless.com/t/very-long-delay-when-doing-sls-remove-of-lambda-in-a-vpc/2535), you will need to manually remove the CloudFormation stack by going to: <https://console.aws.amazon.com/cloudformation> or using the [aws-cli](https://aws.amazon.com/cli/).

```shell
Serverless Error ---------------------------------------

  An error occurred: mySubnet2 - The subnet 'subnet-077e0f72824fe5dd3' has dependencies and cannot be deleted. (Service: AmazonEC2; Status Code: 400; Error Code: DependencyViolation; Request ID: XXX).
```

## License

MIT © [BotBits<sup>SM</sup>](https://github.com/botbits)
