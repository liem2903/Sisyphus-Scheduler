import { beforeEach, describe, expect, jest, test } from '@jest/globals'

const anthropicCreateMock = jest.fn();
const createEventMockData = jest.fn();
const getCalenderMockData = jest.fn();
const deleteFriendMockData = jest.fn();

const fakeAnthropicClient = jest.fn(() => ({
    messages: {
        create: anthropicCreateMock
    }
}))

jest.unstable_mockModule("@anthropic-ai/sdk" , () => ({
    default: fakeAnthropicClient
}))

jest.unstable_mockModule("../../data_access/calendarRepository.js", () => ({
    createEventData: createEventMockData,
    getCalenderData: getCalenderMockData,
    deleteFriendRepository: deleteFriendMockData
}))

const { createEvent } = await import('../../controllers/calendarController.js');

describe("Integration tests", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            access_token: "access_token",
            time_zone: "Australia/Sydney",
            body: { value: "Random Prompt" }
        } 

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
    });

    describe("Create Event Integration Test", () => {
        test("Happy Path", async () => {
            let mockReturn = '{\n' +
            '  "prompt": "hello.",\n' +
            '  "start_date": "2026-04-03",\n' +
            '  "end_date": "2026-04-03",\n' +
            '  "start_time": null,\n' +
            '  "end_time": null,\n' +
            '  "err": null\n' +
            '}'
            
            anthropicCreateMock.mockResolvedValue({content: [{text: mockReturn}]});
            let ans = await createEvent(req, res);
            
            expect(anthropicCreateMock).toHaveBeenCalledTimes(1);
            expect(createEventMockData).toHaveBeenCalledTimes(1);

            console.log(ans);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({success: true});
        })
    })
})