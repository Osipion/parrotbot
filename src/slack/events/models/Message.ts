import {Event} from "./Event";
import {Callback} from "./Callback";

export interface MessageEvent extends Event {
    channel: string,
    username: string,
    text: string,
    user: string
}

export type Message = Callback<MessageEvent>