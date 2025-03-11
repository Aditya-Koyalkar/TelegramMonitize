import { AxiosError } from "axios";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HTTPResponseError } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";

interface ErrorResponse {
  error: string;
  success: boolean;
  message: string;
  result: any;
}

const errorHandler = async (err: Error | HTTPResponseError, c: Context) => {
  console.error("Caught error in error handler:", err);

  let response: ErrorResponse;

  if (err instanceof ValidationError) {
    response = {
      success: false,
      error: "Validation Error",
      message: err.message,
      result: err.details,
    };
    return c.json(response, err.status);
  }

  if (err instanceof AxiosError) {
    response = {
      success: false,
      error: "External API Error",
      message: err.response?.data?.message || err.message,
      result: err.response?.data || null,
    };

    const statusCode = (err.status as ContentfulStatusCode) || 500;

    return c.json(response, { status: statusCode });
  }

  if (err instanceof SyntaxError) {
    response = {
      success: false,
      error: "Bad Request",
      message: "Invalid JSON syntax in the request body.",
      result: null,
    };
    return c.json(response, { status: 400 });
  }

  response = {
    success: false,
    error: "Internal Server Error",
    message: "Something went wrong on our end. Please check result for more info.",
    result: err,
  };
  return c.json(response, { status: 500 });
};

export class ValidationError extends HTTPException {
  details: Record<string, any>;
  message: string;

  constructor(message: string, details: Record<string, any> = {}, statusCode: ContentfulStatusCode = 500) {
    const errorResponse = new Response(
      JSON.stringify({
        error: "Validation Error",
        message,
        details,
      }),
      {
        status: statusCode,
      }
    );
    super(statusCode, { res: errorResponse });
    this.details = details;
    this.message = message;
  }
}

export default errorHandler;
