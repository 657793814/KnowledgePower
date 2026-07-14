/**
 * 统一响应格式，对齐 Java 侧的 R.java
 * { code: 200, msg: "ok", data: ... }
 */

import { Response } from 'express';

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T | null;
}

export function ok<T>(res: Response, data: T): void {
  res.json({ code: 200, msg: 'ok', data });
}

export function fail(res: Response, code: number, msg: string, data: any = null): void {
  res.json({ code, msg, data });
}
