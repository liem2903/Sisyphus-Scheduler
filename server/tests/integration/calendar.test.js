import { beforeEach, describe, jest, test } from '@jest/globals'
import pool from '../../data.js'

describe("", () => {
    let req;
    let res;

    beforeEach(() => {
        pool('')
        req = {
            access_token: "filler",
            time_zone: "Syd/Australia"
        }
    });

    test("Happy Path", () => {

    })
})