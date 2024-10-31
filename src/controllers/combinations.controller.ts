import {
  generateCombinations,
  getItems,
} from '../services/combination-generation.service.js';
import pool from '../configs/database-pool';
import {
  getCombinationIfExists,
  insertCombinationsAndGetIds,
  insertItemsAndGetIds,
  insertResponse,
} from '../services/combinations.service';
import { Router, Request, Response } from 'express';
const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  const { items, length } = req.body;

  if (!Array.isArray(items) || typeof length !== 'number') {
    return res.status(400).json({ error: 'Invalid input format.' });
  }
  const itemNames = getItems(items);
  const generatedCombination = await getCombinationIfExists(itemNames, length);
  if (generatedCombination?.id) {
    res.status(200).json(generatedCombination);
  } else {
    const combinations = generateCombinations(items, length);

    const connection = await pool.getConnection();
    try {
      const itemIds = await insertItemsAndGetIds(itemNames);
      const combinationId = await insertCombinationsAndGetIds(combinations);
      await insertResponse(itemIds, length, combinationId);
      res.status(200).json({
        id: combinationId,
        combination: combinations,
      });
    } catch (error) {
      console.error('Error handling request:', error);
    } finally {
      await connection.release();
    }
  }
});

export default router;
