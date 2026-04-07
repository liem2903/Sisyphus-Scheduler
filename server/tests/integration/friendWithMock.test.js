describe("Get Friends", () => {
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
            access_token: test_user.google_id,
            time_zone: test_user.time_zone,
        };

        const res = makeRes();

        await getFriends(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const body = res.json.mock.calls[0][0];
        expect(body.status).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
    });
});

describe("Get Last Seen", () => {
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
            access_token: test_user.google_id,
            time_zone: test_user.time_zone,
            query: { name: friend.name }
        };

        const res = makeRes();

        await getLastSeenControl(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const body = res.json.mock.calls[0][0];
        expect(body.status).toBe(true);
        expect(body).toHaveProperty("data");
    });
});