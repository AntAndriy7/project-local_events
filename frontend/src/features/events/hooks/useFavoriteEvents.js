import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFavoriteEvent, deleteFavoriteEvent } from "../api/eventsApi";
import { useMeta } from "../../meta/hooks/useMeta";

export function useFavoriteEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { districts, categories } = useMeta();

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchFavoriteEvent();
            setEvents(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message || "Не вдалося завантажити збережені події");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const enrichedEvents = useMemo(() => {
        return events.map((e) => ({
            ...e,
            districtName: districts?.find(d => String(d.id) === String(e.districtId))?.name || null,
            categoryName: categories?.find(c => String(c.id) === String(e.categoryId))?.name || null,
        }));
    }, [events, districts, categories]);

    const toggleFavorite = useCallback(async (eventId) => {
        setEvents((prev) => prev.filter(e => e.id !== eventId));

        try {
            await deleteFavoriteEvent(eventId);
        } catch (err) {
            reload();
            alert(err.message || "Помилка при видаленні з обраного.");
        }
    }, [reload]);

    return { events: enrichedEvents, loading, error, reload, toggleFavorite };
}
