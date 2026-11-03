import test from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
process.env.SESSION_SECRET = "test-only-secret-0123456789-abcdefghijklmnopqrstuvwxyz";
process.env.USE_MOCK_DB = "true";
process.env.NODE_ENV = "test";
process.env.MOCK_DB_NAME = `test-${randomUUID()}.json`;
const { hashPassword, verifyPassword, encryptSession, decryptSession } = await import("../lib/crypto.js");
test("service errors distinguish configuration, authentication and outages without exposing secrets", async () => {
  const { ServiceError } = await import("../lib/serviceError.js");
  const { failure, ApiError } = await import("../lib/api.js");
  const cases = [
    [new ServiceError("DATABASE_CONFIGURATION", "private-uri"), "DATABASE_CONFIGURATION"],
    [new ServiceError("SESSION_CONFIGURATION", "private-secret"), "SESSION_CONFIGURATION"],
    [Object.assign(new Error("private-password"), { code: 18 }), "DATABASE_AUTHENTICATION"],
    [Object.assign(new Error("private-host"), { name: "MongooseServerSelectionError", cause: { code: 18 } }), "DATABASE_AUTHENTICATION"],
    [Object.assign(new Error("private-host"), { name: "MongooseServerSelectionError" }), "DATABASE_UNAVAILABLE"],
    [Object.assign(new Error("private-uri"), { name: "MongoParseError" }), "DATABASE_CONFIGURATION"],
    [new Error("private-internals"), "SERVICE_UNAVAILABLE"],
  ];
  for (const [error, code] of cases) {
    const response = failure(error);
    assert.equal(response.status, 503);
    const result = await response.json();
    assert.equal(result.code, code);
    assert.doesNotMatch(JSON.stringify(result), /private-/);
  }
  const invalid = failure(new ApiError(401, "Invalid email or password"));
  assert.equal(invalid.status, 401);
  assert.equal((await invalid.json()).error, "Invalid email or password");
});
test("session authentication, tamper protection, expiry and password hashing", () => {
  const password = hashPassword("correct-password");
  assert.equal(verifyPassword("correct-password", password), true);
  assert.equal(verifyPassword("wrong-password", password), false);
  const token = encryptSession({ id: "a".repeat(24) });
  assert.equal(decryptSession(token).id, "a".repeat(24));
  const parts = token.split(".");
  const bytes = Buffer.from(parts[1], "base64url"); bytes[0] ^= 1;
  parts[1] = bytes.toString("base64url");
  assert.equal(decryptSession(parts.join(".")), null);
  const now = Date.now;
  try { Date.now = () => now() + 8 * 86400000; assert.equal(decryptSession(token), null); }
  finally { Date.now = now; }
  const secret = process.env.SESSION_SECRET;
  delete process.env.SESSION_SECRET;
  assert.throws(() => encryptSession({ id: "a".repeat(24) }), /SESSION_SECRET/);
  process.env.SESSION_SECRET = secret;
});
test("backend signup, login, posting, applications and ownership", async () => {
  const file = path.join(process.cwd(), "data", process.env.MOCK_DB_NAME);
  const signup = await import("../app/api/auth/signup/route.js");
  const login = await import("../app/api/auth/login/route.js");
  const jobs = await import("../app/api/jobs/route.js");
  const apps = await import("../app/api/applications/route.js");
  const update = await import("../app/api/applications/[id]/route.js");
  const me = await import("../app/api/auth/me/route.js");
  const logout = await import("../app/api/auth/logout/route.js");
  function request(url, data, cookie, method = "POST") {
    return new Request("http://localhost:3000" + url, { method, headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) }, ...(method === "GET" ? {} : { body: JSON.stringify(data) }) });
  }
  async function register(email, role) {
    const response = await signup.POST(request("/api/auth/signup", { name: role, email, password: "test-password", role }));
    assert.equal(response.status, 201);
    const result = await login.POST(request("/api/auth/login", { email: email.toUpperCase(), password: "test-password" }));
    assert.equal(result.status, 200);
    const user = (await result.json()).user;
    assert.equal(user.password, undefined);
    return { cookie: result.headers.get("set-cookie").split(";")[0], user };
  }
  try {
    const employer = await register("employer@example.com", "employer");
    const other = await register("other@example.com", "employer");
    const candidate = await register("candidate@example.com", "candidate");
    assert.equal((await signup.POST(request("/api/auth/signup", { name: "X", email: "EMPLOYER@example.com", password: "test-password", role: "employer" }))).status, 409);
    assert.equal((await login.POST(request("/api/auth/login", { email: "employer@example.com", password: "incorrect" }))).status, 401);
    assert.equal((await login.POST(request("/api/auth/login", { email: { $ne: null }, password: "test-password" }))).status, 400);
    assert.equal((await me.GET(request("/api/auth/me", null, employer.cookie, "GET")).then(r => r.json())).user.id, employer.user.id);
    const data = { title: "Developer", company: "Example", location: "Addis", type: "Full-time", category: "Engineering", experience: "Senior", salary: "Negotiable", description: "Build software", companyEmail: "jobs@example.com", deadline: new Date(Date.now() + 86400000).toISOString(), postedBy: other.user.id };
    assert.equal((await jobs.POST(request("/api/jobs", data))).status, 401);
    assert.equal((await jobs.POST(request("/api/jobs", data, candidate.cookie))).status, 403);
    const created = await jobs.POST(request("/api/jobs", data, employer.cookie));
    assert.equal(created.status, 201);
    const job = await created.json();
    assert.equal(String(job.postedBy), employer.user.id);
    const malformed = new Request("http://localhost:3000/api/jobs", { method: "POST", body: "{" });
    assert.equal((await jobs.POST(malformed)).status, 400);
    const crossOrigin = new Request("http://localhost:3000/api/jobs", { method: "POST", headers: { origin: "https://other.example", cookie: employer.cookie }, body: JSON.stringify(data) });
    assert.equal((await jobs.POST(crossOrigin)).status, 403);
    const application = { jobId: job._id, name: "Candidate", email: "candidate@example.com", cvText: "My experience" };
    assert.equal((await apps.POST(request("/api/applications", { ...application, jobId: "invalid" }, candidate.cookie))).status, 400);
    assert.equal((await apps.POST(request("/api/applications", { ...application, jobId: "f".repeat(24) }, candidate.cookie))).status, 404);
    const applied = await apps.POST(request("/api/applications", application, candidate.cookie));
    assert.equal(applied.status, 201);
    const app = (await applied.json()).application;
    assert.equal((await apps.POST(request("/api/applications", application, candidate.cookie))).status, 409);
    const listing = async cookie => (await apps.GET(request("/api/applications", null, cookie, "GET"))).json();
    assert.equal((await listing(candidate.cookie)).length, 1);
    assert.equal((await listing(employer.cookie)).length, 1);
    assert.equal((await listing(other.cookie)).length, 0);
    const params = { params: Promise.resolve({ id: app._id }) };
    assert.equal((await update.PATCH(request("/api/applications/" + app._id, { status: "shortlisted" }, other.cookie, "PATCH"), params)).status, 403);
    assert.equal((await update.PATCH(request("/api/applications/" + app._id, { status: "shortlisted" }, candidate.cookie, "PATCH"), params)).status, 403);
    assert.equal((await update.PATCH(request("/api/applications/" + app._id, { status: "shortlisted" }, employer.cookie, "PATCH"), params)).status, 200);
    process.env.SEED_DEMO_JOBS = "true";
    const list = await (await jobs.GET()).json();
    assert.equal(list.length, 1); assert.equal(list[0]._id, job._id);
    assert.equal((await logout.POST(request("/api/auth/logout", {}))).headers.get("set-cookie").includes("Max-Age=0"), true);
    delete process.env.MONGODB_URI;
    process.env.USE_MOCK_DB = "false";
    const { default: dbConnect } = await import("../lib/mongodb.js");
    await assert.rejects(dbConnect(), /MONGODB_URI/);
    assert.equal(global.useMockDb, false);
    const unavailable = await signup.POST(request("/api/auth/signup", { name: "Candidate", email: "new@example.com", password: "test-password", role: "candidate" }));
    assert.equal(unavailable.status, 503);
    assert.deepEqual(await unavailable.json(), { code: "DATABASE_CONFIGURATION", error: "Account services are not configured yet. Please contact support." });
  } finally { await rm(file, { force: true }); }
});
