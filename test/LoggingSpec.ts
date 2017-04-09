import * as Logging from '../src/Logging'

describe('Logging', () => {

    let messagesLogged: string[] = [];
    let origLogger = Logging.logger;

    let pb_token = process.env.PARROTBOT_TOKEN,
        sl_token = process.env.SLACK_TOKEN;

    Logging.setLogger(m => messagesLogged.push(m));

    beforeAll(() => {
        process.env.PARROTBOT_TOKEN = '7898!iuqhbba';
        process.env.SLACK_TOKEN = '1jkbap0qi(';
    });

    beforeEach(() => messagesLogged = []);

    afterAll(() => {
        Logging.setLogger(origLogger);
        process.env.PARROTBOT_TOKEN = pb_token;
        process.env.SLACK_TOKEN =sl_token;
    });

    describe('logError()', () => {
        it('logs an error message containing the string "[ERROR]"', (done) => {
            Logging.logError('my message');
            expect(messagesLogged.length).toBe(1);
            expect(messagesLogged[0]).toMatch(/\[ERROR] my message$/);
            done();
        });
        it('strips out secrets anyone is silly enough to log', (done) => {
            process.env.PARROTBOT_TOKEN = '7898!iuqhbba';
            process.env.SLACK_TOKEN = '1jkbap0qi(';
            Logging.logError(`Parrot: ${process.env.PARROTBOT_TOKEN}, Slack: ${process.env.SLACK_TOKEN}`);
            expect(messagesLogged.length).toBe(1);
            let message = messagesLogged[0];
            expect(message).not.toContain(process.env.PARROTBOT_TOKEN);
            expect(message).not.toContain(process.env.SLACK_TOKEN)
            expect(message).toMatch(/\[ERROR] Parrot: \{PARROTBOT_TOKEN}, Slack: \{SLACK_TOKEN}$/)
            done();
        })
    });
    describe('logInfo()', () => {
        it('logs an info message containing the string "[INFO]"', (done) => {
            Logging.logInfo('my message');
            expect(messagesLogged.length).toBe(1);
            expect(messagesLogged[0]).toMatch(/\[INFO] my message$/);
            done();
        });
        it('strips out secrets anyone is silly enough to log', (done) => {
            Logging.logInfo(`Parrot: ${process.env.PARROTBOT_TOKEN}, Slack: ${process.env.SLACK_TOKEN}`);
            expect(messagesLogged.length).toBe(1);
            let message = messagesLogged[0];
            expect(message).not.toContain(process.env.PARROTBOT_TOKEN);
            expect(message).not.toContain(process.env.SLACK_TOKEN)
            expect(message).toMatch(/\[INFO] Parrot: \{PARROTBOT_TOKEN}, Slack: \{SLACK_TOKEN}$/)
            done();
        })
    });
    describe('logWarning()', () => {
        it('logs a warning message containing the string "[WARN]"', (done) => {
            Logging.logWarning('my message');
            expect(messagesLogged.length).toBe(1);
            expect(messagesLogged[0]).toMatch(/\[WARN] my message$/);
            done();
        });
        it('strips out secrets anyone is silly enough to log', (done) => {
            Logging.logWarning(`Parrot: ${process.env.PARROTBOT_TOKEN}, Slack: ${process.env.SLACK_TOKEN}`);
            expect(messagesLogged.length).toBe(1);
            let message = messagesLogged[0];
            expect(message).not.toContain(process.env.PARROTBOT_TOKEN);
            expect(message).not.toContain(process.env.SLACK_TOKEN)
            expect(message).toMatch(/\[WARN] Parrot: \{PARROTBOT_TOKEN}, Slack: \{SLACK_TOKEN}$/);
            done();
        })
    });
    describe('logDebug()', () => {
        it('logs a debug message containing the string "[DEBUG]"', (done) => {
            Logging.logDebug('my message');
            expect(messagesLogged.length).toBe(1);
            expect(messagesLogged[0]).toMatch(/\[DEBUG] my message$/);
            done();
        });
        it('strips out secrets anyone is silly enough to log', (done) => {
            Logging.logDebug(`Parrot: ${process.env.PARROTBOT_TOKEN}, Slack: ${process.env.SLACK_TOKEN}`);
            expect(messagesLogged.length).toBe(1);
            let message = messagesLogged[0];
            expect(message).not.toContain(process.env.PARROTBOT_TOKEN);
            expect(message).not.toContain(process.env.SLACK_TOKEN)
            expect(message).toMatch(/\[DEBUG] Parrot: \{PARROTBOT_TOKEN}, Slack: \{SLACK_TOKEN}$/);
            done();
        })
    });
});
