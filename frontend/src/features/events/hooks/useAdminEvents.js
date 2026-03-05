import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllEventsAdmin, updateEventStatus } from "../api/eventsAdminApi";

export function useAdminEvents() {
    const [events, setEvents] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchAllEventsAdmin();
            setEvents(data?.events ?? data ?? []);
            setDistricts(data?.districts ?? []);
            setCategories(data?.categories ?? []);
        } catch (e) {
            setError(e.message || "Не вдалося завантажити всі події");
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

    const enriched = useMemo(() => {
        return (events ?? []).map((e) => ({
            ...e,
            districtName: districtById.get(e.district_id)?.name ?? null,
            categoryName: categoryById.get(e.category_id)?.name ?? null,
        }));
    }, [events, districtById, categoryById]);

    const setStatus = useCallback(async (eventId, status) => {
        await updateEventStatus(eventId, status);
        await reload();
    }, [reload]);

    return { events: enriched, loading, error, reload, setStatus };
}
