import axios from 'axios';
// import {
//   TestContainer,
//   StartedTestContainer,
//   StoppedTestContainer,
//   GenericContainer,
//   StartedNetwork,
//   Network
// } from "testcontainers";


// let habitsDBContainer: StartedTestContainer
// let apiContainer: StartedTestContainer
// let network: StartedNetwork
// let apiUrl: string

// const title1 = 'Write unit tests'
// const title2 = 'Write integration tests'

// const habit1 = { "title": title1 }
// const habit2 = { "title": title2, "description": "testing desc" }

// beforeAll(async () => {
//   network = await new Network().start()

//   habitsDBContainer = await new GenericContainer('habits_postgres')
//     .withName('test_habits_postgres')
//     .withNetworkMode(network.getName())
//     .withEnvironment({ POSTGRES_HOST: "habits_postgres" })
//     .withEnvironment({ POSTGRES_PORT: "5432" })
//     .withEnvironment({ POSTGRES_DB: "nodejs_habit_tracker_habits" })
//     .withEnvironment({ POSTGRES_USER: "admin" })
//     .withEnvironment({ POSTGRES_PASSWORD: "password" })
//     .start();

//   apiContainer = await new GenericContainer('habit_tracking_app-node.js-habit-service-1.0.0')
//     .withExposedPorts(3001)
//     .withNetworkMode(network.getName())
//     .withEnvironment({ APP_PORT: "3001" })
//     .withEnvironment({ POSTGRES_HOST: "habits_postgres" })
//     .withEnvironment({ POSTGRES_PORT: "5432" })
//     .withEnvironment({ POSTGRES_USER: "admin" })
//     .withEnvironment({ POSTGRES_PASSWORD: "password" })
//     .withEnvironment({ POSTGRES_DB: "nodejs_habit_tracker_habits" })
//     .withEnvironment({ AUTH_SERVICE_BASE_URL: "http://node.js-auth-service-1.0.0" })
//     .withEnvironment({ AUTH_SERVICE_PORT: "3000" })
//     .withEnvironment({ AUTH_SERVICE_PUBLIC_KEY_PATH: "public-key" })
//     .start();

//   const apiLogs = await apiContainer.logs()
//   apiLogs.on('data', line => console.log(line))
//   apiLogs.on('err', line => console.error(line))

//   apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(3001)}`
// }, 3 * 60 * 1000)

// it('adds new habits', async () => {
//   const response1 = await axios.post(`${apiUrl}/habits`, habit1)
//   expect(response1.data).toEqual(habit1)

//   const response2 = await axios.post(`${apiUrl}/habits`, habit2)
//   expect(response2.data).toEqual(habit2)
// }, 3 * 60 * 1000)

// it('gets existing habits', async () => {
//   const response = await axios.get(`${apiUrl}/habits`)
//   expect(response.data).toEqual([habit1, habit2])
// }, 3 * 60 * 1000)

// it('update habits', async () => {
//   await axios.patch(`${apiUrl}/habits/5`, { "title": "modifiedTitle" })
//   const response = await axios.get(`${apiUrl}/habits/5`)
//   expect(response.data).toHaveProperty('id');
// }, 3 * 60 * 1000)

// it('deletes habits', async () => {
//   await axios.delete(`${apiUrl}/habits/5`)
//   const response = await axios.get(`${apiUrl}/habits/5`)
//   expect(response.status).toEqual(204)
// }, 3 * 60 * 1000)

// afterAll(async () => {
//   await apiContainer.stop()
//   await habitsDBContainer.stop()
//   await network.stop()
// }, 3 * 60 * 1000)

import { HttpStatus } from '../habits/src/common/enum/http-status.enum';
import { randomInt } from 'crypto';

const habitServiceBaseUrl = 'http://localhost:3001/api/v1/habits';
let habitId = 0;
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxMDkxMjQ0OX0.WQhtD71p6WGToa9O4kJVskk-TFeCow9g_W9o4RoD0U8-sAm2-fMt6OrMlceRWC-nmduG1ExA414VCVxtoiC43V2g2o8WUhDeNfLKVi8BOI_gvda9WXY35JE8cdjchMixwehC2RTS6VXmoJjdmHrowtslWhOMfGtCNvpcwygnuMtQqjZ9mzKVAJ766tyd-foxRTAeIKr0uRAwcDqqhpaXBt10A0cKEVY8Z_KxFNcdMNJCpuGOWuYDwhRb6kzbjb_5ApxiEGgjWE1O5MWXNGak8IigypnHYInC0x_mXOmAsC4oXUWYbT3aL5Nw_08o8VsP0CJCvkqLh6R8FItkE8-z5g';

describe('Post endpoint', () => {
  it('should create a new habit', async () => {
    const data = {
      "title": "Example habit title" + randomInt(3000000),
      "description": "This is DESC",
    };

    // Send request with token in the Authorization header
    let res = await axios.post(habitServiceBaseUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toEqual(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data).toHaveProperty('title', data.title);
    expect(res.data).toHaveProperty('description', data.description);

    // set id for subsequent tests
    habitId = res.data.id;
  });
});

describe('Get Habit endpoint', () => {
  const exampleSnapshot = {
    id: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
  };

  it('should get all habits', async () => {
    const res = await axios.get(habitServiceBaseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.data[0]).toMatchSnapshot({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
    });
  });

  it('should get habit by id', async () => {
    const res = await axios.get(habitServiceBaseUrl+`/${habitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.data).toMatchSnapshot(exampleSnapshot);
  });
});

describe('PATCH endpoint', () => {
  it('should update a habit', async () => {
    const data = {
      title: 'Example habit name updated title',
      description: 'Updated DESC',
    };

    const res = await axios.patch(habitServiceBaseUrl+`/${habitId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.data).toHaveProperty('id');
    expect(res.data).toHaveProperty('title', data.title);
    expect(res.data).toHaveProperty('description', data.description);
  });
});

describe('Delete endpoint', () => {
  it('should delete a habit', async () => {
    const res = await axios.delete(habitServiceBaseUrl+`/${habitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toEqual(HttpStatus.NO_CONTENT);
  });
});
