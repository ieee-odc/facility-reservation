import test from 'ava';
import request from 'supertest';
import mongoose from 'mongoose';
import app, { closeServer } from '../server.js';
import { Reservation } from '../models/reservationModel.js';

const validData = {
  facility: '507f1f77bcf86cd799439011',
  motive: 'Meeting',
  date: '2024-07-25T00:00:00.000Z',
  time: '10:00',
  state: 'Pending',
  entity: '507f1f77bcf86cd799439012',
  event: null,
  effective: 10,
  materials: ['Projector'],
  files: ['file1.pdf']
};

const invalidData = {
  ...validData,
  state: 'InvalidState'
};



test.after.always(async t => {
  await mongoose.disconnect();
  closeServer();
});

test('POST /api/reservations should create a reservation', async t => {
  const response = await request(app)
    .post('/api/reservations')
    .send(validData)
    .expect(201);
    console.log('Response status:', response.status);
    console.log('Response body:', response.body);
  t.is(response.status, 201);
  /*t.truthy(response.body._id, 'Reservation should have an _id');
  t.deepEqual(response.body.facility.toString(), validData.facility);
  t.deepEqual(response.body.motive, validData.motive);
  t.deepEqual(new Date(response.body.date).toISOString(), validData.date);
  t.deepEqual(response.body.time, validData.time);
  t.deepEqual(response.body.state, validData.state);
  t.deepEqual(response.body.entity.toString(), validData.entity);
  t.deepEqual(response.body.event, validData.event);
  t.deepEqual(response.body.effective, validData.effective);
  t.deepEqual(response.body.materials, validData.materials);
  t.deepEqual(response.body.files, validData.files);*/
});

test('POST /api/reservations with invalid data should return 409', async t => {
  const response = await request(app)
    .post('/api/reservations')
    .send(invalidData)
    .expect(409);
    console.log('Response status:', response.status);
    console.log('Response body:', response.body);
  t.is(response.status, 409);
  t.truthy(response.body.message, 'Error message should be present');
});
