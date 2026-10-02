import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, (): void => {
  console.log("Server listen on port " + PORT);
});
