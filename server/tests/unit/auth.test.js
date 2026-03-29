import { createRefreshTokenLogic } from '../../business/authBusiness.js'

describe("Unit Tests for Auth", () => {
  describe("Creating refresh token", () => {
    test("Test 1", async() => {
      const res = await createRefreshTokenLogic();
      expect(typeof res.code).toBe("string");
      expect(typeof res.expiresAt).toBe("object");
    })
  })
})