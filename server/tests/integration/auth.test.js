import pool from '../../data.js'
import { logout, refresh } from '../../controllers/authController.js'
import { jest, beforeEach, afterEach, expect, describe, test } from '@jest/globals'
import { json } from 'express';

let req;
let res;
let user = "11aaae58-033a-4955-a461-0b5ab41381e3"
let refresh_code = "04c83757e213ed782e3db4a822504dbadc67c44588d0f8b0bee7697df7856994cee331101785c059cc1bf53e9ab9cc4f0fc78a17e7328b376b61c86e51d49e12"
let expiry = "2026-05-06 11:26:33.73+00";

let info = {
    id: user,
    google_id: "fake_google_id",
    email: "ebonensed@gmail.com",
    name: "charlie",
    friend_code: "HELLTEAS",
    time_zone: "Australia/Sydney",
}

describe("Refreshing tokens", () => {
    beforeEach(async () => {
        await pool.query("INSERT INTO users (id, google_id, email, name, friend_code, time_zone) VALUES ($1, $2, $3, $4, $5, $6)", [info.id, info.google_id, info.email, info.name, info.friend_code, info.time_zone])
        await pool.query("INSERT INTO refresh_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)", [user, refresh_code, expiry]);
    })
 
    afterEach(async () => {
        await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [user]);
        await pool.query("DELETE FROM users WHERE id = $1", [user]);
    })

    test("Testing refresh and rotating logic works.", async () => {
        
        // This test should create a refresh token in supa base. Then it should be rotated successfully.
        req = {
            userId: user
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockReturnThis(),
        }

        await refresh(req, res);
        const data = await pool.query("SELECT refresh_token FROM refresh_tokens WHERE user_id = $1", [user]);
        
        expect(res.cookie).toHaveBeenCalledWith("refresh_token", expect.any(String), {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/api/auth/refresh", 
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });

        expect(res.cookie).toHaveBeenCalledWith("access_token", expect.any(String), {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path:  "/",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        expect(res.status).toHaveBeenCalledWith(200);
        expect(data.rowCount).toEqual(1);
        expect(data.rows[0].refresh_token).not.toEqual(refresh_code);
    });
});

 describe("Logging Out!", () => {
    beforeEach(async () => {
        await pool.query("INSERT INTO users (id, google_id, email, name, friend_code, time_zone) VALUES ($1, $2, $3, $4, $5, $6)", [info.id, info.google_id, info.email, info.name, info.friend_code, info.time_zone]);
        await pool.query("INSERT INTO refresh_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)", [user, refresh_code, expiry]);
    })

    afterEach(async() => {
        await pool.query("DELETE FROM users WHERE id = $1", [user]);
    })

    afterAll(async () => {
        await pool.end();
    });

    test("Happy Path", async () => {
        const req = {
            user: {user_id: info.id}
        }

        const res = {
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await logout(req, res); 
        
        const data = await pool.query("SELECT * FROM refresh_tokens WHERE user_id = $1", [info.id]);

        expect(data.rowCount).toEqual(0);
        expect(res.clearCookie).toHaveBeenCalledWith("access_token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        expect(res.clearCookie).toHaveBeenCalledWith("refresh_token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        expect(res.status).toHaveBeenCalledWith(200);
    })
})