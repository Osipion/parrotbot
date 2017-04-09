import {Event} from "./Event";

export interface Challenge extends Event {
    challenge: string
    token: string
}