import { http } from "../../../lib/http";

export async function fetchCategories() {
    const data = await http.get("/api/categories");
    return Array.isArray(data) ? data : [];
}

export async function fetchDistricts() {
    const data = await http.get("/api/districts");
    return Array.isArray(data) ? data : [];
}
