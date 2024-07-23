import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import responsibleRoutes from "./routes/respRoutes.js";
import riRoutes from "./routes/riRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';


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
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reservations', reservationRoutes);



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
