export const selectCombination =
  'SELECT id FROM combinations WHERE combination = ?';
export const selectCombinationById = 'SELECT * FROM combinations WHERE id = ?';
export const insertIntoCombinations =
  'INSERT INTO combinations (combination) VALUES (?)';
