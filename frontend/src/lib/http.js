import { getToken } from "../features/auth/authStorage";

async function request(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();

    if (auth === true && !token) {
        throw new Error("Немає токена. Увійди в акаунт.");
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return null;

    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}

export const http = {
    get: (p, o) => request(p, { ...o }),
    post: (p, b, o) => request(p, { method: "POST", body: b, ...o }),
    put: (p, b, o) => request(p, { method: "PUT", body: b, ...o }),
    patch: (p, b, o) => request(p, { method: "PATCH", body: b, ...o }),
    del: (p, o) => request(p, { method: "DELETE", ...o }),
};
