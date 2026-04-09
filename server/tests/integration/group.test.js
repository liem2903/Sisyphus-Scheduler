// groupController.test.js

import { getGroup, getGroupIds, changeGroupName, deleteGroup } from '../../controllers/groupController.js';
import pool from '../../data.js';
import { jest, beforeEach, afterEach, afterAll, describe, it, expect } from '@jest/globals';

let client;

beforeEach(async () => {
    client = await pool.connect();
    await client.query('BEGIN');
    jest.spyOn(pool, 'query').mockImplementation((...args) => client.query(...args));
});

afterEach(async () => {
    await client.query('ROLLBACK');
    client.release();
    jest.restoreAllMocks();
});

afterAll(async () => {
    await pool.end();
});

async function seedGroup({ group_id, group_name, group_owner, members = [] }) {
    for (const { friend_id, friend_name } of members) {
        await client.query(
            `INSERT INTO public.group (group_id, group_name, group_owner, friend_id, friend_name)
             VALUES ($1, $2, $3, $4, $5)`,
            [group_id, group_name, group_owner, friend_id, friend_name]
        );
    }
    return group_id;
}

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// ─────────────────────────────────────────────
// getGroup
// ─────────────────────────────────────────────
describe('getGroup', () => {
    it('should return 200 with group_name and user_ids for a valid group', async () => {
        await seedGroup({
            group_id: 'group_1',
            group_name: 'Alpha Team',
            group_owner: 'user_1',
            members: [
                { friend_id: 'user_1', friend_name: 'Alice' },
                { friend_id: 'user_2', friend_name: 'Ben' },
            ],
        });

        const req = { query: { group_id: 'group_1' } };
        const res = mockRes();

        await getGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: true,
                data: expect.objectContaining({
                    group_name: 'Alpha Team',
                    user_ids: expect.arrayContaining(['user_1', 'user_2']),
                }),
            })
        );
    });

    it('should return 400 for a group_id that does not exist', async () => {
        const req = { query: { group_id: 'nonexistent_group' } };
        const res = mockRes();

        await getGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ status: false });
    });
});

// ─────────────────────────────────────────────
// getGroupIds
// ─────────────────────────────────────────────
describe('getGroupIds', () => {
    it('should return 200 and all group_ids owned by the user', async () => {
        await seedGroup({
            group_id: 'group_1',
            group_name: 'Group A',
            group_owner: 'user_10',
            members: [{ friend_id: 'user_10', friend_name: 'Alice' }],
        });
        await seedGroup({
            group_id: 'group_2',
            group_name: 'Group B',
            group_owner: 'user_10',
            members: [{ friend_id: 'user_10', friend_name: 'Alice' }],
        });

        const req = { user: { user_id: 'user_10' } };
        const res = mockRes();

        await getGroupIds(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        const { data } = res.json.mock.calls[0][0];
        const returnedIds = data.map((r) => r.group_id);
        expect(returnedIds).toEqual(expect.arrayContaining(['group_1', 'group_2']));
    });

    it('should return 200 with an empty array when the user owns no groups', async () => {
        const req = { user: { user_id: 'nonexistent_user' } };
        const res = mockRes();

        await getGroupIds(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: true, data: [] });
    });
});

// ─────────────────────────────────────────────
// changeGroupName
// ─────────────────────────────────────────────
describe('changeGroupName', () => {
    it('should return 200 and persist the new name in the DB', async () => {
        await seedGroup({
            group_id: 'group_1',
            group_name: 'Old Name',
            group_owner: 'user_1',
            members: [{ friend_id: 'user_1', friend_name: 'Alice' }],
        });

        const req = { body: { id: 'group_1', name: 'New Name' } };
        const res = mockRes();

        await changeGroupName(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const { rows } = await client.query(
            'SELECT group_name FROM public.group WHERE group_id = $1',
            ['group_1']
        );
        expect(rows[0].group_name).toBe('New Name');
    });

    it('should return 400 when the group_id does not exist', async () => {
        const req = { body: { id: 'nonexistent_group', name: 'Ghost Name' } };
        const res = mockRes();

        await changeGroupName(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ status: false });
    });
});

// ─────────────────────────────────────────────
// deleteGroup
// ─────────────────────────────────────────────
describe('deleteGroup', () => {
    it('should return 200 and remove all rows for the group from the DB', async () => {
        await seedGroup({
            group_id: 'group_1',
            group_name: 'To Be Deleted',
            group_owner: 'user_1',
            members: [
                { friend_id: 'user_1', friend_name: 'Alice' },
                { friend_id: 'user_2', friend_name: 'Ben' },
            ],
        });

        const req = { params: { deleteGroupId: 'group_1' } };
        const res = mockRes();

        await deleteGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: true });

        const { rows } = await client.query(
            'SELECT * FROM public.group WHERE group_id = $1',
            ['group_1']
        );
        expect(rows).toHaveLength(0);
    });

    it('should return 400 when deleting a group_id that does not exist', async () => {
        const req = { params: { deleteGroupId: 'nonexistent_group' } };
        const res = mockRes();

        await deleteGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ status: false });
    });
});