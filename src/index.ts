import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const PORT: number = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, (): void => {
  console.log("Server listen on port " + PORT);
});
