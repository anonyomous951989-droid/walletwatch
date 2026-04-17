jest.mock("../config/emailConfig", () => ({
  sendMail: jest.fn().mockResolvedValue({ message: "Email sent" }),
}));

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.disconnect();
  await mongoose.connect(uri);

  app = require("../server");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

describe("USER AUTH TESTS", () => {
  test("Register User → Should return 200 & Create new user", async () => {
    const res = await request(app)
      .post("/api/v1/users/register")
      .send({
        name: "Test User",
        email: "test@gmail.com",
        password: "Test@12345",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.newUser.name).toBe("Test User");
  });

  test("Register → Should fail for duplicate email", async () => {
    await request(app).post("/api/v1/users/register").send({
      name: "Test2",
      email: "duplicate@gmail.com",
      password: "Test@12345",
    });

    const res = await request(app).post("/api/v1/users/register").send({
      name: "Test2",
      email: "duplicate@gmail.com",
      password: "Test@12345",
    });

    expect(res.statusCode).toBe(400);
  });

  test("Login → Should fail with invalid password", async () => {
    await request(app).post("/api/v1/users/register").send({
      name: "LoginUser",
      email: "login@test.com",
      password: "Test@12345",
    });

    const res = await request(app).post("/api/v1/users/login").send({
      email: "login@test.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(400);
  });

  test("Login → Should login successfully", async () => {
    await request(app).post("/api/v1/users/register").send({
      name: "Login OK",
      email: "loginok@test.com",
      password: "Test@12345",
    });

    const user = await userModel.findOne({ email: "loginok@test.com" });
    user.isVerified = true;
    await user.save();

    const res = await request(app).post("/api/v1/users/login").send({
      email: "loginok@test.com",
      password: "Test@12345",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.token).toBeDefined();
  });

  test("Logged User → Should return user details", async () => {
    await request(app).post("/api/v1/users/register").send({
      name: "Protected",
      email: "protected@test.com",
      password: "Test@12345",
    });

    const user = await userModel.findOne({ email: "protected@test.com" });
    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { expenseAppUserId: user.expenseAppUserId },
      process.env.JWT_SECRETE_KEY
    );

    const res = await request(app)
      .get("/api/v1/users/logged-user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe("Protected");
  });
});
