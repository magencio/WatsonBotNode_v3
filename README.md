# Info
A sample project that shows how to build a basic bot with Microsoft Bot Framework and Watson Assistant.

- It has been developed with [Bot Builder SDK v3 for Node.js](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-overview), [TypeScript](https://www.typescriptlang.org/) and [Visual Studio Code](https://code.visualstudio.com/).
- It can be deployed in an **Azure Bot Web App** with [Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart) for high availability and scalability. Code can be  deployed from a git repository from e.g. GitHub or [VSTS](https://www.visualstudio.com/team-services/).
- It uses [WATSON Assistant](https://console.bluemix.net/docs/services/conversation/getting-started.html) for Natural Language Processing and Dialog Flow control. For this sample I used the "Customer Service - Sample" workspace that IBM Watson Assistant provides and added an action to one of the dialogs just for testing purposes. You can find the exported .json file of that workspace in the ./watson folder.
*Note: [WatsonNLPBotNode_v3](https://github.com/magencio/WatsonNLPBotNode_v3) sample uses Watson Assistant just for Natural Language Processing and Bot Framework for Dialog Flow control. [BaseBotNode_v3](https://github.com/magencio/BaseBotNode_v3), [TraktBotNode_V3](https://github.com/magencio/TraktBotNode_V3) & [UberBotNode_V3](https://github.com/magencio/UberBotNode_V3) samples use LUIS instead of Watson Assistant for Natural Language Processing and Bot Framework for Dialog Flow control.*
- The bot is instrumented with [Microsoft Bot Builder Instrumentation](https://github.com/CatalystCode/botbuilder-instrumentation) which traces all messages to and from the bot, all intents and actions detected by Watson, and any custom event we may need in [Application Insights](https://azure.microsoft.com/en-us/services/application-insights/). We can then create custom BI dashboards in [Ibex Dashboard](https://github.com/Azure/ibex-dashboard) to consume that data. Bot Builder Instrumentation also performs sentiment analysis with [Text Analytics](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/).
- Bot state data is persisted in [CosmosDB](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-state-azure-cosmosdb).
- Thanks to Bot Connector we should be able to connect the bot to many channels like Skype, Telegram, Facebook Messenger, Web Chat (to embed the chatbot in any web site), Direct Line (to create our own chatbot client), etc. We can configure this with Bot Service in the Azure portal.

## Try the bot locally
Rename dev.sample.json to dev.private.json and modify it with your own settings. 

Then you can run the bot in different ways:

1) Run and debug the bot with VSCode by pressing Ctrl+Shift+D and selecting "Typescript debug", or by pressing F5).
Then connect the Bot Framework Emulator to http://localhost:3977/api/messages. 

2) Run the bot with "npm run-script startdev". 
Then connect the Bot Framework Emulator to http://localhost:3977/api/messages.
Note: if you make any changes in your code, the bot will be restarted automatically.

3) Get the packages and compile the .ts files to .js with "npm install", and the run the bot with "npm start".
Then connect the Bot Framework Emulator to http://localhost:3977/api/messages.
Note: this is what Azure does when you commit your code to Git and the bot gets deployed to the Web App.