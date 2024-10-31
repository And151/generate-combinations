const mockQuery = jest.fn();
const mockBeginTransaction = jest.fn();
const mockCommit = jest.fn();
const mockRollback = jest.fn();
const mockGetConnection = jest.fn().mockReturnValue({
    query: mockQuery,
    beginTransaction: mockBeginTransaction,
    commit: mockCommit,
    rollback: mockRollback,
});

const pool = {
    getConnection: mockGetConnection,
};
export const resetMocks = () => {
    mockQuery.mockClear();
    mockBeginTransaction.mockClear();
    mockCommit.mockClear();
    mockRollback.mockClear();
};

export default pool;

