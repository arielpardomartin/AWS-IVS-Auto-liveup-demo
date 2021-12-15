#!/bin/bash

# Validate that the required parameters are given
if [ -z $1 ]; then
	printf "\n\nIS_CONFIGURING_STREAM parameter is required" && exit 1
fi

if [ -z $2 ]; then
	printf "\n\nSTACKNAME parameter is required" && exit 1
fi

if [ -z $3 ]; then
	printf "\n\nINTERVAL_SECONDS parameter is required" && exit 1
fi

IS_CONFIGURING_STREAM=$1
STACKNAME=$2
INTERVAL_SECONDS=$3

# Setup variables
AWS_REGION=$(aws configure get region)
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
STREAM_REPOSITORY_NAME=auto-live-up-demo-stream-images-<RANDOM_SUFFIX>

# Log in into registry
printf "\n\nLogging in into default private registry...\n"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
if [ $? != 0 ]; then exit 1; fi

cd ../serverless

# Build and push Stream service image
if [ $IS_CONFIGURING_STREAM -eq 0 ]; then
	printf "\n\nCreating image repository for Stream service...\n"
	aws ecr create-repository --repository-name $STREAM_REPOSITORY_NAME
fi
printf "\n\nBuilding and pushing Stream service image...\n"
cd ./stream-service
docker build -q -t $ECR_REGISTRY/$STREAM_REPOSITORY_NAME:latest \
--build-arg ENV_INTERVAL_SECONDS="$INTERVAL_SECONDS" .
docker push $ECR_REGISTRY/$STREAM_REPOSITORY_NAME:latest
if [ $? != 0 ]; then exit 1; fi

printf "\n\nECS container images setup complete!\n"