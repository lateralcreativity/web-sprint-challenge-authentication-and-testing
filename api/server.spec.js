const request = require('supertest');
const server = require('./server');
const db = require("../database/dbConfig");

describe('register', () => {
    beforeEach(() => db("users").truncate());

    it('can register a new user', () => {
        return request(server)
        .post('/api/auth/register')
        .send({ username: 'one', password: 'pass' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(payload => {
            expect(payload.body.data)
        })
    });

    it('can fail registering an invalid user', () => {
        return request(server)
        .post('/api/auth/register')
        .send({ username: 'one' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(payload => {
            expect(payload.body.message).toBe('Username and password are required fields.')
        })
    });
});

describe('log in', () => {
    beforeEach(() => db("users").truncate());

    it('can log in successfully', async () => {
        await request(server)
        .post("/api/auth/register")
        .send({ username: "one", password: "pass" });

        return request(server)
        .post('/api/auth/login')
        .send({ username: 'one', password: 'pass' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(payload => {
            expect(payload.body.message).toBe('welcome')
        })
    })

    it('can fail on bad log in', () => {
        return request(server)
        .post('/api/auth/login')
        .send({ username: 'one', password: 'wrongpass' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .then(payload => {
            expect(payload.body.message).toBe('invalid credentials')
        })
    })
});