import {MessageResponseItem} from "./MessageResponseItem";
import {ChannelResponseData} from "./ChannelResponse";
import {Response} from "../../../Response";

export interface PostMessageResponseData extends ChannelResponseData {
    message: MessageResponseItem
}

export type PostMessageResponse = Response<PostMessageResponseData>;