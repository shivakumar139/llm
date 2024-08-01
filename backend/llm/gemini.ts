import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
  } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

import {GEMINI_API_KEY} from '../config';

const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

export const gemini = async (input: string, sessionId: string) => {

    

    const model = new ChatGoogleGenerativeAI({
        apiKey: GEMINI_API_KEY,
        temperature: 0.4,
        modelName: "gemini-pro",
        topK: 40,
        topP: 0.9,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a DevOps engineer working with the backend team. Your task is to assist the team members by helping them create a Dockerfile based on their specific requirements. you should only provide response in below like format, a json format and all fields are optional, take name "port" as a placeholder for the port number. do not add port number in the rdockerfile, run and build commands. 
        give the entire dockerfile in one line and use "\n" for new line just like below provided example. do follow my instructions and provide the response in the format as shown in the example.
        give response in valid JSON format
        
        examples: 
          "reply": "Here is a sample Dockerfile and build/run command for your app",
          "dockerfile": "FROM nginx \nEXPOSE port",
          "build_command": "docker build -t myapp .",
          "run_command": "docker run -d -p port:80 myapp"

          "reply": "Here is a sample Dockerfile and build/run command for your app",
          "dockerfile": "FROM httpd:2.4\nEXPOSE port",
          "build_command": "docker build -t myapp .",
          "run_command": "docker run -d -p port:80 myapp"

          `
      ],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
  ]);
      
    const chain = prompt.pipe(model);

    const withMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: async (sessionId) => {
        if (messageHistories[sessionId] === undefined) {
          messageHistories[sessionId] = new InMemoryChatMessageHistory();
        }
        return messageHistories[sessionId];
      },
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });


    try {
    
        const res = await withMessageHistory.invoke(
          
          {
            input,
          },
          {
            configurable: {
              sessionId,
            },
          }
          );
        return res.content;
    } catch (error) {
        console.error("Error invoking model:", error);
        throw error;
    }

}


    
  