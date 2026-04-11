import { getFriendCode, getTimeZone } from "../../controllers/userController"
import { jest, beforeEach, afterEach, describe, expect } from '@jest/globals'
import pool from "../../data"

const user1 = {
    id: "8a791100-135e-481a-bff8-26f73c0c04d5",
    google_id: "googleUserId",
    email: "tester@gmail.com",
    name: "Testesterone",
    friend_code: "ABCDEFGH",
    time_zone: "Australia/Sydney"
}

const user2 = {
    id: "8a791100-135e-481c-bff8-26f73c0c04d5",
    google_id: "googleUserId1",
    email: "tester1@gmail.com",
    name: "Testesterone1",
    friend_code: "ABCBCDGH",
    time_zone: "Australia/Sydney"
}

describe("Big Test", () => {
    beforeEach(async () => {
        await pool.query("INSERT INTO users (id, google_id, email, name, friend_code, time_zone) VALUES ($1, $2, $3, $4, $5, $6)", [user1.id, user1.google_id, user1.email, user1.name, user1.friend_code, user1.time_zone]);
        await pool.query("INSERT INTO users (id, google_id, email, name, friend_code, time_zone) VALUES ($1, $2, $3, $4, $5, $6)", [user2.id, user2.google_id, user2.email, user2.name, user2.friend_code, user2.time_zone]);
    })

    afterEach(async() => {
        await pool.query("DELETE FROM users WHERE id = $1 or id = $2", [user1.id, user2.id])
    })

    describe("Get Friend Code", () => {
        test("Happy Route", async () => {
            const req = {
                user: {user_id: user1.id}
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await getFriendCode(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        })
    })

    describe("Get Time Zone", () => {
        test("Happy Route", async () => {
            const req = {
                user: {user_id: user1.id}
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await getFriendCode(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({status: true, data: expect.any(Object)});
        })
    })
})
