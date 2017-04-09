import * as Responses from '../src/Responses'

describe('Responses', () => {
    describe('ok', () => {
        let data = 'some data';
        let responseWithData = Responses.ok(data, Responses.MediaType.text);
        let responseWithoutData = Responses.ok();
        it('returns a response object', () => {
            expect(responseWithoutData.statusCode).toBeTruthy();
            expect(responseWithData.headers).toBeTruthy();
            expect(responseWithData.body).toBeTruthy();
        });
        it("doesn't add headers if no data is supplied", () => {
            let headerCount = Object.keys(responseWithoutData.headers).length;
            expect(headerCount).toBe(0);
        });
        it("sets the content type to the correct supplied media type", () => {
            expect(responseWithData.headers['Content-Type']).toBe(Responses.MediaType.text);
            expect(responseWithData.headers['Content-Length']).toBe(data.length.toString());
        });
        it("sets the body if one is supplied", () => {
            expect(responseWithData.body).toEqual(data);
        });
        it('sets the status code to 200', () => {
            expect(responseWithoutData.statusCode).toEqual(200);
            expect(responseWithData.statusCode).toEqual(200);
        });
    });
    describe('badRequest', () => {
        let errorMessage = 'My message';
        let responseWithData = Responses.badRequest(new Error(errorMessage));
        let responseWithoutData = Responses.badRequest();
        it('returns a response object', () => {
            expect(responseWithoutData.statusCode).toBeTruthy();
            expect(responseWithData.headers).toBeTruthy();
            expect(responseWithData.body).toBeTruthy();
        });
        it("doesn't add headers if no data is supplied", () => {
            let headerCount = Object.keys(responseWithoutData.headers).length;
            expect(headerCount).toBe(0);
        });
        it("sets the content type to json", () => {
            expect(responseWithData.headers['Content-Type']).toBe(Responses.MediaType.json);
        });
        it("sets the body if one is supplied", () => {
            expect(responseWithData.body).toContain(errorMessage);
        });
        it('sets the status code to 400', () => {
            expect(responseWithoutData.statusCode).toEqual(400);
            expect(responseWithData.statusCode).toEqual(400);
        });
    });
    describe('serverError', () => {
        let errorMessage = 'Another message';
        let responseWithData = Responses.serverError(new Error(errorMessage));
        let responseWithoutData = Responses.serverError();
        it('returns a response object', () => {
            expect(responseWithoutData.statusCode).toBeTruthy();
            expect(responseWithData.headers).toBeTruthy();
            expect(responseWithData.body).toBeTruthy();
        });
        it("doesn't add headers if no data is supplied", () => {
            let headerCount = Object.keys(responseWithoutData.headers).length;
            expect(headerCount).toBe(0);
        });
        it("sets the content type to json", () => {
            expect(responseWithData.headers['Content-Type']).toBe(Responses.MediaType.json);
        });
        it("sets the body if one is supplied", () => {
            expect(responseWithData.body).toContain(errorMessage);
        });
        it('sets the status code to 400', () => {
            expect(responseWithoutData.statusCode).toEqual(500);
            expect(responseWithData.statusCode).toEqual(500);
        });
    });
});