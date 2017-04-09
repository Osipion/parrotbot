export default class EventType {

    static get all(): [string] {
        return [
            EventType.challenge,
            EventType.eventCallback,
            EventType.debug
        ];
    }

    static get challenge(): string {
        return 'url_verification';
    }

    static get debug(): string {
        return 'debug';
    }

    static get eventCallback(): string {
        return 'event_callback';
    }
}