import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEventsWithReviews, addFavoriteEvent, deleteFavoriteEvent } from "../api/eventsApi";

export function useEvents(autoFetch = true) {
    const [events, setEvents] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchEventsWithReviews();

            setEvents(data?.events ?? []);
            setReviews(data?.reviews ?? []);
            setDistricts(data?.districts ?? []);
            setCategories(data?.categories ?? []);
        } catch (e) {
            setError(e.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            reload();
        }
    }, [reload, autoFetch]);

    const districtById = useMemo(() => {
        const m = new Map();
        for (const d of districts) m.set(d.id, d);
        return m;
    }, [districts]);

    const categoryById = useMemo(() => {
        const m = new Map();
        for (const c of categories) m.set(c.id, c);
        return m;
    }, [categories]);

    const enrichedEvents = useMemo(() => {
        return events.map((e) => ({
            ...e,
            districtName: districtById.get(e.districtId)?.name ?? null,
            categoryName: categoryById.get(e.categoryId)?.name ?? null,
        }));
    }, [events, districtById, categoryById]);

    const toggleFavorite = useCallback(async (eventId, currentFavoriteStatus) => {
        const newStatus = !currentFavoriteStatus;

        setEvents((prev) =>
            prev.map((e) => (e.id === eventId ? { ...e, favorite: newStatus } : e))
        );

        try {
            if (newStatus) {
                await addFavoriteEvent(eventId);
            } else {
                await deleteFavoriteEvent(eventId);
            }
        } catch (err) {
            setEvents((prev) =>
                prev.map((e) => (e.id === eventId ? { ...e, favorite: currentFavoriteStatus } : e))
            );
            alert(err.message || "Помилка при зміні статусу обраного. Можливо, потрібно увійти в акаунт.");
        }
    }, []);

    return {
        events: enrichedEvents,
        rawEvents: events,
        reviews,
        districts,
        categories,
        districtById,
        categoryById,
        loading,
        error,
        reload,
        toggleFavorite,
    };
}
