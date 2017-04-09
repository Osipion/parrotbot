export default class CallbackEventType {

    static get all(): [string] {
        return [
            CallbackEventType.message
        ];
    }

    static get message(): string {
        return 'message';
    }
}
