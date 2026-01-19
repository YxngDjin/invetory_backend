import logger from '#config/logger.js';
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { items } from '#models/item.js';
import { db } from '#config/database.js';

export const fetchAllItems = async (req, res, next) => {
  try {
    logger.info('Getting all Items...');

    const { search, status, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(
      Math.max(1, parseInt(String(limit), 10) || 10),
      100
    );

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(items.name, `%${search}%`),
          ilike(items.manufacturer, `%${search}%`),
          ilike(items.inventoryNumber, `%${search}%`),
          ilike(items.itemNumber, `%${search}%`)
        )
      );
    }

    if (status) {
      filterConditions.push(eq(items.status, status));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(items)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    const itemsList = await db
      .select({
        ...getTableColumns(items),
      })
      .from(items)
      .where(whereClause)
      .orderBy(desc(items.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: itemsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (e) {
    logger.error('Error fetching all items', e);
    next(e);
  }
};
