import { useMemo, useState } from "react";
import { reserveTicket, cancelTicket } from "../api/ticketsApi";
import { useEventTickets } from "../hooks/useEventTickets";
import { getUser, getToken } from "../../auth/authStorage";

export default function TicketReservationForm({ event, onAfterChange }) {
    const currentUser = getUser();
    const token = getToken();

    const { tickets, reload } = useEventTickets(event?.id);

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
            <h3 style={titleStyle}>🎫 Бронювання квитків</h3>

            <div style={availabilityInfo}>
                <div style={availabilityLabel}>Доступно місць:</div>
                <div style={availabilityValue}>
                    <span style={availabilityNumber}>{left}</span>
                    <span style={availabilityTotal}> / {capacity}</span>
                </div>
            </div>

            {actionError && <div style={errorBox}>❌ {actionError}</div>}

            {myActiveTicket && (
                <div style={myTicketBox}>
                    <div style={myTicketHeader}>
                        <div style={myTicketTitle}>✅ Твоє бронювання</div>
                        <div style={myTicketQuantity}>{myActiveTicket.quantity} шт.</div>
                    </div>
                    <button
                        onClick={() => handleCancel(myActiveTicket.id)}
                        disabled={submitting}
                        style={btnCancelTicket}
                        type="button"
                    >
                        {submitting ? "Скасування..." : "Скасувати бронь"}
                    </button>
                </div>
            )}

            {!myActiveTicket && (
                <div style={reserveForm}>
                    <label style={labelStyle}>
                        <span style={labelText}>Кількість квитків</span>
                        <input
                            type="number"
                            min={1}
                            max={Math.max(1, left)}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={control}
                            disabled={submitting || left === 0}
                        />
                    </label>

                    <button
                        onClick={handleReserve}
                        disabled={submitting || left === 0}
                        style={left === 0 ? btnDisabled : btn}
                        type="button"
                    >
                        {submitting ? "⏳ Бронювання..." : left === 0 ? "🔴 Немає місць" : "✨ Забронювати"}
                    </button>
                </div>
            )}

            {!token && (
                <div style={loginHint}>
                    💡 Увійди в акаунт, щоб забронювати квитки
                </div>
            )}
        </section>
    );
}

const card = {
    padding: 24,
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.15)",
    background: "rgba(15, 23, 42, 0.4)",
    display: "grid",
    gap: 16,
};

const titleStyle = {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
};

const availabilityInfo = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
};

const availabilityLabel = {
    fontSize: 14,
    opacity: 0.9,
};

const availabilityValue = {
    fontSize: 18,
    fontWeight: 700,
};

const availabilityNumber = {
    color: "#60a5fa",
};

const availabilityTotal = {
    opacity: 0.6,
};

const myTicketBox = {
    padding: 16,
    borderRadius: 12,
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
    display: "grid",
    gap: 12,
};

const myTicketHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const myTicketTitle = {
    fontSize: 15,
    fontWeight: 600,
    color: "#86efac",
};

const myTicketQuantity = {
    fontSize: 16,
    fontWeight: 700,
    color: "#86efac",
};

const btnCancelTicket = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid rgba(239, 68, 68, 0.35)",
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s ease",
};

const reserveForm = {
    display: "grid",
    gap: 12,
};

const labelStyle = {
    display: "grid",
    gap: 8,
};

const labelText = {
    fontSize: 14,
    fontWeight: 600,
    opacity: 0.9,
};

const control = {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.25)",
    background: "rgba(2, 6, 23, 0.6)",
    color: "white",
    fontSize: 14,
};

const btn = {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(37,99,235,0.5)",
    background: "rgba(37,99,235,0.85)",
    color: "white",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    transition: "all 0.2s ease",
};

const btnDisabled = {
    ...btn,
    opacity: 0.5,
    cursor: "not-allowed",
    background: "rgba(100, 100, 100, 0.3)",
};

const loginHint = {
    padding: 12,
    borderRadius: 10,
    background: "rgba(251, 146, 60, 0.1)",
    border: "1px solid rgba(251, 146, 60, 0.2)",
    fontSize: 13,
    opacity: 0.9,
    textAlign: "center",
};

const errorBox = {
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.12)",
    color: "#fca5a5",
};
