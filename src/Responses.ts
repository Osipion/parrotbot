
import * as AWS from './AWS'

export class MediaType {
    static get json(): string {
        return 'application/json';
    }
    static get text(): string {
        return 'text';
    }
    static get html(): string {
        return 'text/html';
    }
}

function newHeaders(data?: string, mediaType?: string): {[name: string]: string} {
    let headers: {[name: string]: string} = {};

    if(data) {
        headers = {};
        headers['Content-Length'] = data.length.toString();
        if(!mediaType) {
            mediaType = MediaType.json
        }
        headers['Content-Type'] = mediaType;
    }

    return headers;
}

export function ok(data?: string, mediaType?: string): AWS.Response {
    return {
        statusCode: 200,
        headers: newHeaders(data, mediaType),
        body: data
    }
}

function errorResponse(statusCode: number, error?: Error): AWS.Response {
    let data = error ? JSON.stringify({error: error.message}) : undefined;
    let mediaType = error ? MediaType.json : undefined;

    return {
        statusCode: statusCode,
        headers: newHeaders(data, mediaType),
        body: data
    }
}

export function badRequest(error?: Error): AWS.Response {
    return errorResponse(400, error);
}

export function serverError(error?: Error): AWS.Response {
    return errorResponse(500, error);
}