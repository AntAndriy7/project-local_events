import { useMemo, useState } from "react";
import Container from "../../components/layout/Container";
import EventCard from "../../features/events/components/EventCard";
import { useMyEvents } from "../../features/events/hooks/useMyEvents";
import CustomSelect from "../../components/ui/CustomSelect.jsx";

const STATUS_LABEL = {
    PENDING: "На модерації",
    APPROVED: "Схвалено",
    REJECTED: "Відхилено",
};

const FILTER_OPTIONS = [
    { value: "ALL", label: "Всі статуси" },
    { value: "PENDING", label: STATUS_LABEL.PENDING },
    { value: "APPROVED", label: STATUS_LABEL.APPROVED },
    { value: "REJECTED", label: STATUS_LABEL.REJECTED },
];

export default function MyEventsPage() {
    const { events, loading, error, reload } = useMyEvents();
    const [status, setStatus] = useState("ALL");

    const filtered = useMemo(() => {
        if (status === "ALL") return events;
        return events.filter((e) => e.status === status);
    }, [events, status]);

    return (
        <main style={{ padding: "22px 0 46px" }}>
            <Container>
                <div style={topRow}>
                    <div>
                        <h1 style={{ margin: 0 }}>Мої події</h1>
                        <div style={{ opacity: 0.75, marginTop: 6 }}>
                            Тут показані всі твої події зі статусами: модерація / схвалено / відхилено.
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ minWidth: 200 }}>
                            <CustomSelect
                                value={status}
                                onChange={(v) => setStatus(v)}
                                options={FILTER_OPTIONS}
                            />
                        </div>

                        <button onClick={reload} style={btnGhost} type="button">
                            Оновити
                        </button>
                    </div>
                </div>

                {loading && <div style={{ opacity: 0.8, marginTop: 12 }}>Завантаження…</div>}
                {error && <div style={{ marginTop: 12 }}>❌ {error}</div>}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ opacity: 0.8, marginTop: 12 }}>
                        Немає подій для вибраного статусу.
                    </div>
                )}

                <div style={grid}>
                    {filtered.map((e) => (
                        <EventCard key={e.id} event={e} showStatus />
                    ))}
                </div>
            </Container>
        </main>
    );
}

const topRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
};

const grid = {
    marginTop: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
};

const btnGhost = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    cursor: "pointer",
};
