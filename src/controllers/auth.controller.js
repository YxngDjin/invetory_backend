import logger from '#config/logger.js';
import { signupSchema, signinSchema } from '#validation/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { firstname, lastname, email, password, role } =
      validationResult.data;

    const user = await createUser({
      firstname,
      lastname,
      email,
      password,
      role,
    });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User registered successfully: ${user.id}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (e) {
    logger.error('Error registering the user', e);

    if (e.message === 'User with this email already exists') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Sign In Error', e);

    if (e.message === 'User not found' || e.message === 'Invalid password') {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    next(e);
  }
};

export const signout = (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (e) {
    logger.error('Sign Out Error', e);
    next(e);
  }
};

export const getRefineMeData = (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};