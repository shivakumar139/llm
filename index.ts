import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import {gemini} from "./llm/gemini"
import { v4 as uuidv4 } from "uuid";


const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cookieParser());

app.post("/", async (req: Request, res: Response) => {
  try {
    const input: string = req.body.input;
    let sessionId: string = req.cookies.sessionId;

    // Generate a new session ID if not present
    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie("sessionId", sessionId, { httpOnly: true });
    }

    return res.status(200).send(await gemini(input, sessionId));

} catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("An error occurred while processing your request.");
}
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});