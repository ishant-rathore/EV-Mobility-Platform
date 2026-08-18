import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("API smoke test", () => {
  it("reports a healthy service", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
