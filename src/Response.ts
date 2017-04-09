export interface Response<T> {
    statusCode: number,
    path: string,
    host: string,
    method: string,
    body: T
}

export type RawResponse = Response<string>