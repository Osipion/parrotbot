
export interface Event {

}

export interface EventData<T> {
    type: "event_callback",
    token: string,
    api_app_id: string,
    team_id: string,
    event: T,
    authed_users: string[]
}
