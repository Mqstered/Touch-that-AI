import type { ApiResult } from '@/types';

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

export function err<T>(error: string): ApiResult<T> {
  return { ok: false, error };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatRelativeDate(date: string): string {
  return date;
}
