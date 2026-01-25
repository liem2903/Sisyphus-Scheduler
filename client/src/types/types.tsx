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