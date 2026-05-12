import { useCallback, useEffect, useState } from "react";
import { fetchUserTickets, cancelTicket } from "../api/ticketsApi";

export function useUserTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTickets = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await fetchUserTickets();
            const { tickets: rawTickets = [], events = [], districts = [], categories = [] } = data || {};

            const mergedTickets = rawTickets.map(ticket => {
                const event = events.find(e => e.id === ticket.eventId) || {};
                const district = districts.find(d => d.id === event.districtId) || {};
                const category = categories.find(c => c.id === event.categoryId) || {};

                return {
                    ...ticket,
                    event,
                    district,
                    category
                };
            });

            mergedTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTickets(mergedTickets);
        } catch (e) {
            setError(e.message || "Не вдалося завантажити квитки");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const handleCancelTicket = async (ticketId) => {
        try {
            await cancelTicket(ticketId);
            // Оновлюємо статус локально, щоб не робити зайвий запит на бекенд
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, status: "CANCELED" } : t
            ));
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message || "Помилка при скасуванні" };
        }
    };

    return { tickets, loading, error, reload: loadTickets, handleCancelTicket };
}