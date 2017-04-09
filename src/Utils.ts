///<reference path="../typings/index.d.ts"/>

import * as AWS from "./AWS";
import * as https from 'https';
import {serverError} from './Responses'
import {logError, logInfo} from './Logging'
import {RawResponse} from "./Response";

export function parseJson<T>(json: string): T {
    try {
        return <T>JSON.parse(json);
    } catch (e) {
        return null;
    }
}

export function send(options: https.RequestOptions, body?: string): Promise<RawResponse> {

    logInfo(`Starting to post message`);

    return new Promise<RawResponse>((resolve, reject) => {
        let request = https.request(options, r => {
            let res = {
                statusCode: r.statusCode,
                host: options.host,
                path: options.path,
                method: r.method,
                body: ''
            };

            r.on('data', d => {
                res.body += d;
            });

            r.on('error', e => {
                logError(`Error: failed to post to ${res.host}${res.path} - ${e}`);
                reject(e);
            });

            r.on('end', () => {
                if (res.body) {
                    logInfo(res.body);
                }
                if (r.statusCode > 199 && r.statusCode < 300) {
                    logInfo(`Completed posting message to ${res.host}${res.path}`);
                    resolve(res);
                } else {
                    reject(new Error(`Error: failed to post to ${res.host}${res.path} - ${r.statusCode}`))
                }
            });
        });
        if (body) {
            request.write(body);
        }
        request.end();
    });
}


export function run(event: AWS.Event, context: AWS.Context, callback: AWS.Callback, lambda: AWS.Lambda): void {
    let state: AWS.AnyState = {
        aws: {
            event: event,
            context: context
        }
    };
    logInfo(JSON.stringify({state: state}));
    lambda(state)
        .then((result: AWS.Result) => {
            logInfo('Completed request with result: ' + JSON.stringify(result, null, 2));
            if (result.error) {
                callback(null, serverError(result.error));
            } else {
                callback(null, result.message);
            }
        }).catch((error: Error) => {
        callback(null, serverError(error))
    });
}