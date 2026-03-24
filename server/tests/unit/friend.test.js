import { get_status_code } from '../../business/friendBusiness.js';

describe("Unit Test Friend 1: Getting Status", () => {

    describe("Red (> 30 days)", () => {
        test("returns Red for 31 days", () => expect(get_status_code(31)).toBe("Red"));
        test("returns Red for 60 days", () => expect(get_status_code(60)).toBe("Red"));
        test("returns Red for 365 days", () => expect(get_status_code(365)).toBe("Red"));
    });

    describe("Orange (> 14 and <= 30 days)", () => {
        test("returns Orange for 15 days", () => expect(get_status_code(15)).toBe("Orange"));
        test("returns Orange for 20 days", () => expect(get_status_code(20)).toBe("Orange"));
        test("returns Orange for 30 days", () => expect(get_status_code(30)).toBe("Orange"));
    });

    describe("Green (<= 14 days)", () => {
        test("returns Green for 0 days",  () => expect(get_status_code(0)).toBe("Green"));
        test("returns Green for 7 days",  () => expect(get_status_code(7)).toBe("Green"));
        test("returns Green for 14 days", () => expect(get_status_code(14)).toBe("Green"));
    });

    describe("Boundaries", () => {
        test("30 is Orange, 31 is Red",   () => {
            expect(get_status_code(30)).toBe("Orange");
            expect(get_status_code(31)).toBe("Red");
        });
        test("14 is Green, 15 is Orange", () => {
            expect(get_status_code(14)).toBe("Green");
            expect(get_status_code(15)).toBe("Orange");
        });
    });

});