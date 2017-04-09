# Parrotbot

Example/toy slack bot designed to be hosted in AWS

* TARGET_CHANNEL - the ID of the channel that parrotbot listens to
* PARROTBOT_TOKEN - the token used by parrotbot to authenticate with slack's Web API
* SLACK_TOKEN - the token issued by slack to prove that an Event API webhook orignates from slack

These may be set along with the code in the AWS Lambda console.

## Build it:

If you have typescript installed globally:

```shell
npm install && npm link typescript && npm run webpack
```

And if you don't:

```shell
npm install && npm install -g typescript && npm link typescript && npm run webpack
```

## Run it:

In Slack, create an app with a bot user, give it the correct permissions to post to channels. Generate the OAuth tokens.

The build should produce a js output file in `bin/slackEvents.min.js`. Copy the file into the Lambda in-line code editor,
set the environment variables mentioned above (using encryption!).

Using the API Gateway, expose a POST endpoint that routes requests to the lambda, **using AWS Lambda Proxy Integration**.
Deploy the API, and copy the url and use it to enable Event subscriptions for `message.channels` in both Team Events, and 
Bot Events.

Logs should be accessible from the Lambda console (CloudWatch link).