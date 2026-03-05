import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEventsWithReviews } from "../api/eventsApi";

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
            districtName: districtById.get(e.district_id)?.name ?? null,
            categoryName: categoryById.get(e.category_id)?.name ?? null,
        }));
    }, [events, districtById, categoryById]);

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
    };
}
