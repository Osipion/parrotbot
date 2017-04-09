import {ResponseData} from './ResponseData'
import {Response} from "../../../Response";

export interface ChannelResponseData extends ResponseData {
    channel: string
}

export type ChannelResponse = Response<ChannelResponseData>;