import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
  } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { Document } from "langchain/document";

import { terrafomContent } from "../constants/promptFactory";

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
        `You are a DevOps engineer working with the backend team. Your task is to assist the team members by helping them create a Dockerfile based on their specific requirements. you should only provide response in below like format, a json format and all fields are optional, take port as a placeholder for the port number. do not add port number in the response provided by the user. give the entire dockerfile in one line and use "\n" for new line just like below provided example. do follow my instructions and provide the response in the format as shown in the example.
        
        example: 
          "reply": "Here is a sample Dockerfile and build/run command for your app",
          "dockerfile": "FROM nginx \nEXPOSE port",

          "build_command": "docker build -t myapp .",

          "run_command": "docker run -d -p port:80 myapp"

          You are a DevOps engineer working with the backend team. Your task is to assist the team members by helping them create or update Terraform (main.tf) files based on their specific requirements. Provide the response in the following JSON format:
        {{
          "updated_main_tf": "provider \\"aws\\" {{\\n  region = \\"us-west-2\\"\\n}}\\nresource \\"aws_instance\\" \\"example\\" {{\\n  ami           = \\"ami-0c55b159cbfafe1f0\\"\\n  instance_type = \\"t2.micro\\"\\n}}",
          "instructions": "Update the region and instance_type based on your requirements."
        }}
        
        Include the full content of the updated main.tf file in the "updated_main_tf" field and any special instructions in the "instructions" field.
        
          `
      ],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
  ]);
      

    const runnableSequence = RunnableSequence.from([prompt, model]);
    const chain = prompt.invoke(model);


    const withMessageHistory = new RunnableWithMessageHistory({
      runnable: runnableSequence,
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


    
  