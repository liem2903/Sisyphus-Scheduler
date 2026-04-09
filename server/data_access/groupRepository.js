// groupRepository.js

import pool from "../data.js";

export async function getGroupIdsData(user_id) {
    let data = await pool.query('SELECT DISTINCT group_id FROM public.GROUP WHERE group_owner = $1', [user_id]);
    return data.rows;
}

export async function getGroupDataId(group_id) {
    let data = await pool.query('SELECT friend_id FROM public.group WHERE group_id = $1', [group_id]);
    return data.rows;
}

export async function getGroupNameData(group_id) {
    let data = await pool.query('SELECT DISTINCT group_name FROM public.group WHERE group_id = $1', [group_id]);
    return data.rows;
}

export async function changeGroupNameData(id, newName) {
    try {
        const result = await pool.query('UPDATE public.group SET group_name = $1 WHERE group_id = $2', [newName, id]);
        if (result.rowCount === 0) throw new Error('Group not found');
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteGroupRepository(deleteGroupId) {
    try {
        const result = await pool.query('DELETE FROM public.group WHERE group_id = $1', [deleteGroupId]);
        if (result.rowCount === 0) throw new Error('Group not found');
    } catch (err) {
        throw new Error(err.message);
    }
}