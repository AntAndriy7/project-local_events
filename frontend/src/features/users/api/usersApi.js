import { http } from "../../../lib/http";

export function fetchUser() {
    return http.get(`/api/users`, { auth: true });
}

export function updateUser(data) {
    return http.put(`/api/users`, data, { auth: true });
}

export function changeUserPassword(passwords) {
    return http.post(`/api/users/change-password`, passwords, { auth: true });
}