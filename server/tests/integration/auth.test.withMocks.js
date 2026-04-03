import { beforeEach, describe, expect, jest, test } from '@jest/globals'

const getGoogleTokenDataMock = jest.fn();
const getGoogleDataAccessMock = jest.fn();
const getUserDataMock = jest.fn();
const createUserDataMock = jest.fn();
const storeRefreshGoogleDataMock = jest.fn();
const storeRefreshTokenDataMock = jest.fn();
const rotateRefreshTokenDataMock = jest.fn();
const logoutDataMock = jest.fn();
const getTimezoneDataMock = jest.fn();
const redisSet = jest.fn();
const redisGet = jest.fn();

jest.unstable_mockModule("../../data_access/authRepository.js", () => ({
  getGoogleTokenData: getGoogleTokenDataMock,
  getGoogleDataAccess: getGoogleDataAccessMock,
  getUserData: getUserDataMock,
  createUserData: createUserDataMock,
  storeRefreshGoogleData: storeRefreshGoogleDataMock,
  storeRefreshTokenData: storeRefreshTokenDataMock,
  rotateRefreshTokenData: rotateRefreshTokenDataMock,
  logoutData: logoutDataMock,
  getTimezoneData: getTimezoneDataMock,
}));

jest.unstable_mockModule("../../redis.js", () => ({
    redis: ({
        set: redisSet,
        get: redisGet,
    })
}))

let { getGoogleDetails, createRefreshToken, createAccessToken } = await import('../../controllers/authController.js');


describe("Integration Tests for Auth", () => {
    afterEach(() => {
        jest.resetAllMocks();    
    })

    describe("Testing getGoogleDetails", () => {
        let req;
        let res;

        test("Happy Case where user doesn't exist", async () => {
            req = {
                query: {code: "test_code"}
            }

            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            getGoogleTokenDataMock.mockResolvedValue({access_token: "access_token", expires_in: 3600, refresh_token: "refresh_token"})
            getGoogleDataAccessMock.mockResolvedValue({id: "12345", email: "hello@gmail.com", name: "Jacob"});
            getTimezoneDataMock.mockResolvedValue("Australia/Sydney");
            createUserDataMock.mockResolvedValue({id: "test_user_id"});
            await getGoogleDetails(req, res)

            expect(getGoogleTokenDataMock).toHaveBeenCalledTimes(1);
            expect(getGoogleDataAccessMock).toHaveBeenCalledTimes(1);
            expect(getTimezoneDataMock).toHaveBeenCalledTimes(1);
            expect(storeRefreshGoogleDataMock).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("Happy Case where user exists and refrehs token doesn't", async () => {
            req = {
                query: {code: "test_code"}
            }

            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            getGoogleTokenDataMock.mockResolvedValue({access_token: "access_token", expires_in: 3600})
            getGoogleDataAccessMock.mockResolvedValue({id: "12345", email: "hello@gmail.com", name: "Jacob"});
            getTimezoneDataMock.mockResolvedValue("Australia/Sydney");
            getUserDataMock.mockResolvedValue({id: "test_user_id"});
            await getGoogleDetails(req, res)

            expect(getGoogleTokenDataMock).toHaveBeenCalledTimes(1);
            expect(getGoogleDataAccessMock).toHaveBeenCalledTimes(1);
            expect(getTimezoneDataMock).toHaveBeenCalledTimes(1);
            expect(storeRefreshGoogleDataMock).toHaveBeenCalledTimes(0);
            expect(createUserDataMock).toHaveBeenCalledTimes(0);

            expect(res.status).toHaveBeenCalledWith(200);
        });
        
        test("Code does not exist error", async () => {
            req = {
                query: {code: null}
            }

            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await getGoogleDetails(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    })

    describe("create refresh token", () => {
        let res;
        let req;

        test("Happy path!", async () => {
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn().mockReturnThis(),
            }

            req = {
                body: {user_id: "12345"}
            }

            await createRefreshToken(req, res);
            expect(res.cookie).toHaveBeenCalledWith("refresh_token", expect.any(String), {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/api/auth/refresh",
                maxAge: 30 * 24 * 60 * 60 * 1000 
            });

            expect(res.status).toHaveBeenCalledWith(201);
        })

        test("Error with user_id", async () => {
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn().mockReturnThis(),
            }

            req = {
                body: { user_id: null }
            }

            await createRefreshToken(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        })
    })

    describe("create access token", () => {
        let res;
        let req;

        test("Happy path!", async () => {
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn().mockReturnThis(),
            }

            req = {
                body: {user_id: "12345"}
            }

            await createAccessToken(req, res);
            expect(res.cookie).toHaveBeenCalledWith("access_token", expect.any(String), {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60 * 1000 
            });

            expect(res.status).toHaveBeenCalledWith(201);
        })

        test("Error with user_id", async () => {
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn().mockReturnThis(),
            }

            req = {
                body: { user_id: null }
            }

            await createAccessToken(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        })
    })
})