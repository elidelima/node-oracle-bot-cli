const OracleBot = require('@oracle/bots-node-sdk');
const { WebhookClient, WebhookEvent } = OracleBot.Middleware;

module.exports = (app) => {
    const logger = console;
    // initialize the application with OracleBot
    OracleBot.init(app, {
        logger,
    });

    // add webhook integration
    const webhook = new WebhookClient({
        channel: {
            url: 'https://osc153575AutonomousBot03bmxp-osclad004.mobile.ocp.oraclecloud.com:443/connectors/v1/tenants/idcs-917ddc58acd049a6a6977c7a29c7f2a8/listeners/webhook/channels/9BC8D071-D8D6-4B12-AD0C-8F6E6955E2C8',
            secret: '0nxuaAc77XkBQhPWt02lI3M5gmGebXa9',
        }
    });
    // Add webhook event handlers (optional)
    webhook
        .on(WebhookEvent.ERROR, err => logger.error('Error:', err.message))
        .on(WebhookEvent.MESSAGE_SENT, message => logger.info('Message to bot:', message))
        .on(WebhookEvent.MESSAGE_RECEIVED, message => {
            // message was received from bot. forward to messaging client.
            logger.info('Message from bot:', message);
            
        });

    // Create endpoint for bot webhook channel configurtion (Outgoing URI)
    // NOTE: webhook.receiver also supports using a callback as a replacement for WebhookEvent.MESSAGE_RECEIVED.
    //  - Useful in cases where custom validations, etc need to be performed.
    app.post('/bot/message', webhook.receiver());

    // Integrate with messaging client according to their specific SDKs, etc.
    app.post('/test/message', (req, res) => {
        const { user, text } = req.body;
        // construct message to bot from the client message format
        const MessageModel = webhook.MessageModel();
        const message = {
            userId: user,
            messagePayload: MessageModel.textConversationMessage(text)
        };
        // send to bot webhook channel
        webhook.send(message)
            .then(() => res.send('ok'), e => res.status(400).end(e.message + "uai"));
    });
}