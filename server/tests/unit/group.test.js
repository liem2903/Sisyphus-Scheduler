// groupBusiness.test.js
import { jest } from '@jest/globals';

// Mock functions for repository calls
const getGroupIdsDataMock = jest.fn();
const getGroupDataIdMock = jest.fn();
const getGroupNameDataMock = jest.fn();
const changeGroupNameDataMock = jest.fn();
const deleteGroupRepositoryMock = jest.fn();

// Mock the repository module
jest.unstable_mockModule('../../data_access/groupRepository.js', () => ({
    getGroupIdsData: getGroupIdsDataMock,
    getGroupDataId: getGroupDataIdMock,
    getGroupNameData: getGroupNameDataMock,
    changeGroupNameData: changeGroupNameDataMock,
    deleteGroupRepository: deleteGroupRepositoryMock,
}));

// Import business functions AFTER mocking
const {
    getGroupIdsBusiness,
    getGroupBusiness,
    changeGroupNameBusiness,
    deleteGroupBusiness
} = await import('../../business/groupBusiness.js');

describe('group business functions', () => {
    let consoleLogSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    describe('getGroupBusiness', () => {
        test('should return group_name and user_ids', async () => {
            const group_id = 'FillerGroupId';

            const mockGroupName = [
                { group_name: 'FillerGroupName' }
            ];

            const mockGroupUsers = [
                { friend_id: 'FillerFriendId' },
                { friend_id: 'FillerFriendId2' },
                { friend_id: 'FillerFriendId3' }
            ];

            getGroupNameDataMock.mockResolvedValue(mockGroupName);
            getGroupDataIdMock.mockResolvedValue(mockGroupUsers);

            const result = await getGroupBusiness(group_id);

            expect(getGroupNameDataMock).toHaveBeenCalledTimes(1);
            expect(getGroupNameDataMock).toHaveBeenCalledWith(group_id);

            expect(getGroupDataIdMock).toHaveBeenCalledTimes(1);
            expect(getGroupDataIdMock).toHaveBeenCalledWith(group_id);

            expect(result).toEqual({
                group_name: mockGroupName[0].group_name,
                user_ids: mockGroupUsers.map((user) => user.friend_id),
            });
        });

        test('should log error and return undefined if getGroupNameData throws', async () => {
            const group_id = 'FILL IN VARIABLES HERE';
            const error = new Error('DB Error');

            getGroupNameDataMock.mockRejectedValue(error);
            await expect(getGroupBusiness('group_1')).rejects.toThrow('DB Error');
            expect(getGroupDataIdMock).not.toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith(error.message);

        });

        test('should log error and return 400 if getGroupDataId throws', async () => {
            const group_id = 'group_1';
            const error = new Error('DB error');

            getGroupNameDataMock.mockResolvedValue([
                { group_name: 'Alpha Team' }
            ]);
            getGroupDataIdMock.mockRejectedValue(error);

            await expect(getGroupBusiness(group_id)).rejects.toThrow('DB error');

            expect(getGroupNameDataMock).toHaveBeenCalledTimes(1);
            expect(getGroupNameDataMock).toHaveBeenCalledWith(group_id);

            expect(getGroupDataIdMock).toHaveBeenCalledTimes(1);
            expect(getGroupDataIdMock).toHaveBeenCalledWith(group_id);

            expect(consoleLogSpy).toHaveBeenCalledWith(error.message);
        });
    });

    describe('changeGroupNameBusiness', () => {
        test('should call repository with id and newName and return repository result', async () => {
            const id = 'FILL IN VARIABLES HERE';
            const newName = 'FILL IN VARIABLES HERE';
            const mockReturnValue = 'FILL IN VARIABLES HERE';

            changeGroupNameDataMock.mockResolvedValue(mockReturnValue);

            const result = await changeGroupNameBusiness(id, newName);

            expect(changeGroupNameDataMock).toHaveBeenCalledTimes(1);
            expect(changeGroupNameDataMock).toHaveBeenCalledWith(id, newName);
            expect(result).toBe(mockReturnValue);
        });
    });

    describe('deleteGroupBusiness', () => {
        test('should call deleteGroupRepository with deleteGroupId', async () => {
            const deleteGroupId = 'TestVariable1';

            deleteGroupRepositoryMock.mockResolvedValue(undefined);

            const result = await deleteGroupBusiness(deleteGroupId);

            expect(deleteGroupRepositoryMock).toHaveBeenCalledTimes(1);
            expect(deleteGroupRepositoryMock).toHaveBeenCalledWith(deleteGroupId);
            expect(result).toBeUndefined();
        });
    });
});