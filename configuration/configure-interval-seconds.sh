#!/bin/bash

CLUSTER_NAME=auto-live-up-demo-ecs-cluster-<RANDOM_SUFFIX>
SERVICE_NAME=auto-live-up-demo-stream-service-<RANDOM_SUFFIX>

printf "\nLoading new interval seconds value from file 'configuration/config.json'...\n"
INTERVAL_SECONDS=$(node getConfig.js intervalSeconds)

printf "\nRetrieving stack name...\n"
STACKNAME=$(node getStackName.js)

printf "\nBuilding and pushing Stream service image...\n"
bash ../deployment/setup-images.sh \
1 \
$STACKNAME \
$INTERVAL_SECONDS

printf "\n# Restarting task...\n"
aws ecs stop-task \
--cluster "$CLUSTER_NAME" \
--task $(aws ecs list-tasks \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --output text --query taskArns[0]) \
    1> /dev/null
if [ $? != 0 ]; then exit 1; fi

printf "\nWaiting for service to be stable...\n"
aws ecs wait services-stable \
	--cluster $CLUSTER_NAME \
	--services $SERVICE_NAME

printf "\nService successfully updated!\n"

printf "\nBuilding and deploying Player application...\n"
cd ../deployment
bash deploy-player-app.sh stack.json
cd ../configuration

printf "\nRetrieving CloudFront distribution ID...\n"
CLOUDFRONT_DISTRIBUTION_ID=$(node getCloudfrontDistributionId.js)

printf "\nInvalidating cached files from CloudFront distribution...\n"
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    1> /dev/null
if [ $? != 0 ]; then exit 1; fi

printf "\nPlayer successfully updated! Please, reload page to visualize the new version.\n"