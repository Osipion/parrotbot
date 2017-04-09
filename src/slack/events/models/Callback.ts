import {Event} from './Event'

export interface Callback<T extends Event> extends Event {
    token: string,
    api_app_id: string,
    event: T,
    authed_users: string[]
}


export type AnyCallback = Callback<any>;