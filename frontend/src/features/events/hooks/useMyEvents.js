import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMyEvents } from "../api/eventsApi";

export function useMyEvents() {
    const [events, setEvents] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchMyEvents();

            setEvents(data?.events ?? []);
            setDistricts(data?.districts ?? []);
            setCategories(data?.categories ?? []);
        } catch (e) {
            setError(e.message || "Не вдалося завантажити твої події");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

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

    return { events: enrichedEvents, loading, error, reload };
}
