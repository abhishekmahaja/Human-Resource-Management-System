import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import employeeRouter from "./routes/employee.js";
import projectRouter from "./routes/project.js";
import { leaveRouter } from "./routes/leave.js";
import connectToDatabase from "./db/db.js";

connectToDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/projects", projectRouter);
app.use("/api/leave", leaveRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
