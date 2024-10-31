export const insertIntoResponses =
  'INSERT INTO responses (request_items, request_length, response_combination) VALUES (?, ?, ?)';
export const selectResponseByCombinationAndLength =
  "SELECT * FROM responses WHERE request_items = ? AND request_length = ?";
