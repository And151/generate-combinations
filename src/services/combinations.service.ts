import pool from '../configs/database-pool';
import { insertIntoItems, selectIdFromItems } from '../queries/itemQueries';
import {
  insertIntoCombinations,
  selectCombination,
  selectCombinationById,
} from '../queries/combinationQueries';
import {
  insertIntoResponses,
  selectResponseByCombinationAndLength,
} from '../queries/responseQueries';

export async function insertItemsAndGetIds(items: string[]): Promise<number[]> {
  const itemIds: number[] = [];
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of items) {
      const [rows] = await connection.query(selectIdFromItems, [item]);
      if ((rows as any[]).length > 0) {
        const existingId = (rows as any)[0].id;
        itemIds.push(existingId);
      } else {
        const [result] = await connection.query(insertIntoItems, [item]);
        const newId = (result as any).insertId;
        itemIds.push(newId);
      }
    }
    await connection.commit();
    return itemIds;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function insertCombinationsAndGetIds(
  combinations: string[][]
): Promise<number> {
  const connection = await pool.getConnection();
  let combinationId;
  const combinationString = JSON.stringify(combinations);
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(selectCombination, [
      combinationString,
    ]);

    if ((rows as any[]).length > 0) {
      combinationId = (rows as any)[0].id;
    } else {
      const [result] = await connection.query(insertIntoCombinations, [
        combinationString,
      ]);
      combinationId = (result as any).insertId;
    }
    await connection.commit();
    return combinationId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function insertResponse(
  requestItems: number[],
  requestLength: number,
  combinationId: number
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query(insertIntoResponses, [
      JSON.stringify(requestItems),
      requestLength,
      combinationId,
    ]);
  } catch (error) {
    console.error('Error inserting response:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function getCombinationIfExists(
  itemNames: string[],
  length: number
) {
  const connection = await pool.getConnection();
  const itemIds = await insertItemsAndGetIds(itemNames);
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      selectResponseByCombinationAndLength,
      [JSON.stringify(itemIds), length]
    );
    const responseCombinationId = rows[0]?.response_combination;
    const [combinationRows] = await connection.query(selectCombinationById, [
      responseCombinationId,
    ]);
    return combinationRows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
     connection.release();
  }
}

