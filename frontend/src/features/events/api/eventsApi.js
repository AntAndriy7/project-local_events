import { http } from "../../../lib/http";

export function fetchEventsWithReviews() {
    return http.get("/api/events"); // { events: [...], reviews: [...] }
}

export function fetchPopularEvent() {
    return http.get("/api/events/popular");
}

export function fetchMyEvents() {
    return http.get("/api/events/my", { auth: true });
}

export function fetchEventDetails(eventId) {
    return http.get(`/api/events/${eventId}`);
}

export function createEvent(dto) {
    return http.post("/api/events", dto, { auth: true });
}

export function fetchImageSignature() {
    return http.get("/api/cloudinary/signature", { auth: true });
}

export function fetchFavoriteEvent() {
    return http.get(`/api/favorites`, { auth: true });
}

export function addFavoriteEvent(eventId) {
    return http.post(`/api/favorites/${eventId}`, { auth: true });
}

export function deleteFavoriteEvent(eventId) {
    return http.del(`/api/favorites/${eventId}`, { auth: true });
}
