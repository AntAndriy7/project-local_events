import { useMemo, useState } from "react";

export function useEventSearch(events = []) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 1) return [];

        return events
            .filter(e =>
                e.title?.toLowerCase().includes(q) ||
                e.districtName?.toLowerCase().includes(q) ||
                e.categoryName?.toLowerCase().includes(q)
            )
            .slice(0, 6);
    }, [query, events]);

    return {
        query,
        setQuery,
        results,
        open,
        setOpen,
        hasResults: results.length > 0,
    };
}
