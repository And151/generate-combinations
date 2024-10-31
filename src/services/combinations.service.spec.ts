import pool from '../configs/database-pool';
import {
    insertCombinationsAndGetIds,
    insertItemsAndGetIds,
    insertResponse
} from "./combinations.service";

jest.mock('../configs/database-pool');


describe('Database Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insertItemsAndGetIds', () => {
        it('should insert new items and return their IDs', async () => {
            const items = ['item1', 'item2'];
            const mockConnection = {
                query: jest
                    .fn()
                    .mockResolvedValueOnce([[{ id: 1 }]])
                    .mockResolvedValueOnce([[{ id: 2 }]]),
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

            const result = await insertItemsAndGetIds(items);
            expect(result).toEqual([1, 2]);
            expect(pool.getConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
        });

        it('should roll back on error', async () => {
            const items = ['item1', 'item2'];
            const mockConnection = {
                query: jest.fn().mockRejectedValue(new Error('Query failed')),
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

            await expect(insertItemsAndGetIds(items)).rejects.toThrow('Query failed');
            expect(mockConnection.rollback).toHaveBeenCalled();
        });
    });

    describe('insertCombinationsAndGetIds', () => {
        it('should insert new combinations and return their ID', async () => {
            const combinations = [['A1', 'B1']];
            const mockConnection = {
                query: jest
                    .fn()
                    .mockResolvedValueOnce([[{ id: 1 }]])
                    .mockResolvedValueOnce([{ insertId: 2 }]),
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

            const result = await insertCombinationsAndGetIds(combinations);
            expect(result).toEqual(1);
            expect(pool.getConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
        });

        it('should roll back on error', async () => {
            const combinations = [['A1', 'B1']];
            const mockConnection = {
                query: jest.fn().mockRejectedValue(new Error('Query failed')),
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

            await expect(insertCombinationsAndGetIds(combinations)).rejects.toThrow('Query failed');
            expect(mockConnection.rollback).toHaveBeenCalled();
        });
    });

    describe('insertResponse', () => {
        it('should insert response successfully', async () => {
            const requestItems = [1, 2, 3];
            const requestLength = 3;
            const combinationId = 1;
            const mockConnection = {
                query: jest.fn().mockResolvedValue(undefined),
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

            await insertResponse(requestItems, requestLength, combinationId);
            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.any(String),
                [JSON.stringify(requestItems), requestLength, combinationId]
            );
        });

        it('should handle error when inserting response', async () => {
            const requestItems = [1, 2, 3];
            const requestLength = 3;
            const combinationId = 1;
            const mockConnection = {
                query: jest.fn().mockRejectedValue(new Error('Insert failed')),
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

            await expect(insertResponse(requestItems, requestLength, combinationId)).rejects.toThrow('Insert failed');
        });
    });
});
