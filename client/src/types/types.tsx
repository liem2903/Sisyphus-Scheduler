export type friendRequest = {
    from_user: string,
    to_user: string,
    status: string,
    id: string,
    requester_name: string,
}

export type friends = {
    name: string,
    id: string,
    changed_name: string,
    last_seen: string,
    status: string,
}

export type busyDates = {
    start: string,
    end: string,
    display: string,
    overlap: boolean,
}

export type groupFriends = {
    friend_name: string,
    friend_id: string
}

export type groupIds = {
    group_id: string
}

export type groupInfo = {
    group_name: string,
    user_ids: string[],
}

export type usedGroupInfo = {
    group_name: string,
    user_ids: string[],
    last_seen: string,
    status: string,
}
 