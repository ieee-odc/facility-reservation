import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import responsibleRoutes from "./routes/respRoutes.js";
import riRoutes from "./routes/riRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import equipmentRouter from "./routes/equipmentRoutes.js";
import eventRouter from "./routes/eventRoutes.js";

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://flexyspace.loca.lt"],
    credentials: true,
  })
);

app.use("/api/reservationInitiators", riRoutes);
app.use("/api/responsibles", responsibleRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/equipments", equipmentRouter);
app.use("/api/events", eventRouter);

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;

let server;

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");

    server = app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

export const closeServer = () => {
  if (server) {
    server.close();
  }
};

export default app;
