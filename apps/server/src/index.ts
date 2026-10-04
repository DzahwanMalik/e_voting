import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import electionRoutes from "./routes/election.routes";
import candidateRoutes from "./routes/candidate.routes";
import voterRoutes from "./routes/voter.routes";
import voteRoutes from "./routes/vote.routes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/votes", voteRoutes);

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

app.listen(PORT, (): void => {
  console.log("Server listen on port " + PORT);
});

export { app };
