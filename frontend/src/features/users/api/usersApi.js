import { http } from "../../../lib/http";

export function fetchUserById(id) {
    return http.get(`/api/users/${id}`, { auth: true });
}

export function updateUser(data) {
    return http.put(`/api/users`, data, { auth: true });
}

export function changeUserPassword(passwords) {
    return http.post(`/api/users/change-password`, passwords, { auth: true });
}