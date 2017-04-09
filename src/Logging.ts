///<reference path="../typings/index.d.ts"/>

function sanitize(message: string): string {
    return message.replace(process.env.PARROTBOT_TOKEN, '{PARROTBOT_TOKEN}')
        .replace(process.env.SLACK_TOKEN, '{SLACK_TOKEN}');
}

function log(type: string, message: string): void {
    logger(sanitize(`<LOGS>[${type}] ${message}`));
}


export let logger: (message: string) => void = console.log;

export function setLogger(method: (message: string) => void): void {
    logger = method;
}

export function logInfo(message: string): void {
    log('INFO', message);
}

export function logError(message: string): void {
    log('ERROR', message);
}

export function logWarning(message: string): void {
    log('WARN', message);
}

export function logDebug(message: string): void {
    log('DEBUG', message);
}