import { http } from "../../../lib/http.js";

export function login(email, password) {
    return http.post("/api/users/login", { email, password });
}

export function register(userDto) {
    return http.post("/api/users/register", userDto);
}
