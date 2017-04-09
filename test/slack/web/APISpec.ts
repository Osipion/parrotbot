import * as API from '../../../src/slack/web/API'
import {RequestOptions} from 'https'

describe('Slack WebApi', () => {

    let requestOptionsSeen: RequestOptions[] = [];
    let pbToken = process.env.PARROTBOT_TOKEN;

    let goodClient: API.Client = (opts, body?) => {
        requestOptionsSeen.push(opts);
        return new Promise((resolve) => {
            resolve({
                statusCode: 200,
                host: opts.host,
                path: opts.path,
                method: opts.method,
                body: '{"some": "json"}'
            });
        });
    };

    let invalidJsonClient: API.Client = (opts, body?) => {
        return goodClient(opts, body)
            .then(r => {
                r.body = 'invalid json';
                return r;
            });
    };

    beforeAll(() => {
        process.env.PARROTBOT_TOKEN = '7898!iuqhbba';
    });

    afterAll(() => {
        process.env.PARROTBOT_TOKEN = pbToken;
    });

    beforeEach(() => {
        requestOptionsSeen = []
    });

    describe('postMessage()', () => {
        it('sets the correct request parameters', () => {
            return API.WebApi.postMessage('channel1', 'message1', goodClient)
                .then(_ => {
                    expect(requestOptionsSeen.length).toBe(1);
                    expect(requestOptionsSeen[0].path)
                        .toEqual(`/api/chat.postMessage?token=${process.env.PARROTBOT_TOKEN}&channel=channel1&text=message1&link_names=true`);
                });
        });
        it('parses the response body', () => {
            return API.WebApi.postMessage('channel1', 'message1', goodClient)
                .then(r => {
                    expect(requestOptionsSeen.length).toBe(1);
                    expect(r.body['some']).toEqual('json');
                });
        });
        it('throws if parsing the body fails', (done) => {
            API.WebApi.postMessage('channel1', 'message1', invalidJsonClient)
                .then(r => fail('Invalid json still called "resolve"'))
                .catch(e => {
                    expect(typeof e).toBe('object');
                    expect(e.message).toBe('Could not parse response!');
                    done();
                });
        });
        it('encodes messages correctly', (done) => {
            API.WebApi.postMessage('channel1', 'abc def/&`', goodClient)
                .then(r => {
                    expect(requestOptionsSeen.length).toBe(1);
                    expect(requestOptionsSeen[0].path)
                        .toEqual(`/api/chat.postMessage?token=${process.env.PARROTBOT_TOKEN}&channel=channel1&text=abc%20def%2F%26%60&link_names=true`);
                    done();
                });
        });
    });
});