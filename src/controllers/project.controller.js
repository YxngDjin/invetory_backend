import logger from '#config/logger.js';
import { db } from '#src/config/database.js';
import { projects } from '#src/models/project.js';
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';

export const fetchAllProjects = async (req, res, next) => {
  try {
    logger.info('Getting all projects');

    const { search, active, page = 1, limit = 10 } = req.query;
        
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(projects.name, `%${search}%`),
          ilike(projects.vgNumber, `%${search}%`),
          ilike(projects.description, `%${search}%`),
          ilike(projects.vgNumber, `%${search}%`)
        )
      );
    }

    if (active) {
      filterConditions.push(eq(projects.isActive, active));
    }

    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(projects)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const projectsList = await db
      .select({
        ...getTableColumns(projects),
      })
      .from(projects)
      .where(whereClause)
      .orderBy(desc(projects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: projectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount /limitPerPage)
      }
    });
  } catch (e) {
    logger.error('Error fetching all projects', e);
    next(e);
  }
};