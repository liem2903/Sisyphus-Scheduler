import { parseClaudeResponse } from "../../business/calendarBusiness";
import { DateTime } from 'luxon';
import { jest } from '@jest/globals'

describe("Unit Test Calendar 1: Event Creation Tests", () => {
    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    test("Test 1: Given an event with no time - parses the correct event details", () => {
        const event = {
            prompt: "Event 1",
            start_date: "2026-03-29",
            end_date: "2026-03-29",
            start_time: null,
            end_time: null,
            err: null
        }

        const result = parseClaudeResponse(event);
        let start = DateTime.fromISO("2026-03-29").toISODate();
        let end = DateTime.fromISO("2026-03-29").toISODate(); 

        const expectedBody = {
            summary: event.prompt,
            start: {
                date: start,
            },
            end: {
                date: end,
            }
        }
        
        expect(result).toEqual(expectedBody);
    })

    test("Test 2: Given an event with time - parses the correct event details", () => {
        const event = {
            prompt: "Event 1",
            start_date: "2026-03-29",
            end_date: "2026-03-29",
            start_time: "22:30",
            end_time: "23:30",
            err: null
        }

        const result = parseClaudeResponse(event);
        let time_zone = "Australia/Sydney";

        const start = DateTime.fromISO(`${event.start_date}T${event.start_time}`, { zone: time_zone });
        const end = DateTime.fromISO(`${event.start_date}T${event.end_time}`, { zone: time_zone });

        let expectedBody = {
            summary: event.prompt,
            start: {
                dateTime: start.toISO(),
                timeZone: start.zoneName
            },
            end: {
                dateTime: end.toISO(),
                timeZone: end.zoneName
            }
        }
        
        expect(result).toEqual(expectedBody);
    });

    test("Test 3: Error presents", () => {
        const event = {
            prompt: "Event 1",
            start_date: "2026-03-29",
            end_date: "2026-03-29",
            start_time: "22:30",
            end_time: "23:30",
            err: "ERROR IS PRESENT HERE"
        }

        expect(() => parseClaudeResponse(event).toThrow());
    })


});