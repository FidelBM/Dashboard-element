import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, isAppError } from "@/lib/errors";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data
    },
    init
  );
}

export function fail(message: string, status = 400, code = "BAD_REQUEST", details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Validation failed.", 400, "VALIDATION_ERROR", error.flatten());
  }

  if (isAppError(error)) {
    return fail(error.message, error.statusCode, error.code);
  }

  console.error(error);
  return fail("An unexpected error occurred.", 500, "INTERNAL_SERVER_ERROR");
}

export function assert(condition: unknown, message: string, statusCode = 400, code = "BAD_REQUEST") {
  if (!condition) {
    throw new AppError(message, statusCode, code);
  }
}
