import logger from '#config/logger.js';
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { items } from '#models/item.js';
import { db } from '#config/database.js';
import { projects } from '#models/project.js';
import { maintenance } from '#models/maintenance.js';

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

export const fetchItemById = async (req, res) => {
  const itemId = parseInt(req.params.id);

  if (!isFinite(itemId)) return res.status(400).json({ error: 'No Item found' });

  const [itemDetails] = await db
    .select({
      ...getTableColumns(items),
      project: {
        ...getTableColumns(projects),
      },
      maintenance: {
        ...getTableColumns(maintenance),
      },
    })
    .from(items)
    .leftJoin(projects, eq(items.projectId, projects.id))
    .leftJoin(maintenance, eq(items.id, maintenance.itemId))
    .where(eq(items.id, itemId));

  if (!itemDetails) return res.status(404).json({ error: 'No Item found' });

  res.status(200).json({ data: itemDetails });
};

export const createItem = async (req, res, next) => {
  try {
    const [createItem] = await db
      .insert(items)
      .values({
        ...req.body,
      })
      .returning({ id: items.id });

    if (!createItem) return res.status(400).json({ error: 'Item not created' });

    res.status(200).json({ data: createItem });
  } catch (e) {
    logger.error('Error creating item', e);
    next(e);
  }
};
