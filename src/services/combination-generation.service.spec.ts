import {generateCombinations, getItems} from "./combination-generation.service";
import {describe, it, expect} from '@jest/globals';

describe('getItems', () => {
    it('should return correct items for given types', () => {
        expect(getItems([2, 1, 3])).toEqual(['A1', 'A2', 'B1', 'C1', 'C2', 'C3']);
        expect(getItems([0])).toEqual([]);
        expect(getItems([1, 0])).toEqual(['A1']);
        expect(getItems([0, 0, 0])).toEqual([]);
    });

    it('should handle multiple types correctly', () => {
        expect(getItems([3, 2, 1])).toEqual([
            'A1', 'A2', 'A3',
            'B1', 'B2',
            'C1'
        ]);
    });
});

describe('generateCombinations', () => {
    it('should generate combinations of the specified length', () => {
        const items = [2, 1, 3];
        const length = 2;
        const combinations = generateCombinations(items, length);
        expect(combinations).toEqual([
            ['A1', 'B1'],
            ['A1', 'C1'],
            ['A1', 'C2'],
            ['A1', 'C3'],
            ['A2', 'B1'],
            ['A2', 'C1'],
            ['A2', 'C2'],
            ['A2', 'C3'],
            ['B1', 'C1'],
            ['B1', 'C2'],
            ['B1', 'C3'],
        ]);
    });

    it('should return an empty array for length 0', () => {
        const items = [2, 1, 3];
        const combinations = generateCombinations(items, 0);
        expect(combinations).toEqual([[]]);
    });

    it('should return an empty array when there are no valid combinations', () => {
        const items = [0, 0, 0];
        const combinations = generateCombinations(items, 2);
        expect(combinations).toEqual([]);
    });

    it('should handle a case where length exceeds available items', () => {
        const items = [1, 1];
        const length = 3;
        const combinations = generateCombinations(items, length);
        expect(combinations).toEqual([]);
    });

    it('should generate combinations with varying lengths', () => {
        const items = [2, 2];
        const combinations = generateCombinations(items, 1);
        expect(combinations).toEqual([
            ['A1'],
            ['A2'],
            ['B1'],
            ['B2'],
        ]);
    });
});
