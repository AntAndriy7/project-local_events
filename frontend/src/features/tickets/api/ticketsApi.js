import { http } from "../../../lib/http";

export function fetchTicketsByEvent(eventId) {
    return http.get(`/api/tickets/event/${eventId}`); // { tickets: [], users: [] }
}

export function fetchUserTickets() {
    return http.get("/api/tickets/booking", { auth: true });
}

export function reserveTicket(eventId, quantity) {
    return http.post(
        "/api/tickets", { eventId, quantity }, { auth: true });
}

export function cancelTicket(ticketId) {
    return http.del(`/api/tickets/${ticketId}`, { auth: true });
}
