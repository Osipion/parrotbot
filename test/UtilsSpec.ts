import * as Utils from '../src/Utils'
import * as AWS from '../src/AWS'

describe('Utils', () => {
   describe('run()', () => {
      let context: AWS.Context = {
         functionName: 'context'
      };
      let event: AWS.Event = {
         httpMethod: 'event',
         headers: {}
      };
      it('runs the supplied lambda', (done) => {
         let called = false;
         let lambda: AWS.Lambda = s => new Promise<AWS.Result>((resolve) => {
            called = true;
            resolve();
         });
         Utils.run(event, context, () => {
            expect(called).toBe(true);
            done();
         }, lambda);
      });
      it('transforms the AWS parameters into a state object', (done) => {
         let lambda: AWS.Lambda = s => new Promise<AWS.Result>(resolve => {
            expect(s.aws).toBeTruthy();
            expect(s.aws.context).toEqual(context);
            expect(s.aws.event).toEqual(event);
            resolve({
               error: new Error('message1')
            });
         });
         Utils.run(event, context, () => done(), lambda);
      });
      it('returns an error message when the lambda returns an error', (done) => {
          let lambda: AWS.Lambda = s => new Promise<AWS.Result>((resolve) => {
              resolve({
                  error: new Error('message1')
              });
          });
          Utils.run(event, context, (_, response) => {
              expect(response.statusCode).toBe(500);
              expect(response.body).toContain('message1');
              done();
          }, lambda);
      });
   });
   describe('parseJson()', () => {
       it('parses valid json strings into JS objects', () => {
          let result = Utils.parseJson<{a: string}>('{"a": "message"}');
          expect(typeof result).toBe('object');
          expect(Object.keys(result).length).toBe(1);
          expect(result.a).toBe('message');
       });
       it('returns null on invalid json object', () => {
           let result = Utils.parseJson<{a: string}>('"message"}');
           expect(result).toBeFalsy();
       });
   })
});