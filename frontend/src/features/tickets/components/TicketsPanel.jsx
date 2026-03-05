import { useMemo, useState } from "react";
import { cancelTicket, reserveTicket } from "../api/ticketsApi";
import { useEventTickets } from "../hooks/useEventTickets";
import { getUser, getToken } from "../../auth/authStorage";

export default function TicketsPanel({ event, onAfterChange }) {
    const currentUser = getUser();
    const token = getToken();

    const { tickets, userById, loading, error, reload } = useEventTickets(event?.id);

    const capacity = event?.capacity ?? 0;
    const occupied = event?.occupied_seats ?? 0;
    const left = Math.max(0, capacity - occupied);

    const [quantity, setQuantity] = useState(1);
    const [actionError, setActionError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const myActiveTicket = useMemo(() => {
        if (!currentUser?.id) return null;
        return tickets.find(
            (t) => t.user_id === currentUser.id && t.status === "RESERVED"
        );
    }, [tickets, currentUser?.id]);

    async function handleReserve() {
        setActionError("");

        if (!token) {
            setActionError("Щоб бронювати квитки — увійди в акаунт.");
            return;
        }
        if (!event?.id) return;

        const q = Number(quantity);
        if (!Number.isFinite(q) || q < 1) return setActionError("Кількість має бути >= 1.");
        if (q > left) return setActionError("Недостатньо вільних місць.");
        if (myActiveTicket) return setActionError("Ти вже маєш активну бронь на цю подію.");

        setSubmitting(true);
        try {
            await reserveTicket(event.id, q);
            await reload();
            await onAfterChange?.();
        } catch (e) {
            setActionError(e.message || "Помилка бронювання");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCancel(ticketId) {
        setActionError("");
        if (!token) return setActionError("Потрібен логін.");
        setSubmitting(true);
        try {
            await cancelTicket(ticketId);
            await reload();
            await onAfterChange?.();
        } catch (e) {
            setActionError(e.message || "Помилка скасування");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section style={card}>
            <h3 style={{ margin: "0 0 10px" }}>Квитки</h3>

            <div style={{ opacity: 0.85, marginBottom: 10 }}>
                Вільно місць: <b>{left}</b> з <b>{capacity}</b>
            </div>

            {actionError && <div style={errorBox}>❌ {actionError}</div>}

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input
                    type="number"
                    min={1}
                    max={Math.max(1, left)}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={control}
                    disabled={submitting || left === 0 || Boolean(myActiveTicket)}
                />

                <button
                    onClick={handleReserve}
                    disabled={submitting || left === 0 || Boolean(myActiveTicket)}
                    style={{ ...btn, opacity: submitting || left === 0 || myActiveTicket ? 0.6 : 1 }}
                    type="button"
                >
                    {myActiveTicket ? "Вже заброньовано" : left === 0 ? "Немає місць" : "Забронювати"}
                </button>

                <button onClick={reload} disabled={submitting} style={btnGhost} type="button">
                    Оновити список
                </button>
            </div>

            <hr style={hr} />

            {loading && <div style={{ opacity: 0.8 }}>Завантаження квитків…</div>}
            {error && <div>❌ {error}</div>}

            {!loading && !error && tickets.length === 0 && (
                <div style={{ opacity: 0.8 }}>Поки що немає бронювань.</div>
            )}

            <div style={{ display: "grid", gap: 8 }}>
                {tickets.map((t) => {
                    const u = userById.get(t.user_id);
                    const isMine = currentUser?.id === t.user_id;
                    const canCancel = isMine && t.status === "RESERVED";

                    return (
                        <div key={t.id} style={ticketRow}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {u?.user_name || `User #${t.user_id}`}
                                    {isMine ? " (ти)" : ""}
                                </div>
                                <div style={{ opacity: 0.8, fontSize: 13 }}>
                                    К-сть: {t.quantity} • Статус: {t.status}
                                </div>
                            </div>

                            {canCancel && (
                                <button
                                    onClick={() => handleCancel(t.id)}
                                    disabled={submitting}
                                    style={btnDanger}
                                    type="button"
                                >
                                    Скасувати
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

const card = {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.6)",
};

const control = {
    width: 120,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.25)",
    background: "rgba(2, 6, 23, 0.6)",
    color: "white",
};

const btn = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(37,99,235,0.5)",
    background: "rgba(37,99,235,0.85)",
    color: "white",
    cursor: "pointer",
};

const btnGhost = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.25)",
    background: "rgba(2, 6, 23, 0.25)",
    color: "white",
    cursor: "pointer",
};

const btnDanger = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(239, 68, 68, 0.35)",
    background: "rgba(239, 68, 68, 0.12)",
    color: "white",
    cursor: "pointer",
};

const ticketRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.25)",
};

const hr = {
    border: "none",
    borderTop: "1px solid rgba(148,163,184,0.15)",
    margin: "14px 0"
};

const errorBox = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.12)",
    marginBottom: 10,
};
