import { config }  from './config';
import { Session } from 'botbuilder';
import { BotFrameworkInstrumentation } from 'botbuilder-instrumentation';
import { AssistantV1 } from 'watson-developer-cloud';
import { MessageResponse } from '../node_modules/watson-developer-cloud/conversation/v1-generated';

export class WatsonAssistant {

    private assistant: AssistantV1;
    private instrumentation: BotFrameworkInstrumentation;

    constructor(instrumentation: BotFrameworkInstrumentation) {
        this.instrumentation = instrumentation;
        this.assistant = new AssistantV1({
            username: config.get('WATSON_userName'),
            password: config.get('WATSON_password'),
            version: config.get('WATSON_workspaceVersion')
        });
    }

    // https://console.bluemix.net/docs/services/conversation/develop-app.html#building-a-client-application
    public processMessage(session: Session, text?: string) {
        this.assistant.message({
            workspace_id: config.get('WATSON_workspaceId'),
            input: { text: text },
            context: session.conversationData.context
        }, (err: any, response: MessageResponse) => {
            if (err) {
                console.error(err);
                return;
            }

            if (response.intents.length > 0) {
                const intent = response.intents[0];
                console.log('Detected intent: #' + intent.intent);
                this.instrumentation.trackCustomEvent('MBFEvent.Intent', intent, session);
            }

            const actions = (response as any).actions;
            if (actions && actions.length > 0) {
                actions.forEach(action => {
                    console.log('Detected action: ' + action.name);
                    this.instrumentation.trackCustomEvent('MBFEvent.Action', action, session);
                });
            }

            if (response.output.text.length !== 0) {
                session.send(response.output.text[0]);
            }

            session.conversationData.context = response.context;
        });
    }
}