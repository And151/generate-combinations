export const insertIntoResponses =
  'INSERT INTO responses (request_items, request_length, response_combination) VALUES (?, ?, ?)';
export const selectResponseByCombinationAndLength =
  "SELECT * FROM responses WHERE request_items = JSON_EXTRACT(request_items, '$[0]') = ? AND request_length = ?";
