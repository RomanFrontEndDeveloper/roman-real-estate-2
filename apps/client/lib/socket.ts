import { io } from "socket.io-client";
import { API_URL } from "@/lib/apiUrl";

export const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: (callback) => {
    const token = sessionStorage.getItem("accessToken");

    callback({ token });
  },
});

// Його призначення — підготувати з'єднання між клієнтською частиною Next.js
//  і backend-сервером,
//  щоб надалі можна було реалізувати функції реального часу: наприклад,
// миттєві повідомлення, сповіщення або оновлення даних
//  без перезавантаження сторінки.
