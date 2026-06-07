import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

/* ================= API ================= */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://egzone.runasp.net";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ================= SERVICE ================= */

const NotificationService = {
  async getNotifications() {
    const { data } = await api.get("/api/Notifications");

    const list = Array.isArray(data) ? data : data?.data ?? [];

    return list.map((n) => ({
      id: n.notificationId ?? n.id,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      createdAt: n.createdAt,
    }));
  },

  async markAsRead(id) {
    await api.put(`/api/Notifications/${id}/read`);
  },

  async deleteNotification(id) {
    await api.delete(`/api/Notifications/${id}`);
  },

  async markAllAsRead() {
    await api.put(`/api/Notifications/read-all`);
  },
};

/* ================= CONTEXT ================= */

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        notifications: action.payload,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "UPDATE_ONE":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? action.payload : n
        ),
      };

    case "REMOVE_ONE":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.id
        ),
      };

    default:
      return state;
  }
}

/* ================= PROVIDER ================= */

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const unreadCount = state.notifications.filter(
    (n) => !n.isRead
  ).length;

  const fetchNotifications = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const data = await NotificationService.getNotifications();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, []);

  const markAsRead = useCallback(
    async (id) => {
      const target = state.notifications.find((n) => n.id === id);
      if (!target || target.isRead) return;

      const updated = { ...target, isRead: true };

      dispatch({ type: "UPDATE_ONE", id, payload: updated });

      try {
        await NotificationService.markAsRead(id);
      } catch {
        dispatch({ type: "UPDATE_ONE", id, payload: target });
      }
    },
    [state.notifications]
  );

  const deleteNotification = useCallback(
    async (id) => {
      const target = state.notifications.find((n) => n.id === id);
      if (!target) return;

      dispatch({ type: "REMOVE_ONE", id });

      try {
        await NotificationService.deleteNotification(id);
      } catch {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: state.notifications,
        });
      }
    },
    [state.notifications]
  );

  const markAllAsRead = useCallback(async () => {
    const prev = state.notifications;

    dispatch({
      type: "FETCH_SUCCESS",
      payload: prev.map((n) => ({ ...n, isRead: true })),
    });

    try {
      await NotificationService.markAllAsRead();
    } catch {
      dispatch({
        type: "FETCH_SUCCESS",
        payload: prev,
      });
    }
  }, [state.notifications]);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        unreadCount,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  return ctx;
}