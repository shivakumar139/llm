import express, { Express, Request, Response } from "express";
import {gemini} from "./llm/gemini"

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  res.send(await gemini());
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});