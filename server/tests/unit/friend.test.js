import { jest, expect, test, describe, afterEach } from '@jest/globals';

const last_seen_mock = jest.fn();
const getFriendsDataMock = jest.fn();
const postFriendRequestDataMock = jest.fn();
const setFriendRequestDataMock = jest.fn();
const getFriendRequestsDataMock = jest.fn();
const createFriendMock = jest.fn();
const isFriendedDataMock = jest.fn();
const changeFriendNameRepositoryMock = jest.fn();
const getChangedUserNameMock = jest.fn();
const checkUniqueNameMock = jest.fn();
const isFriendsMock = jest.fn();
const getBusyPeriodsMock = jest.fn();
const getFriendFromNameDataMock = jest.fn();
const getExactFriendFromNameMock = jest.fn();
const checkGroupIdMock = jest.fn();
const createFriendGroupDataMock = jest.fn();
const unfriendRepositoryMock = jest.fn();
const get_friendcode_mock = jest.fn();
const get_timezone_mock = jest.fn();
const get_username_mock = jest.fn();
const redisGetMock = jest.fn();
const redisSetMock = jest.fn();

const getGoogleTokenDataMock = jest.fn();
const getGoogleDataAccessMock = jest.fn();
const getUserDataMock = jest.fn();
const createUserDataMock = jest.fn();
const storeRefreshGoogleDataMock = jest.fn();
const storeRefreshTokenDataMock = jest.fn();
const checkRefreshTokenMock = jest.fn();
const rotateRefreshTokenDataMock = jest.fn();
const logoutDataMock = jest.fn();
const getRefreshTokenMock = jest.fn();
const refreshAccessTokenMock = jest.fn();
const getTimezoneDataMock = jest.fn();


jest.unstable_mockModule("../../data_access/friendRepository.js", () => ({
    getLastSeen: last_seen_mock,
    getFriendsData: getFriendsDataMock,
    postFriendRequestData: postFriendRequestDataMock,
    setFriendRequestData: setFriendRequestDataMock,
    getFriendRequestsData: getFriendRequestsDataMock,
    createFriend: createFriendMock,
    isFriendedData: isFriendedDataMock,
    changeFriendNameRepository: changeFriendNameRepositoryMock,
    getChangedUserName: getChangedUserNameMock,
    checkUniqueName: checkUniqueNameMock,
    isFriends: isFriendsMock,
    getBusyPeriods: getBusyPeriodsMock,
    getFriendFromNameData: getFriendFromNameDataMock,
    getExactFriendFromName: getExactFriendFromNameMock,
    checkGroupId: checkGroupIdMock,
    createFriendGroupData: createFriendGroupDataMock,
    unfriendRepository: unfriendRepositoryMock,
}));

jest.unstable_mockModule("../../data_access/userRepository.js", () => ({
    getFriendCodeRepository: get_friendcode_mock,
    getTimeZoneRepository: get_timezone_mock,
    getUserName: get_username_mock,
}));

jest.unstable_mockModule("../../data_access/authRepository.js", () => ({
  getGoogleTokenData: getGoogleTokenDataMock,
  getGoogleDataAccess: getGoogleDataAccessMock,
  getUserData: getUserDataMock,
  createUserData: createUserDataMock,
  storeRefreshGoogleData: storeRefreshGoogleDataMock,
  storeRefreshTokenData: storeRefreshTokenDataMock,
  checkRefreshToken: checkRefreshTokenMock,
  rotateRefreshTokenData: rotateRefreshTokenDataMock,
  logoutData: logoutDataMock,
  getRefreshToken: getRefreshTokenMock,
  refreshAccessToken: refreshAccessTokenMock,
  getTimezoneData: getTimezoneDataMock,
}));

jest.unstable_mockModule('@upstash/redis', () => ({
  Redis: {
    fromEnv: jest.fn(() => ({
      get: redisGetMock,
      set: redisSetMock,
    })),
  },
}));

const { getLastSeenBusiness, get_status_code, setFriendRequestBusiness, getAvailabilitiesBusiness } = await import("../../business/friendBusiness.js");
describe("All unit tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("Unit Test Friend 1: Last Seen Logic", () => {

        test("Happy Path Test 1: Date and Time", async () => {
            jest.setSystemTime(new Date("2026-03-29T12:00:00Z"));
            last_seen_mock.mockReturnValue({status: true, start: "2026-03-03T18:00:00+11:00"});
            const res = await getLastSeenBusiness("Liem", "filler_google_id", "Syd/Australia");

            expect(res).toEqual({last_seen: "26", status: "Orange"});
        });

        test("Happy Path Test 2: Date Only", async () => {
            jest.setSystemTime(new Date("2026-03-29T12:00:00Z"));
            last_seen_mock.mockReturnValue({status: true, start: "2026-03-03"});
            const res = await getLastSeenBusiness("Liem", "filler_google_id", "Syd/Australia");

            expect(res).toEqual({last_seen: "26", status: "Orange"});
        });

        test("No status", async () => {
            last_seen_mock.mockResolvedValue({status: false});
            const res = await getLastSeenBusiness("Liem", "filler_google_id", "Syd/Australia");
            expect(res).toEqual({ last_seen: "Untracked", status: "Red"});
        });
    })

    describe("Unit Test Friend 2: Setting Friend Requests", () => {
        test("Accepted Happy Path Test", async () => {
            get_username_mock.mockReturnValueOnce({name: "Lily"}).mockReturnValueOnce({name: "Benjamin"});
            const res = await setFriendRequestBusiness("Accepted", "input_test", "input_test2", "input_3")
            expect(res).toEqual({friend_name: "Lily"});
        })

        test("Declined Happy Path Test", async () => {
            const res = await setFriendRequestBusiness("Declined", "input_test", "input_test2", "input_3");
            expect(res).toBeUndefined();
        })
    });    
})

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

describe("getAvailabilitiesBusiness", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns combined busy periods when token is not expired", async () => {
    const fakeNow = 1000000;
    jest.spyOn(Date, "now").mockReturnValue(fakeNow);

    isFriendsMock.mockReturnValue(true);

    redisGetMock
      .mockResolvedValueOnce({
        expiry_time: fakeNow + 5000,
        time_zone: "Australia/Sydney",
      })
      .mockResolvedValueOnce({
        access_token: "friend-access-token",
      });

    getBusyPeriodsMock
      .mockResolvedValueOnce([{ start: "friend-busy-1", end: "friend-busy-2" }])
      .mockResolvedValueOnce([{ start: "my-busy-1", end: "my-busy-2" }]);

    const result = await getAvailabilitiesBusiness(
      1,
      "my-google-id",
      2,
      "2026-03-29",
      "2026-03-30"
    );

    expect(isFriendsMock).toHaveBeenCalledWith(1, 2);

    expect(redisGetMock).toHaveBeenNthCalledWith(1, "google:access:2");
    expect(redisGetMock).toHaveBeenNthCalledWith(2, "google:access:2");

    expect(getBusyPeriodsMock).toHaveBeenNthCalledWith(
      1,
      "friend-access-token",
      "Australia/Sydney",
      "2026-03-29",
      "2026-03-30"
    );

    expect(getBusyPeriodsMock).toHaveBeenNthCalledWith(
      2,
      "my-google-id",
      "Australia/Sydney",
      "2026-03-29",
      "2026-03-30"
    );

    expect(result).toEqual([
      { start: "friend-busy-1", end: "friend-busy-2" },
      { start: "my-busy-1", end: "my-busy-2" },
    ]);

    expect(getRefreshTokenMock).not.toHaveBeenCalled();
    expect(refreshAccessTokenMock).not.toHaveBeenCalled();
    expect(redisSetMock).not.toHaveBeenCalled();

    Date.now.mockRestore();
  });

  test("refreshes token when expired, stores it, then returns combined busy periods", async () => {
    const fakeNow = 1000000;
    jest.spyOn(Date, "now").mockReturnValue(fakeNow);

    isFriendsMock.mockReturnValue(true);

    redisGetMock
      .mockResolvedValueOnce({
        expiry_time: fakeNow - 1000,
        time_zone: "Australia/Sydney",
      })
      .mockResolvedValueOnce({
        access_token: "new-friend-access-token",
      });

    getRefreshTokenMock.mockResolvedValue("refresh-token-123");

    refreshAccessTokenMock.mockResolvedValue({
      access_token: "new-friend-access-token",
      expires_in: 3600,
    });

    getBusyPeriodsMock
      .mockResolvedValueOnce([{ start: "friend-busy", end: "friend-end" }])
      .mockResolvedValueOnce([{ start: "my-busy", end: "my-end" }]);

    const result = await getAvailabilitiesBusiness(
      1,
      "my-google-id",
      2,
      "2026-03-29",
      "2026-03-30"
    );

    expect(getRefreshTokenMock).toHaveBeenCalledWith(2);
    expect(refreshAccessTokenMock).toHaveBeenCalledWith("refresh-token-123");

    expect(redisSetMock).toHaveBeenCalledWith("google:access:2", {
      access_token: "new-friend-access-token",
      expiry_time: fakeNow + 3600 * 1000,
      time_zone: "Australia/Sydney",
    });

    expect(result).toEqual([
      { start: "friend-busy", end: "friend-end" },
      { start: "my-busy", end: "my-end" },
    ]);

    Date.now.mockRestore();
  });

  test("throws 'They are not friends' when any dependency fails", async () => {
    isFriendsMock.mockImplementation(() => {
      throw new Error("not friends");
    });

    await expect(
      getAvailabilitiesBusiness(1, "my-google-id", 2, "2026-03-29", "2026-03-30")
    ).rejects.toThrow("They are not friends");
  });
});