import test from "ava";
import request from "supertest";
import mongoose from "mongoose";
import app, { closeServer } from "../server.js";
import { Equipment } from "../models/equipmentModel.js";

test.before(async (t) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

test.afterEach.always(async (t) => {
  await Equipment.deleteMany({});
});

test.after.always(async (t) => {
  await mongoose.disconnect();
  closeServer();
});

const validEquipment = {
  label: "Projector",
  availableQuantity: 10,
};

const invalidEquipment = {
  label: "",
  availableQuantity: 0,
};

test.serial("POST /api/equipments should create an equipment", async (t) => {
  const response = await request(app)
    .post("/api/equipments")
    .send(validEquipment)
    .expect(201);

  t.is(response.status, 201);
  t.truthy(response.body._id, "Equipment should have an _id");
  t.is(response.body.label, validEquipment.label);
  t.is(response.body.availableQuantity, validEquipment.availableQuantity);
});

test.serial(
  "POST /api/equipments with invalid data should return 400",
  async (t) => {
    const response = await request(app)
      .post("/api/equipments")
      .send(invalidEquipment)
      .expect(400);

    t.is(response.status, 400);
    t.truthy(response.body.message, "Error message should be present");
  }
);

test.serial(
  "GET /api/equipments/:id should retrieve an equipment by ID",
  async (t) => {
    const createResponse = await request(app)
      .post("/api/equipments")
      .send(validEquipment)
      .expect(201);
    const id = createResponse.body._id;

    const getResponse = await request(app)
      .get(`/api/equipments/${id}`)
      .expect(200);

    t.is(getResponse.status, 200);
    t.is(getResponse.body._id, id);
    t.is(getResponse.body.label, validEquipment.label);
    t.is(getResponse.body.availableQuantity, validEquipment.availableQuantity);
  }
);

test.serial(
  "GET /api/equipments/:id should return 404 for non-existent equipment",
  async (t) => {
    const id = "605c72efbcf86cd799439011";

    const response = await request(app)
      .get(`/api/equipments/${id}`)
      .expect(404);

    t.is(response.status, 404);
    t.deepEqual(response.body, { message: "Equipment not found" });
  }
);

test.serial(
  "PATCH /api/equipments/:id should update an equipment",
  async (t) => {
    const createResponse = await request(app)
      .post("/api/equipments")
      .send(validEquipment)
      .expect(201);
    const id = createResponse.body._id;

    const updateData = {
      label: "Updated Projector",
      availableQuantity: 15,
    };

    const updateResponse = await request(app)
      .patch(`/api/equipments/${id}`)
      .send(updateData)
      .expect(200);

    t.is(updateResponse.status, 200);
    t.is(updateResponse.body._id, id);
    t.is(updateResponse.body.label, updateData.label);
    t.is(updateResponse.body.availableQuantity, updateData.availableQuantity);
  }
);

test.serial(
  "PATCH /api/equipments/:id should return 404 for non-existent equipment",
  async (t) => {
    const invalidId = "605c72efbcf86cd799439011";

    const response = await request(app)
      .patch(`/api/equipments/${invalidId}`)
      .send({ label: "New Label" })
      .expect(404);

    t.is(response.status, 404);
    t.deepEqual(response.body, { message: "Equipment not found" });
  }
);

test.serial(
  "DELETE /api/equipments/:id should delete an equipment",
  async (t) => {
    const createResponse = await request(app)
      .post("/api/equipments")
      .send(validEquipment)
      .expect(201);
    const id = createResponse.body._id;

    const deleteResponse = await request(app)
      .delete(`/api/equipments/${id}`)
      .expect(200);

    t.is(deleteResponse.status, 200);
    t.deepEqual(deleteResponse.body, {
      message: "Equipment deleted successfully",
    });

    const getResponse = await request(app)
      .get(`/api/equipments/${id}`)
      .expect(404);

    t.is(getResponse.status, 404);
    t.deepEqual(getResponse.body, { message: "Equipment not found" });
  }
);
