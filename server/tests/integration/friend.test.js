import {
    jest,
    beforeEach,
    afterEach,
    describe,
    beforeAll,
    afterAll,
    test,
    expect
} from '@jest/globals';

import pool from '../../data.js';
import {
    getFriends,
    getLastSeenControl,
    getFriendRequests,
    postFriendRequest,
    declineFriendRequest,
    acceptFriendRequest,
    changeFriendName,
    unfriend
} from '../../controllers/friendController.js';

let test_user = {
    user_id: "11111111-1111-1111-1111-111111111111",
    google_id: "access_google",
    email: "email@gmail.com",
    name: "Liem Mok",
    friend_code: "ADJFQOQP",
    time_zone: "Australia/Sydney",
};

let friend = {
    user_id: "22222222-2222-2222-2222-222222222222",
    google_id: "friend_google",
    email: "friendemail@gmail.com",
    name: "Geoffrey Mok",
    friend_code: "ADJEQOQP",
    time_zone: "Australia/Sydney",
};

let request_id = 999999;

function makeRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe("Friend Controller Integration Tests", () => {
    beforeAll(async () => {
        await pool.query(
            `
            INSERT INTO users (id, google_id, email, name, friend_code, time_zone)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
            `,
            [
                test_user.user_id,
                test_user.google_id,
                test_user.email,
                test_user.name,
                test_user.friend_code,
                test_user.time_zone
            ]
        );

        await pool.query(
            `
            INSERT INTO users (id, google_id, email, name, friend_code, time_zone)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
            `,
            [
                friend.user_id,
                friend.google_id,
                friend.email,
                friend.name,
                friend.friend_code,
                friend.time_zone
            ]
        );
    });

    afterAll(async () => {
        await pool.query(
            `DELETE FROM friend_requests WHERE from_user IN ($1, $2) OR to_user IN ($1, $2)`,
            [test_user.user_id, friend.user_id]
        );

        await pool.query(
            `DELETE FROM friendships WHERE user_id IN ($1, $2) OR friend_id IN ($1, $2)`,
            [test_user.user_id, friend.user_id]
        );

        await pool.query(
            `DELETE FROM users WHERE id IN ($1, $2)`,
            [test_user.user_id, friend.user_id]
        );

        await pool.end();
    });

    describe("Get Friend Requests", () => {
        beforeEach(async () => {
            await pool.query(
                `
                INSERT INTO friend_requests (id, from_user, to_user, status)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO NOTHING
                `,
                [request_id, friend.user_id, test_user.user_id, 'Pending']
            );
        });

        afterEach(async () => {
            await pool.query(`DELETE FROM friend_requests WHERE id = $1`, [request_id]);
        });

        test("Happy Path", async () => {
            const req = {
                user: { user_id: test_user.user_id }
            };

            const res = makeRes();

            await getFriendRequests(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const body = res.json.mock.calls[0][0];
            expect(body.status).toBe(true);
            expect(Array.isArray(body.data)).toBe(true);
            expect(body.data.length).toBeGreaterThan(0);
        });
    });

    describe("Post Friend Request", () => {
        beforeEach(async () => {
            await pool.query(
                `DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2`,
                [test_user.user_id, friend.user_id]
            );
        });

        afterEach(async () => {
            await pool.query(
                `DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2`,
                [test_user.user_id, friend.user_id]
            );
        });

        test("Happy Path", async () => {
            const req = {
                user: { user_id: test_user.user_id },
                body: { code: friend.friend_code }
            };

            const res = makeRes();

            await postFriendRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: true });

            const result = await pool.query(
                `
                SELECT *
                FROM friend_requests
                WHERE from_user = $1 AND to_user = $2
                `,
                [test_user.user_id, friend.user_id]
            );

            expect(result.rows).toHaveLength(1);
            expect(result.rows[0]).toEqual(
                expect.objectContaining({
                    from_user: test_user.user_id,
                    to_user: friend.user_id,
                    status: 'Pending'
                })
            );
        });
    });

    describe("Decline Friend Requests", () => {
        beforeEach(async () => {
            await pool.query(
                `
                INSERT INTO friend_requests (id, from_user, to_user, status)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO NOTHING
                `,
                [request_id, friend.user_id, test_user.user_id, 'Pending']
            );
        });

        afterEach(async () => {
            await pool.query(`DELETE FROM friend_requests WHERE id = $1`, [request_id]);
            await pool.query(
                `DELETE FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
                [test_user.user_id, friend.user_id]
            );
        });

        test("Happy Path", async () => {
            const req = {
                body: { id: request_id }
            };

            const res = makeRes();

            await declineFriendRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: true });

            const result = await pool.query(
                `SELECT status FROM friend_requests WHERE id = $1`,
                [request_id]
            );

            expect(result.rows).toHaveLength(1);
            expect(result.rows[0].status).toBe("Declined");

            const friendshipResult = await pool.query(
                `
                SELECT *
                FROM friendships
                WHERE (user_id = $1 AND friend_id = $2)
                   OR (user_id = $2 AND friend_id = $1)
                `,
                [test_user.user_id, friend.user_id]
            );

            expect(friendshipResult.rows).toHaveLength(0);
        });
    });

    describe("Accept Friend Requests", () => {
        beforeEach(async () => {
            await pool.query(
                `
                INSERT INTO friend_requests (id, from_user, to_user, status)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO NOTHING
                `,
                [request_id, friend.user_id, test_user.user_id, 'Pending']
            );
        });

        afterEach(async () => {
            await pool.query(`DELETE FROM friend_requests WHERE id = $1`, [request_id]);
            await pool.query(
                `DELETE FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
                [test_user.user_id, friend.user_id]
            );
        });

        test("Happy Path", async () => {
            const req = {
                user: { user_id: test_user.user_id },
                body: {
                    id: request_id,
                    from_user: friend.user_id
                }
            };

            const res = makeRes();

            await acceptFriendRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: true });

            const requestResult = await pool.query(
                `SELECT status FROM friend_requests WHERE id = $1`,
                [request_id]
            );

            expect(requestResult.rows).toHaveLength(1);
            expect(requestResult.rows[0].status).toBe("Accepted");

            const friendshipResult = await pool.query(
                `
                SELECT *
                FROM friendships
                WHERE (user_id = $1 AND friend_id = $2)
                   OR (user_id = $2 AND friend_id = $1)
                `,
                [test_user.user_id, friend.user_id]
            );

            expect(friendshipResult.rows).toHaveLength(2);
        });
    });

    describe("Change Friend Name", () => {
        beforeEach(async () => {
            await pool.query(
                `
                INSERT INTO friendships (user_id, friend_id, friend_name)
                VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING
                `,
                [test_user.user_id, friend.user_id, friend.name]
            );
        });

        afterEach(async () => {
            await pool.query(
                `DELETE FROM friendships WHERE user_id = $1 AND friend_id = $2`,
                [test_user.user_id, friend.user_id]
            );
        });

        test("Happy Path", async () => {
            const req = {
                user: { user_id: test_user.user_id },
                body: {
                    id: friend.user_id,
                    name: "Bestie"
                }
            };

            const res = makeRes();

            await changeFriendName(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: true });

            const result = await pool.query(
                `
                SELECT friend_name
                FROM friendships
                WHERE user_id = $1 AND friend_id = $2
                `,
                [test_user.user_id, friend.user_id]
            );

            expect(result.rows).toHaveLength(1);
            expect(result.rows[0].friend_name).toBe("bestie");
        });
    });

    describe("Unfriend", () => {
        beforeEach(async () => {
            await pool.query(
                `
                INSERT INTO friendships (user_id, friend_id, friend_name)
                VALUES 
                    ($1, $2, $3),
                    ($2, $1, $4)
                ON CONFLICT DO NOTHING
                `,
                [test_user.user_id, friend.user_id, friend.name, test_user.name]
            );
        });

        afterEach(async () => {
            await pool.query(
                `DELETE FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
                [test_user.user_id, friend.user_id]
            );
        });

        test("Happy Path", async () => {
            const req = {
                user: { user_id: test_user.user_id },
                params: { unfriendId: friend.user_id }
            };

            const res = makeRes();

            await unfriend(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: true });

            const result = await pool.query(
                `
                SELECT *
                FROM friendships
                WHERE (user_id = $1 AND friend_id = $2)
                   OR (user_id = $2 AND friend_id = $1)
                `,
                [test_user.user_id, friend.user_id]
            );

            expect(result.rows).toHaveLength(0);
        });
    });
});