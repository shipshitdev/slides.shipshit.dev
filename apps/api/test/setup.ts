import { vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://localhost:27017/test";

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(async () => {
  vi.restoreAllMocks();
});
