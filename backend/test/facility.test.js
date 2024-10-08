import test from "ava";
import request from "supertest";
import mongoose from "mongoose";
import app, { closeServer } from "../server.js";
import { Facility } from "../models/facilityModel.js";

test.before(async (t) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

test.afterEach.always(async (t) => {
  await Facility.deleteMany({});
});

test.after.always(async (t) => {
  await mongoose.disconnect();
  closeServer();
});

const validFacility = {
  label: "Conference Room A",
  capacity: 50,
  state: true,
};

const invalidFacility = {
  label: "",
  capacity: 0,
  state: true,
};

test.serial("POST /api/facilities should create a facility", async (t) => {
  const response = await request(app)
    .post("/api/facilities")
    .send(validFacility)
    .expect(201);

  t.is(response.status, 201);
  t.truthy(response.body._id, "Facility should have an _id");
  t.is(response.body.label, validFacility.label);
  t.is(response.body.capacity, validFacility.capacity);
  t.is(response.body.state, validFacility.state);
});

test.serial(
  "POST /api/facilities with invalid data should return 400",
  async (t) => {
    const response = await request(app)
      .post("/api/facilities")
      .send(invalidFacility)
      .expect(400);

    t.is(response.status, 400);
    t.truthy(response.body.message, "Error message should be present");
  }
);

test.serial(
  "GET /api/facilities/:id should retrieve a facility by ID",
  async (t) => {
    const createResponse = await request(app)
      .post("/api/facilities")
      .send(validFacility)
      .expect(201);
    const id = createResponse.body._id;

    const getResponse = await request(app)
      .get(`/api/facilities/${id}`)
      .expect(200);
    t.is(getResponse.status, 200);
    t.is(getResponse.body._id, id);
    t.is(getResponse.body.label, validFacility.label);
    t.is(getResponse.body.capacity, validFacility.capacity);
    t.is(getResponse.body.state, validFacility.state);
  }
);

test.serial(
  "GET /api/facilities/:id should return 404 for non-existent facility",
  async (t) => {
    const id = "605c72efbcf86cd799439011";

    const response = await request(app)
      .get(`/api/facilities/${id}`)
      .expect(404);

    t.is(response.status, 404);
    t.deepEqual(response.body, { message: "Facility not found" });
  }
);

test.serial("PATCH /api/facilities/:id should update a facility", async (t) => {
  const createResponse = await request(app)
    .post("/api/facilities")
    .send(validFacility)
    .expect(201);
  const id = createResponse.body._id;

  const updateData = {
    label: "Updated Conference Room A",
    capacity: 75,
  };

  const updateResponse = await request(app)
    .patch(`/api/facilities/${id}`)
    .send(updateData)
    .expect(200);

  t.is(updateResponse.status, 200);
  t.is(updateResponse.body._id, id);
  t.is(updateResponse.body.label, updateData.label);
  t.is(updateResponse.body.capacity, updateData.capacity);
  t.is(updateResponse.body.state, validFacility.state);
});

test.serial(
  "PATCH /api/facilities/:id should return 404 for non-existent facility",
  async (t) => {
    const invalidId = "605c72efbcf86cd799439011";

    const response = await request(app)
      .patch(`/api/facilities/${invalidId}`)
      .send({ label: "New Label" })
      .expect(404);

    t.is(response.status, 404);
    t.deepEqual(response.body, { message: "Facility not found" });
  }
);
