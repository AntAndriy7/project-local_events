import { http } from "../../../lib/http";

export function fetchAllEventsAdmin() {
    // має бути доступно лише ADMIN (бек + фронт)
    return http.get("/api/events/all", { auth: true });
}

export function updateEventStatus(eventId, status) {
    return http.patch(`/api/events/${eventId}/status`, { status }, { auth: true });
}
