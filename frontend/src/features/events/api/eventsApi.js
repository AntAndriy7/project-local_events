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

export function updateEvent(id, dto) {
    return http.put(`/api/events/${id}`, dto, { auth: true });
}

export function deleteEvent(id) {
    return http.del(`/api/events/${id}`, { auth: true });
}
