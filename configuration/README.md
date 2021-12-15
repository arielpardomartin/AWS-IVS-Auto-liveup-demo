## Configuration

### Prerequisites

* [Node.js version 14.0.0 or later](https://nodejs.org/) to run Node scripts
* [AWS account](https://aws.amazon.com/) to create resources
* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to run scripts
* [Git Bash](https://git-scm.com/) to run Bash scripts (only on Windows)

<br>

### Configure interval seconds

You can configure the stream on/off interval. For instance, if you configure 60 seconds, it will stream for 1 minute, then stop for 1 minute and so on.This value can be configured by modifying the **intervalSeconds** field value in the [config.json](config.json) file, which already contains a default configuration, and running the script:

```shell
bash configure-interval-seconds.sh
```

> **Of note:**<br>
> When performing this configuration, it will take a minute or so for the backend to be restarted and for the frontend to be updated. Then, you will have to restart the player in order to complete the update.

<br>

## Scripts included in this folder

This section includes details of every script present in this folder for informational purposes. You only need to run the scripts described in the **Configuration** section above.

<br>

### configure-interval-seconds.sh

Calls the [getConfig.js](#getConfigjs) script to load the `intervalSeconds` parameter value from the **config.json** file; then, calls the [getStackName.js](#getStackNamejs) script to retrieve the stack name; next, calls the **deployment/setup-images.sh** script with the retrieved values to build and push a new Stream service image with the new value of the *INTERVAL_SECONDS* environment variable; finally, updates the Stream service to take the new image using the AWS CLI.

Parameters: None

Example:

```shell
bash configure-interval-seconds.sh
```

<br>

### getCloudFrontDistributionId.js

Retrieves the Cloudfront distribution ID from the **deployment/stack.json** file.

Parameters: None

Example:

```shell
node getCloudFrontDistributionId.js
```

<br>

### getConfig.js

Retrieves the value for the provided key from the **configuration-parameters.json** file.

Parameters:
1) KEY (required)

Example:

```shell
node getConfig.js debugConfidenceThreshold
```

<br>

### getStackName.js

Retrieves the CloudFormation stack name from the **deployment/stack.json** file.

Parameters: None

Example:

```shell
node getStackName.js
```