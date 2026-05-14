import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEventDetails, addFavoriteEvent, deleteFavoriteEvent } from "../api/eventsApi";

export function useEventDetails(eventId) {
    const [event, setEvent] = useState(null);
    const [category, setCategory] = useState(null);
    const [district, setDistrict] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        setError("");

        try {
            const data = await fetchEventDetails(eventId);

            const ev = data?.event ?? null;
            const cat = data?.category ?? null;
            const dist = data?.district ?? null;
            const rev = data?.reviews ?? [];

            const enrichedEvent = ev
                ? {
                    ...ev,
                    categoryName: cat?.name ?? null,
                    districtName: dist?.name ?? null,
                }
                : null;

            setEvent(enrichedEvent);
            setCategory(cat);
            setDistrict(dist);
            setReviews(rev);
        } catch (e) {
            setError(e.message || "Не вдалося завантажити деталі події");
            setEvent(null);
            setCategory(null);
            setDistrict(null);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        reload();
    }, [reload]);

    const stats = useMemo(() => {
        const capacity = event?.capacity ?? 0;
        const occupied = event?.occupiedSeats ?? 0;
        const left = Math.max(0, capacity - occupied);
        const soldOut = capacity > 0 && occupied >= capacity;
        return { capacity, occupied, left, soldOut };
    }, [event]);

    const toggleFavorite = useCallback(async (id, currentFavoriteStatus) => {
        const newStatus = !currentFavoriteStatus;

        setEvent((prev) => {
            if (!prev || prev.id !== id) return prev;
            return { ...prev, favorite: newStatus };
        });

        try {
            if (newStatus) {
                await addFavoriteEvent(id);
            } else {
                await deleteFavoriteEvent(id);
            }
        } catch (err) {
            setEvent((prev) => {
                if (!prev || prev.id !== id) return prev;
                return { ...prev, favorite: currentFavoriteStatus };
            });
            alert(err.message || "Помилка при зміні статусу обраного. Можливо, потрібно увійти в акаунт.");
        }
    }, []);

    return { event, category, district, reviews, loading, error, reload, stats, toggleFavorite };
}
