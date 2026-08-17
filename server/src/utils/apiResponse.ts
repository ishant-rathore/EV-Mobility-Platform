import { Response } from 'express';

/**
 * Standardized API response helper.
 */
export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode: number = 200, message?: string) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message: string = 'Created successfully') {
    return ApiResponse.success(res, data, 201, message);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number
  ) {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }
}
