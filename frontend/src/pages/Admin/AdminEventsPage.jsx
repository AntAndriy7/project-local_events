import { useMemo, useState } from "react";
import Container from "../../components/layout/Container";
import { useAdminEvents } from "../../features/events/hooks/useAdminEvents";
import { Link } from "react-router-dom";
import CustomSelect from "../../components/ui/CustomSelect.jsx";

const STATUS_LABEL = {
    PENDING: "На модерації",
    APPROVED: "Схвалено",
    REJECTED: "Відхилено",
};

const FILTER_OPTIONS = [
    { value: "PENDING", label: STATUS_LABEL.PENDING },
    { value: "APPROVED", label: STATUS_LABEL.APPROVED },
    { value: "REJECTED", label: STATUS_LABEL.REJECTED },
    { value: "ALL", label: "Всі" },
];

const STATUS_CHANGE_OPTIONS = [
    { value: "PENDING", label: "PENDING" },
    { value: "APPROVED", label: "APPROVED" },
    { value: "REJECTED", label: "REJECTED" },
];

export default function AdminEventsPage() {
    const { events, loading, error, reload, setStatus } = useAdminEvents();

    const [filter, setFilter] = useState("PENDING");
    const [q, setQ] = useState("");
    const [busyId, setBusyId] = useState(null);
    const [actionError, setActionError] = useState("");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return (events ?? [])
            .filter((e) => (filter === "ALL" ? true : e.status === filter))
            .filter((e) => {
                if (!query) return true;
                const hay = `${e.title ?? ""} ${e.categoryName ?? ""} ${e.districtName ?? ""}`.toLowerCase();
                return hay.includes(query);
            })
            .sort((a, b) => {
                const da = new Date(`${a.date}T${a.time || "00:00:00"}`).getTime();
                const db = new Date(`${b.date}T${b.time || "00:00:00"}`).getTime();
                return db - da;
            });
    }, [events, filter, q]);

    async function handleStatus(id, status) {
        setActionError("");
        setBusyId(id);
        try {
            await setStatus(id, status);
        } catch (e) {
            setActionError(e.message || "Не вдалося змінити статус");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <main style={{ padding: "22px 0 46px" }}>
            <Container>
                <div style={topRow}>
                    <div>
                        <h1 style={{ margin: 0 }}>Admin • Модерація подій</h1>
                        <div style={{ opacity: 0.75, marginTop: 6 }}>
                            Показує всі події та дозволяє змінювати статуси.
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <Link to="/" style={{ ...btnGhost, textDecoration: "none" }}>На головну</Link>
                        <button onClick={reload} style={btnGhost} type="button">Оновити</button>
                    </div>
                </div>

                <div style={toolbar}>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Пошук: назва / категорія / район…"
                        style={input}
                    />

                    <div style={{ minWidth: 200 }}>
                        <CustomSelect
                            value={filter}
                            onChange={(v) => setFilter(v)}
                            options={FILTER_OPTIONS}
                        />
                    </div>
                </div>

                {actionError && <div style={errorBox}>❌ {actionError}</div>}
                {loading && <div style={{ opacity: 0.8, marginTop: 12 }}>Завантаження…</div>}
                {error && <div style={{ marginTop: 12 }}>❌ {error}</div>}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ opacity: 0.8, marginTop: 12 }}>Нічого не знайдено.</div>
                )}

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                    {filtered.map((e) => {
                        const isBusy = busyId === e.id;
                        const status = e.status || "PENDING";

                        return (
                            <div key={e.id} style={card}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                            <div style={{ fontWeight: 900, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {e.title}
                                            </div>
                                            <span style={{ ...badgeBase, ...statusStyle(status) }}>
                                                {STATUS_LABEL[status] || status}
                                            </span>
                                        </div>

                                        <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
                                            {e.date} {e.time || ""} • {e.districtName ?? `#${e.districtId}`} • {e.categoryName ?? `#${e.categoryId}`}
                                        </div>

                                        <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
                                            Місця: {e.occupiedSeats}/{e.capacity} • userId: {e.userId}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
                                        {status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleStatus(e.id, "APPROVED")}
                                                    disabled={isBusy}
                                                    style={{ ...btnOk, opacity: isBusy ? 0.6 : 1 }}
                                                    type="button"
                                                >
                                                    Схвалити
                                                </button>

                                                <button
                                                    onClick={() => handleStatus(e.id, "REJECTED")}
                                                    disabled={isBusy}
                                                    style={{ ...btnDanger, opacity: isBusy ? 0.6 : 1 }}
                                                    type="button"
                                                >
                                                    Відхилити
                                                </button>
                                            </>
                                        )}

                                        {status !== "PENDING" && (
                                            <div style={{ minWidth: 140 }}>
                                                <CustomSelect
                                                    value={status}
                                                    onChange={(v) => handleStatus(e.id, v)}
                                                    options={STATUS_CHANGE_OPTIONS}
                                                    disabled={isBusy}
                                                />
                                            </div>
                                        )}

                                        <Link to={`/events/${e.id}`} style={{ ...btnGhost, textDecoration: "none" }}>
                                            Деталі
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </main>
    );
}

function statusStyle(s) {
    if (s === "PENDING") return { border: "1px solid rgba(251,146,60,.35)", background: "rgba(251,146,60,.12)" };
    if (s === "APPROVED") return { border: "1px solid rgba(34,197,94,.35)", background: "rgba(34,197,94,.12)" };
    if (s === "REJECTED") return { border: "1px solid rgba(239,68,68,.35)", background: "rgba(239,68,68,.12)" };
    return {};
}

const topRow = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
};

const toolbar = {
    marginTop: 14,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
};

const input = {
    flex: 1,
    minWidth: 260,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    fontSize: 14,
    outline: "none"
};

const card = {
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.16)",
    background: "rgba(255,255,255,.06)",
};

const badgeBase = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.22)",
    opacity: 0.95,
};

const btnGhost = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    cursor: "pointer",
    fontSize: 14
};

const btnOk = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(34,197,94,.35)",
    background: "rgba(34,197,94,.14)",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 14
};

const btnDanger = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.12)",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 14
};

const errorBox = {
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.10)",
    marginTop: 12,
};
