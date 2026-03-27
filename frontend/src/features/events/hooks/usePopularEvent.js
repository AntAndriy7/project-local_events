import { useState, useEffect } from "react";
import { fetchPopularEvent } from "../api/eventsApi";

export function usePopularEvent() {
    const [popularData, setPopularData] = useState(null);
    const [loadingPopular, setLoadingPopular] = useState(true);

    useEffect(() => {
        fetchPopularEvent()
            .then(data => {
                // Якщо бекенд повернув порожній об'єкт, data.event не буде
                if (data && data.event) {
                    setPopularData(data);
                } else {
                    setPopularData(null);
                }
            })
            .catch(err => console.error("Помилка завантаження популярної події:", err))
            .finally(() => setLoadingPopular(false));
    }, []);

    return { popularData, loadingPopular };
}