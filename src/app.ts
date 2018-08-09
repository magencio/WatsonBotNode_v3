import { config }  from './config';
import * as restify from 'restify';
import { ChatConnector, UniversalBot, Session } from 'botbuilder';
import { DocumentDbClient, AzureBotStorage } from 'botbuilder-azure';
import { BotFrameworkInstrumentation } from 'botbuilder-instrumentation';
import { WatsonAssistant } from './watsonAssistant';

const connector = createChatConnector();
const bot = createBot(connector);
const instrumentation = setupBotInstrumentation(bot);
const assistant = createWatsonAssistant(instrumentation);
setupBotStateStorage(bot);
setupBotDialogs(bot, assistant);
const server = createServer(connector);

function createChatConnector() : ChatConnector {
    return new ChatConnector({
        appId: config.get('MicrosoftAppId'),
        appPassword: config.get('MicrosoftAppPassword'),
        openIdMetadata: config.get('BotOpenIdMetadata')
    });
}

function createBot(connector: ChatConnector) : UniversalBot {
    return new UniversalBot(connector);
}

function createWatsonAssistant(instrumentation: BotFrameworkInstrumentation) : WatsonAssistant {
    return new WatsonAssistant(instrumentation);
}

function createServer(connector: ChatConnector) : any {
    const server = restify.createServer();
    server.use(restify.plugins.queryParser());
    server.listen(process.env.port || process.env.PORT || 3977, function () {
        console.log('%s listening to %s', server.name, server.url);
    });

    server.post('/api/messages', connector.listen());
    return server;
}

function setupBotInstrumentation(bot: UniversalBot) : BotFrameworkInstrumentation {
    bot.use({
        botbuilder: (session: Session, next: any) => {
            console.log(session.message.text);
            next();
        },
        send: (event: any, next: any) => {
            console.log(event.text);
            next();
        }
    });

    const instrumentation = new BotFrameworkInstrumentation({
        instrumentationKey: config.get('BotDevAppInsightsKey'),
        sentiments: {
            key: config.get('CS_sentimentKey')
        },
        autoLogOptions: {
            autoCollectExceptions: true
            }
        });
    instrumentation.monitor(bot);
    return instrumentation;
}

function setupBotStateStorage(bot: UniversalBot) {
    const cosmosDbClient = new DocumentDbClient({
        host: config.get('COSMOSDB_host'),
        masterKey: config.get('COSMOSDB_key'),
        database: 'botdocs',
        collection: 'botdata'
    });
    const storage = new AzureBotStorage({ gzipData: false }, cosmosDbClient);
    bot.set('storage', storage);
}

function setupBotDialogs(bot: UniversalBot, assistant: WatsonAssistant) {
    bot.dialog('/', (session: Session) => {
        assistant.processMessage(session, session.message.text);
    });
    bot.on('conversationUpdate', (message) => {
        if (message.membersAdded.find(m => m.id === message.user.id)) {
            bot.loadSession(message.address, (err, session) => {
                assistant.processMessage(session);
            });
        }
    });
}