import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

/**
 * Role-based access control middleware factory.
 * Usage: rbac('ADMIN', 'OPERATOR')
 */
export function rbac(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }

    next();
  };
}
