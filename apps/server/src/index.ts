import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import electionRoutes from "./routes/election.routes";
import candidatePairRoutes from "./routes/candidatePair.routes";
import voterRoutes from "./routes/voter.routes";
import voteRoutes from "./routes/vote.routes";
import resultRoutes from "./routes/result.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidate-pairs", candidatePairRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

// Error handler
app.use(errorHandler);

app.listen(PORT, (): void => {
  console.log("Server listen on port " + PORT);
});

export { app };
