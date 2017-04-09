
import {PostMessageResponse, PostMessageResponseData} from "./models/PostMessageResponse";
import {RequestOptions} from 'https'
import {RawResponse, Response} from "../../Response";
import {send, parseJson} from '../../Utils'


export type Client = (options: RequestOptions, body?: string) => Promise<RawResponse>

export class WebApi {

    static postMessage(channel: string, text: string, client: Client = send): Promise<PostMessageResponse> {
        text = text ? encodeURIComponent(text) : '';
        let opts = {
            host: 'slack.com',
            path: `/api/chat.postMessage?token=${process.env.PARROTBOT_TOKEN}&channel=${channel}&text=${text}&link_names=true`,
            method: 'POST'
        };

        return client(opts)
            .then(r => WebApi.parseResponse<PostMessageResponseData>(r));
    }

    private static parseResponse<T>(response: RawResponse): Promise<Response<T>> {
        return new Promise<Response<T>>((resolve, reject) => {
            let data = parseJson<T>(response.body);
            if (!data) {
                reject(new Error('Could not parse response!'));
            } else {
                //make the type system accept that we are going to change the apparent type of the instance
                //and just assign the parsed JS object over the old string
                let cast = <Response<T>><any>response;
                cast.body = data;
                resolve(cast);
            }
        });
    }
}