import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.js';
import { db } from '#config/database.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error('Error hashing the password', e);
    throw new Error('Error hashing the password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error('Error comparing the password', e);
    throw new Error('Error comparing the password');
  }
};

export const createUser = async ({ firstname, lastname, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
        
    if (existingUser.length > 0) 
      throw new Error('User with this email already exists');

    const password_hash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ firstname, lastname, email, password: password_hash, role })
      .returning({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
      });

    logger.info('User created successfully', { userId: newUser.id });
    return newUser;
  } catch (e) {
    logger.error('Error creating the user', e);
    throw e;
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(password, existingUser.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${existingUser.email} authenticated successfully`);
    return {
      id: existingUser.id,
      firstname: existingUser.firstname,
      lastname: existingUser.lastname,
      email: existingUser.email,
      role: existingUser.role,
      created_at: existingUser.createdAt,
    };
  } catch (e) {
    logger.error('Error authenticating the user', e);
    throw e;
  }
};