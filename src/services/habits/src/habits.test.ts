import request from 'supertest';
import axios from 'axios';

import { app } from './index';
import { HttpStatus } from './common/enum/http-status.enum';

const baseUrl = 'http://localhost:3001';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxMDQ1NTM4M30.Xouludie-IbdKeBI_0fRYs0ywQhDPSXPDnNQmwQx-m-AcFLMgP8FiX_1Irl0ZC5QzSCoTCfIUrkNYesnAlR4qpG5jNu4pPkDr5Kda3rFuH8u3uNnRQkhOy9eI_2wIi1Q656g65yxYXoD3I-YX6x0Sk03NJp-Nw35ZYFItU3frkL_B7CJ4Za77kwwJ7LPH_hwFyaf7naWlsOnppj_crS8WrIMt7hAE9MjfGL0yAFos-D2X_B6hdlUEVX0WeGURNBnhqpqtjSUBRSVNJBh2AXFgHel4uupJKcuUlFT5imos5IJJzxwdFhA-YDsz_1E7zOs1VtFGT55R0LSzBwlGuc34g';
const agent = request(app);

describe('Post endpoint', () => {
  it('should create a new habit', async () => {
    const data = {
      title: 'Example habit name',
      description: 'This is DESC',
    };

    // const res = await request(app)
    //   .post('/api/v1/habits')
    //   .send(data);
    const res = await agent.get('/api/v1/habits')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    // const habitServiceUrl = 'http://localhost:3001/api/v1/habits'; // Docker Compose service name

    // // Send request with token in the Authorization header
    // const res = await axios.post(habitServiceUrl, data, {
    //   headers: {
    //     Authorization: `Bearer ${token}`, // Set Authorization header with the token
    //   },
    // });

    expect(res.status).toEqual(HttpStatus.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', data.title);
    expect(res.body).toHaveProperty('description', data.description);
  });
});

describe('Get endpoint', () => {
  const exampleSnapshot = {
    id: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
  };

  it('should get all habit', async () => {
    const res = await request(app)
      .get('/api/v1/habits/');

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body[0]).toMatchSnapshot({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
    });
  });

  it('should get habit by id', async () => {
    const { body: { id } } = await request(app)
      .get('/api/v1/habits/1');

    const res = await request(app)
      .get(`/api/v1/habits/${id}`);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toMatchSnapshot(exampleSnapshot);
  });
});

describe('PATCH endpoint', () => {
  it('should update a habit', async () => {
    const data = {
      title: 'Example habit name updated title',
      description: 'Updated DESC',
    };

    const { body: { id } } = await request(app)
      .get('/api/v1/habits/1');

    const res = await request(app)
      .put(`/api/v1/habits/${id}`)
      .send(data);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', data.title);
    expect(res.body).toHaveProperty('description', data.description);
  });
});

describe('Delete endpoint', () => {
  it('should delete a habit', async () => {
    const { body: { id } } = await request(app)
      .get('/api/v1/habits/1');

    const res = await request(app)
      .delete(`/api/v1/habits/${id}`);

    expect(res.status).toEqual(HttpStatus.OK);
  });
});
