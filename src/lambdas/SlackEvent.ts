///<reference path="../../typings/index.d.ts"/>

import * as AWS from '../AWS'
import {ok, badRequest, MediaType} from '../Responses'
import {run, parseJson} from '../Utils'
import {logError, logInfo} from '../Logging'
import {WebApi} from "../slack/web/API";
import {Event as SlackEvent} from "../slack/events/models/Event"
import {AnyCallback as AnySlackCallback} from "../slack/events/models/Callback"
import {Message as SlackMessage} from "../slack/events/models/Message"
import {Challenge as SlackChallenge} from "../slack/events/models/Challenge"
import CallbackEventType from "../slack/events/CallbackEventTypes";
import EventType from "../slack/events/EventTypes";

function parseState(state: AWS.AnyState): Promise<AWS.State<SlackEvent>> {
    return new Promise((resolve, reject) => {
        try {
            let data = parseJson<SlackEvent>(state.aws.event.body);

            if(!data || !data.type) {
                reject(new Error(`Invalid slack request - missing type.`));
            } else {
                logInfo(JSON.stringify({data: data}));
                resolve({
                    aws: state.aws,
                    data: data
                });
            }
        } catch (e) {
            logError(`Creating request object from aws event threw ${e}. Body was ${state.aws.event.body}`);
            reject(e);
        }
    });
}

function printState(state: AWS.AnyState): void {
    try {
        logInfo(JSON.stringify(state));
    } catch (e) {
        logError(`Could not print state: ${e}`);
    }
}

function handleChallenge(state: AWS.State<SlackChallenge>): Promise<AWS.Result> {
    return new Promise((resolve, reject) => {
       let data = JSON.stringify({
           challenge: state.data.challenge
       });
       resolve({message: ok(data, MediaType.json)});
       logInfo(`Was challenged by slack - challenge code: ${state.data.challenge}`);
    });
}

function shouldRespond(message: SlackMessage): boolean {
        //it isn't us - bot messages use the 'username' not 'user' field
    return message.event.username !== 'parrotbot' &&
        //it's in the test channel
        message.event.channel === process.env.TARGET_CHANNEL;
}

function handleMessage(state: AWS.State<SlackMessage>): Promise<AWS.Result> {
    return new Promise((resolve) => {
        resolve({message: ok()});
        if(shouldRespond(state.data)) {
            WebApi.postMessage(state.data.event.channel, state.data.event.text)
                .then(_ => {
                    logInfo('Successful POST to slack.');
                })
                .catch(error => {
                    logError(`Failed to POST to slack!: ${error}`);
                });
        }
    });
}

function handleDebug(state: AWS.State<SlackEvent>): Promise<AWS.Result> {

    logInfo(`Handling debug request`);

    return new Promise<AWS.Result>(resolve => {
        let data = JSON.stringify({
           state: state
        });
       resolve({message: ok(data, MediaType.json)})
    });
}

function handleUnknownType(state: AWS.State<SlackEvent>): Promise<AWS.Result> {
    logError(`Unknown event type: ${state.data.type}`);
    return new Promise((resolve) => {
        resolve({message: badRequest(new Error('Unknown event type.'))});
    });
}

function handleGeneralEvent(state: AWS.State<AnySlackCallback>): Promise<AWS.Result> {
    logInfo(`Handling general event of type ${state.data.event.type}`);
    switch (state.data.event.type) {
        case CallbackEventType.message:
            return handleMessage(<AWS.State<SlackMessage>>state);
        default:
            return handleUnknownType(state);
    }
}

function handleUnauthorized() : Promise<AWS.Result> {
    logInfo(`Handling unauthorized event.`);
    return new Promise(resolve => {
       resolve({message: badRequest(new Error('No token.'))});
    });
}

function isFromSlack(event: AnySlackCallback): boolean {
    return event.token === process.env.SLACK_TOKEN;
}

function handleRequest(state: AWS.State<SlackEvent>): Promise<AWS.Result> {
    logInfo(`Handling event of type ${state.data.type}`);

    if(!isFromSlack(<AnySlackCallback>state.data)) {
        return handleUnauthorized();
    }

    switch (state.data.type) {
        case EventType.eventCallback:
            return handleGeneralEvent(<AWS.State<AnySlackCallback>>state);
        case EventType.challenge:
            return handleChallenge(<AWS.State<SlackChallenge>>state);
        case EventType.debug:
            return handleDebug(state);
        default:
            return handleUnknownType(state);
    }
}

const slackEventLambda: AWS.Lambda = s => {
    return parseState(s)
        .then(handleRequest);
};


export const handler = (event: AWS.Event, context: AWS.Context, callback: AWS.Callback) => {
    run(event, context, callback, slackEventLambda);
};