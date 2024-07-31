import test from "ava";
import request from "supertest";
import mongoose from "mongoose";
import app, { closeServer } from "../server.js";
import { Event } from "../models/eventModel.js";
import { Reservation } from "../models/reservationModel.js";

let eventId;

test.before(async (t) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

test.after.always(async (t) => {
  await Event.deleteMany({});
  await Reservation.deleteMany({});
});

test.after.always(async (t) => {
  await mongoose.disconnect();
  closeServer();
});

const validEvent = {
  name: "Test Event",
  description: "This is a test event.",
  startDate: "2024-08-01",
  endDate: "2024-08-02",
  organizer: "507f1f77bcf86cd799439011",
  totalEffective: 50,
  reservations: [
    {
      date: "2024-08-01",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      motive: "Meeting",
      materials: [],
      files: ["file1.pdf"],
      effective: 10,
      facility: "507f1f77bcf86cd729439011",
      entity: "507f1f77bcf86cd799439011",
    },
    {
      date: "2024-08-02",
      startTime: "11:00 AM",
      endTime: "12:00 AM",
      motive: "Conference",
      materials: [],
      files: ["file2.pdf"],
      effective: 20,
      facility: "507f1f77bbf86cd799439011",
      entity: "507f1f77bcf86cd799439011",
    },
  ],
};

const invalidEvent = {
  name: "",
  description: "",
  startDate: null,
  endDate: null,
  organizer: "",
  totalEffective: 0,
};

test.serial("POST /api/events should create an event", async (t) => {
  const response = await request(app)
    .post("/api/events")
    .send(validEvent)
    .expect(201);
  t.is(response.status, 201);
  t.truthy(response.body.event._id, "Event should have an _id");
  t.is(response.body.event.name, validEvent.name);
  t.truthy(response.body.reservations, "Response should include reservations");
  t.is(
    response.body.reservations.length,
    validEvent.reservations.length,
    "Number of reservations should match"
  );
  eventId = response.body.event._id;
});

test.serial(
  "POST /api/events with invalid data should return 400",
  async (t) => {
    const response = await request(app)
      .post("/api/events")
      .send(invalidEvent)
      .expect(409);

    t.is(response.status, 409);
    t.truthy(response.body.message, "Error message should be present");
  }
);

test.serial("GET /api/events should retrieve all events", async (t) => {
  const response = await request(app).get("/api/events").expect(200);
  t.is(response.status, 200);
  t.true(Array.isArray(response.body));
});

test.serial(
  "GET /api/events/reservations should retrieve all events with reservations",
  async (t) => {
    const getResponse = await request(app)
      .get("/api/events/reservations")
      .expect(200);
    console.log("resp", getResponse.body[0]);

    t.is(getResponse.status, 200);
    t.true(Array.isArray(getResponse.body));
    t.is(getResponse.body.length, 1);
    t.is(getResponse.body[0]._id, eventId);
    t.true(Array.isArray(getResponse.body[0].reservations));
    t.is(getResponse.body[0].reservations.length, 2);
  }
);

test.serial("GET /api/events/:id should retrieve an event by ID", async (t) => {
  const id = eventId;

  const getResponse = await request(app).get(`/api/events/${id}`).expect(200);

  t.is(getResponse.status, 200);
  t.is(getResponse.body._id, id);
  t.is(getResponse.body.name, validEvent.name);
});

test.serial(
  "GET /api/events/:id should return 404 for non-existent event",
  async (t) => {
    const id = "605c72efbcf86cd790000011";

    const response = await request(app).get(`/api/events/${id}`).expect(404);

    t.is(response.status, 404);
    t.deepEqual(response.body, { message: "Event not found" });
  }
);

test.serial(
  "GET /api/events/reservations/:id should return 404 for non-existent event",
  async (t) => {
    const id = "605c72efbcf86cd799439011";

    const response = await request(app)
      .get(`/api/events/reservations/${id}`)
      .expect(404);

    t.is(response.status, 404);
    t.deepEqual(response.body, { message: "Event not found" });
  }
);

test.serial(
  "GET /api/events/reservations/:id should retrieve an event with reservations",
  async (t) => {
    const getResponse = await request(app)
      .get(`/api/events/reservations/${eventId}`)
      .expect(200);

    t.is(getResponse.status, 200);
    t.is(getResponse.body._id, eventId);
    t.true(Array.isArray(getResponse.body.reservations));
    t.is(getResponse.body.reservations.length, 2);
  }
);

test.serial(
  "PATCH /api/events/:id/state should update event state based on reservations, expect approved",
  async (t) => {
    const id = eventId;
    const reservations = await Reservation.find({ event: id });
    reservations.forEach((reservation, index) => {
      reservation.state = "Approved";
    });

    await Promise.all(reservations.map((reservation) => reservation.save()));

    const updateStateResponse = await request(app)
      .patch(`/api/events/state/${id}`)
      .expect(200);

    t.is(updateStateResponse.status, 200);
    t.is(updateStateResponse.body.state, "Approved");
  }
);

test.serial(
  "PATCH /api/events/:id/state should update event state based on reservations, expect partially approved",
  async (t) => {
    const id = eventId;
    const reservations = await Reservation.find({ event: id });
    reservations[0].state = "Approved";
    reservations[1].state = "Rejected";

    await Promise.all(reservations.map((reservation) => reservation.save()));

    const updateStateResponse = await request(app)
      .patch(`/api/events/state/${id}`)
      .expect(200);
    console.log("updateState", updateStateResponse.body);
    t.is(updateStateResponse.status, 200);
    t.is(updateStateResponse.body.state, "PartiallyApproved");
  }
);
test.serial(
  "PATCH /api/events/:id/state should update event state based on reservations, expect cancelled",
  async (t) => {
    const id = eventId;
    const reservations = await Reservation.find({ event: id });
    reservations[0].state = "Canceled";
    reservations[1].state = "Canceled";

    await Promise.all(reservations.map((reservation) => reservation.save()));

    const updateStateResponse = await request(app)
      .patch(`/api/events/state/${id}`)
      .expect(200);
    console.log("updateState", updateStateResponse.body);
    t.is(updateStateResponse.status, 200);
    t.is(updateStateResponse.body.state, "Canceled");
  }
);
test.serial(
  "PATCH /api/events/:id/state should update event state based on reservations, expect Rejected",
  async (t) => {
    const id = eventId;
    const reservations = await Reservation.find({ event: id });
    reservations[0].state = "Rejected";
    reservations[1].state = "Rejected";

    await Promise.all(reservations.map((reservation) => reservation.save()));

    const updateStateResponse = await request(app)
      .patch(`/api/events/state/${id}`)
      .expect(200);
    console.log("updateState", updateStateResponse.body);
    t.is(updateStateResponse.status, 200);
    t.is(updateStateResponse.body.state, "Rejected");
  }
);

/*
test.serial("PATCH /api/events/:id should update an event", async (t) => {
  
  const id = eventId;

  const updateData = {
    name: "Updated Tech Conference",
    totalEffective: 150,
  };

  const updateResponse = await request(app)
    .patch(`/api/events/${id}`)
    .send(updateData)
    .expect(200);

  t.is(updateResponse.status, 200);
  t.is(updateResponse.body._id, eventId);
  t.is(updateResponse.body.name, updateData.name);
  t.is(updateResponse.body.totalEffective, updateData.totalEffective);
});




test.serial("DELETE /api/events/:id should delete an event", async (t) => {
  const createResponse = await request(app)
    .post("/api/events")
    .send(validEvent)
    .expect(201);
  const id = createResponse.body._id;

  const deleteResponse = await request(app)
    .delete(`/api/events/${id}`)
    .expect(200);

  t.is(deleteResponse.status, 200);
  t.deepEqual(deleteResponse.body, {
    message: "Event deleted successfully",
  });

  const getResponse = await request(app).get(`/api/events/${id}`).expect(404);

  t.is(getResponse.status, 404);
  t.deepEqual(getResponse.body, { message: "Event not found" });
});*/
