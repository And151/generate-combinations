export function generateCombinations(
  items: number[],
  length: number
): string[][] {
  const mappedItems = getItems(items);
  const combinations: string[][] = [];

  generateCombination(0, [], length, mappedItems, combinations);
  return combinations;
}

function generateCombination(
  start: number,
  current: string[],
  length: number,
  mappedTypes: string[],
  combinations: string[][]
) {
  if (current.length === length) {
    combinations.push([...current]);
    return;
  }

  for (let i = start; i < mappedTypes.length; i++) {
    if (
      current.length === 0 ||
      mappedTypes[i][0] !== current[current.length - 1][0]
    ) {
      current.push(mappedTypes[i]);
      generateCombination(i + 1, current, length, mappedTypes, combinations);
      current.pop();
    }
  }
}

export function getItems(types: number[]): string[] {
  const items = [];
  types.forEach((type, index) => {
    for (let position = 1; position <= type; position++) {
      const rawCharacter: string =
        index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : '-';
      items.push(`${rawCharacter}${position}`);
    }
  });
  return items;
}
