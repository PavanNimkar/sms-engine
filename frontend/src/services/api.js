import axios from "axios";

const API_BASE = "/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

// ── Auth API ──────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    api.post("/auth/login/", { username, password }),
  logout: () => api.post("/auth/logout/"),
  me: () => api.get("/auth/me/"),
};

// ── Records API ───────────────────────────────────────────────
export const recordsAPI = {
  list: (params = {}) => api.get("/records/", { params }),
  detail: (id) => api.get(`/records/${id}/`),
};

// ── Orders API ────────────────────────────────────────────────
export const ordersAPI = {
  list: (params = {}) => api.get("/orders/", { params }),
  create: (data) => api.post("/orders/", data),
  detail: (id) => api.get(`/orders/${id}/`),
  update: (id, data) => api.patch(`/orders/${id}/`, data),
  destroy: (id) => api.delete(`/orders/${id}/`),
};

// ── Holders CRUD API ──────────────────────────────────────────
export const holdersAPI = {
  list: (params = {}) => api.get("/holders/", { params }),
  create: (data) => api.post("/holders/", data),
  detail: (id) => api.get(`/holders/${id}/`),
  update: (id, data) => api.patch(`/holders/${id}/`, data),
  destroy: (id) => api.delete(`/holders/${id}/`),
};

// ── SMS Registration API ──────────────────────────────────────
export const smsAPI = {
  list: (params = {}) => api.get("/sms/", { params }),
  toggle: (id) => api.patch(`/sms/${id}/toggle/`),
  bulkToggle: (ids, sms_sent) =>
    api.patch("/sms/bulk-toggle/", { ids, sms_sent }),
};

// ── Messaging API (NEW) ───────────────────────────────────────
export const messagingAPI = {
  // Templates
  listTemplates: () => api.get("/messages/templates/"),
  getTemplate: (id) => api.get(`/messages/templates/${id}/`),
  createTemplate: (data) => api.post("/messages/templates/", data),
  updateTemplate: (id, data) => api.patch(`/messages/templates/${id}/`, data),
  deleteTemplate: (id) => api.delete(`/messages/templates/${id}/`),

  // Registrations (joined view — same data as smsAPI.list but from messaging app)
  listRegistrations: (params = {}) =>
    api.get("/messages/registrations/", { params }),

  // Preview — renders message without sending
  previewSms: (data) => api.post("/messages/preview/", data),
  // data = { sms_id: "THAKBAKI_01", tax_record_id: 5 }

  // Send — actually hits cell24x7
  sendSms: (data) => api.post("/messages/send/", data),
  // data = { sms_id: "THAKBAKI_01", tax_record_ids: [1, 2, 3] }

  // Logs
  listLogs: (params = {}) => api.get("/messages/logs/", { params }),
  // params: { tax_record_id, status: "sent"|"failed"|"pending" }
};

export default api;
