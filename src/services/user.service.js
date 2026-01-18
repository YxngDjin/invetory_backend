import logger from '#config/logger.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.js';
import { db } from '#config/database.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (e) {
    logger.error(`Error getting user by ID ${id}:`, e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existingUser = await getUserById(id);

    if (updates.email && updates.email !== existingUser.email) {
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, updates.email))
        .limit(1);
            
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    const updateData = {
      ...updates,
      updated_at: new Date(),
    };

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt
      });

    logger.info(`User${updatedUser.email} updated successfully`);
    return updatedUser;

  } catch (e) {
    logger.error(`Error updating user ${id}:`, e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    await getUserById(id);

    const [deleteUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        role: users.role
      });

    logger.info(`User ${deleteUser.email} deleted successfully`);
    return deleteUser;
  } catch (e) {
    logger.error(`Error deleting user ${id}:`, e);
    throw e;
  }
};