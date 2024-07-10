import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import responsibleRoutes from "./routes/respRoutes.js";
import riRoutes from "./routes/riRoutes.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/reservationInitiators", riRoutes);
app.use('/api/responsibles', responsibleRoutes);

const PORT = process.env.PORT;
const mongoDBURL = process.env.MONGODB_URL;

app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
  })
  .catch((error) => {
    console.log(error);
  });
