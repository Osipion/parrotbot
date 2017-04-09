export interface Event {
    resource?: string
    path?: string
    httpMethod: string
    headers: {[name: string]: string}
    queryStringParameters?: {[name: string]: string}
    pathParameters?: {[name: string]: string}
    body?: string
}

export interface Context {
    callbackWaitsForEmptyEventLoop?: boolean,
    logGroupName?: string,
    logStreamName?: string,
    functionName: string,
    memoryLimitInMB?: string,
    functionVersion?: string,
    invokeid?: string,
    awsRequestId?: string,
    invokedFunctionArn?: string
}

export interface Response {
    statusCode: number,
    headers: {[name: string]: string},
    body?: string
}

export interface Result {
    error?: Error,
    message?: Response
}

export interface AWSState {
    event: Event,
    context: Context
}

export interface State<T> {
    aws: AWSState
    data?: T
}

export type AnyState = State<any>

export type Callback = (error: Error, response?: Response) => void;

export type Lambda = (state: AnyState) => Promise<Result>