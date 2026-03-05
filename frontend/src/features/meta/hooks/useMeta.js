import { useEffect, useState } from "react";
import { fetchCategories, fetchDistricts } from "../api/metaApi";

export function useMeta() {
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const [cats, dists] = await Promise.all([
                    fetchCategories(),
                    fetchDistricts(),
                ]);
                if (!alive) return;
                setCategories(cats || []);
                setDistricts(dists || []);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "Не вдалося завантажити довідники");
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };
    }, []);

    return { categories, districts, loading, error };
}
