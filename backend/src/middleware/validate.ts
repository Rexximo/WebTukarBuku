import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import type { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

function firstIssueMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "Data tidak valid.";
}

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(ApiError.badRequest(firstIssueMessage(result.error)));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(ApiError.badRequest(firstIssueMessage(result.error)));
      return;
    }
    res.locals.query = result.data;
    next();
  };
}
