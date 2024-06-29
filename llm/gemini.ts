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
        temperature: 0.7,
        modelName: "gemini-pro",
        topK: 40,
        topP: 1,
    });

    const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `As a DevOps engineer, you are tasked with creating a Dockerfile based on the user's specific requirements. The user will provide details about the base image, the application, the ports to expose, any dependencies to install, and the commands to run the application.

            Using the following inputs provided by the user, please write a Dockerfile:

            1. Base Image: The base image to use for the Dockerfile.
            2. Working Directory: The directory within the container where the application code will be placed.
            3. Files to Copy: Any files that need to be copied into the container, along with their destinations.
            4. Dependencies Installation: Any commands required to install dependencies.
            5. Ports to Expose: The ports that should be exposed by the container.
            6. Run Command: The command to start the application. 

            Below are a number of examples of questions and their corresponding Dockerfiles.

            input: Create a Dockerfile for a Python Flask application using Python 3.8, expose port 5000, install dependencies from requirements.txt, and run the application using "python app.py".
            Dockerfile:”
            # Use the official Python 3.8 image as the base image
            FROM python:3.8

            # Set the working directory to /app
            WORKDIR /app

            # Copy the requirements.txt file into the working directory
            COPY requirements.txt .

            # Install the dependencies from requirements.txt
            RUN pip install --no-cache-dir -r requirements.txt

            # Copy the rest of the application code into the working directory
            COPY . .

            # Expose port 5000
            EXPOSE 5000

            # Specify the command to run the application
            CMD ["python", "app.py"]
            “

            input: Create a Dockerfile for a Node.js application using Node.js 14, expose port 3000, install dependencies from package.json, and run the application using "npm start".
            Dockerfile:”
            # Use the official Node.js 14 image as the base image
            FROM node:14

            # Set the working directory to /usr/src/app
            WORKDIR /usr/src/app

            # Copy the package.json and package-lock.json files into the working directory
            COPY package*.json ./

            # Install the dependencies from package.json
            RUN npm install

            # Copy the rest of the application code into the working directory
            COPY . .

            # Expose port 3000
            EXPOSE 3000

            # Specify the command to run the application
            CMD ["npm", "start"]

            ”

          input:  Create a Dockerfile for a Java application using OpenJDK 11, expose port 8080, compile the application using Maven, and run the application using "java -jar target/app.jar".
            Dockerfile: ”
            # Use the official OpenJDK 11 image as the base image
            FROM openjdk:11

            # Set the working directory to /app
            WORKDIR /app

            # Copy the Maven project files into the working directory
            COPY pom.xml ./
            COPY src ./src

            # Compile the application using Maven
            RUN mvn clean install

            # Expose port 8080
            EXPOSE 8080

            # Specify the command to run the application
            CMD ["java", "-jar", "target/app.jar"]

            ”

            input: Create a Dockerfile for an nginx server that listens on port 80.
            Dockerfile: ”
            # Use the official nginx image as the base image
            FROM nginx:latest

            # Expose port 80
            EXPOSE 80`
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
        return res;
    } catch (error) {
        console.error("Error invoking model:", error);
        throw error;
    }

}


    
  