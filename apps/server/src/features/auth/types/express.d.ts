import type { AuthRole } from "../utils/token.js"; // "admin" | "agency" | "agent" | "owner-client";

declare global {
  //«Я хочу доповнити глобальні типи TypeScript».(розширюємо вже існуючий Express.Request.)
  namespace Express {
    //«Зараз я хочу внести додаткову інформацію саме в Express.Request.»
    interface Request {
      user?: {
        userId: string;
        role: AuthRole; //«У нашому Express req може мати поле user, і ось яка в нього структура».
      };
    }
  }
}

export {};
