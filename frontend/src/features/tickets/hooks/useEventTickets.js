import { useCallback, useEffect, useMemo, useState, useRef } from "react"; // Додаємо useRef
import { fetchTicketsByEvent } from "../api/ticketsApi";

export function useEventTickets(eventId, refreshTrigger) {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Додаю ref, щоб відстежувати, чи це перше завантаження
    const isFirstLoad = useRef(true);

    const reload = useCallback(async () => {
        if (!eventId) return;

        // Вмикаю екран завантаження ТІЛЬКИ якщо це найперший запит
        if (isFirstLoad.current) {
            setLoading(true);
        }

        setError("");

        try {
            const data = await fetchTicketsByEvent(eventId);
            setTickets(data?.tickets ?? []);
            setUsers(data?.users ?? []);
        } catch (e) {
            setError(e.message || "Не вдалося завантажити квитки");
        } finally {
            setLoading(false);
            // Після першого запиту ставлю false.
            isFirstLoad.current = false;
        }
    }, [eventId]);

    useEffect(() => {
        reload();
    }, [reload, refreshTrigger]);

    const userById = useMemo(() => {
        const m = new Map();
        for (const u of users) m.set(u.id, u);
        return m;
    }, [users]);

    return { tickets, users, userById, loading, error, reload };
}