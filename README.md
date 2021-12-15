# Amazon IVS Auto-Live Up Web demo

A demo web application for demonstrating how you can use Amazon IVS in conjunction with Amazon EventBridge to start a stream without refreshing the page.

![Auto-Live Up demo](auto-live-up-demo.jpg)

**This project is intended for education purposes only and not for production usage.**

This is a serverless web application, leveraging [Amazon IVS](https://aws.amazon.com/ivs/), [Amazon EventBridge](https://aws.amazon.com/eventbridge/), [Amazon ECS](https://aws.amazon.com/ecs/), [Amazon API Gateway](https://aws.amazon.com/api-gateway/), [AWS Lambda](https://aws.amazon.com/lambda/), [Amazon DynamoDB](https://aws.amazon.com/dynamodb), [Amazon S3](https://aws.amazon.com/s3/) and [Amazon CloudFront](https://aws.amazon.com/cloudfront/). The web user interface is a single page application built using [React](https://reactjs.org/) and the [Amazon IVS Player](https://docs.aws.amazon.com/ivs/latest/userguide/player.html). The demo showcases how you can automatically start an Amazon IVS stream using Amazon EventBridge. This demo uses [Amazon API Gateway WebSockets](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html) to send remaining time until stream start to connected clients.

<br>

## Getting Started

⚠️ **IMPORTANT NOTE:** *Deploying this demo application in your AWS account will create and consume AWS resources, which will cost money.*

To get the demo running in your own AWS account, follow these instructions.

1. If you do not have an AWS account, please see [How do I create and activate a new Amazon Web Services account?](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
2. Log into the [AWS console](https://console.aws.amazon.com/) if you are not already. Note: If you are logged in as an IAM user, ensure your account has permissions to create and manage the necessary resources and components for this application.
3. Follow the instructions for deploying to AWS.

### Deploying to AWS

* This demo is comprised of two parts: `serverless` (the demo backend) and `web-ui` (the demo frontend).
* To use this demo, follow the [deployment instructions](./deployment/README.md).
* To configure the demo (optional), follow the [configuration instructions](./configuration/README.md).

<br>

## Architecture

![Architecture](architecture.jpg)

<br>

## Known issues and limitations

* The application was written for demonstration purposes and not for production use. 
* Currently only tested in **us-west-2 (Oregon)** and **us-east-1 (N. Virginia)** regions. Additional regions may be supported depending on service availability.
* Countdown marker may not be displayed correctly if player size is too small

<br>

## About Amazon IVS

Amazon Interactive Video Service (Amazon IVS) is a managed live streaming solution that is quick and easy to set up, and ideal for creating interactive video experiences. [Learn more](https://aws.amazon.com/ivs/).

* [Amazon IVS docs](https://docs.aws.amazon.com/ivs/)
* [User Guide](https://docs.aws.amazon.com/ivs/latest/userguide/)
* [API Reference](https://docs.aws.amazon.com/ivs/latest/APIReference/)
* [Learn more about Amazon IVS on IVS.rocks](https://ivs.rocks/)
* [View more demos like this](https://ivs.rocks/examples)