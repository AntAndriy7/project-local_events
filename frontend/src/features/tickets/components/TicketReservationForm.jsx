import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { reserveTicket, cancelTicket } from "../api/ticketsApi";
import { useEventTickets } from "../hooks/useEventTickets";
import { getUser, getToken } from "../../auth/authStorage";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function TicketReservationForm({ event, onAfterChange }) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = getUser();
    const token = getToken();

    const { tickets, reload } = useEventTickets(event?.id);

    const capacity = event?.capacity ?? 0;
    const occupied = event?.occupied_seats ?? 0;
    const left = Math.max(0, capacity - occupied);

    const [quantity, setQuantity] = useState(1);

    const [isReserving, setIsReserving] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const [ticketToCancel, setTicketToCancel] = useState(null);

    const myActiveTicket = useMemo(() => {
        if (!currentUser?.id) return null;
        return tickets.find(
            (t) => t.user_id === currentUser.id && t.status === "RESERVED"
        );
    }, [tickets, currentUser?.id]);

    const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
    const increment = () => setQuantity((prev) => Math.min(left, prev + 1));

    async function handleReserve() {
        if (!token) {
            navigate(location.pathname, {
                replace: true,
                state: { openLogin: true, from: location.pathname }
            });
            return;
        }

        if (!event?.id) return;

        const q = Number(quantity);
        if (!Number.isFinite(q) || q < 1) return alert("Кількість має бути >= 1.");
        if (q > left) return alert("Недостатньо вільних місць.");
        if (myActiveTicket) return alert("Ти вже маєш активну бронь на цю подію.");

        setIsReserving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            await reserveTicket(event.id, q);
            await reload();
            await onAfterChange?.();
        } catch (e) {
            alert(e.message || "Помилка бронювання");
        } finally {
            setIsReserving(false);
        }
    }

    async function proceedCancel() {
        if (!ticketToCancel) return;

        const id = ticketToCancel;
        setTicketToCancel(null);
        setIsCanceling(true);
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            await cancelTicket(id);
            await reload();
            await onAfterChange?.();
        } catch (e) {
            alert(e.message || "Помилка скасування");
        } finally {
            setIsCanceling(false);
        }
    }

    return (
        <section style={panel}>
            <div style={panelHeader}>
                <h3 style={titleStyle}>🎫 Бронювання</h3>
            </div>

            {myActiveTicket ? (
                <>
                    <div style={ticketInfoRow}>
                        <span style={availabilityLabel}>Кількість квитків</span>
                        <div style={ticketQuantityBadge}>
                            <span style={ticketQuantityNumber}>{myActiveTicket.quantity}</span>
                            <span style={ticketQuantitySuffix}>шт.</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setTicketToCancel(myActiveTicket.id)}
                        disabled={isCanceling}
                        style={btnCancelFlat}
                        type="button"
                    >
                        {isCanceling ? "Обробка..." : "Скасувати бронь"}
                    </button>
                </>
            ) : (
                <>
                    <div style={ticketInfoRow}>
                        <span style={availabilityLabel}>Вільні місця</span>
                        <div style={availabilityBadge}>
                            <span style={availabilityNumber}>{left}</span>
                            <span style={availabilityTotal}> / {capacity}</span>
                        </div>
                    </div>

                    <div style={reserveForm}>
                        <div style={labelStyle}>
                            <span style={labelText}>Кількість</span>

                            <div style={counterContainer}>
                                <button
                                    type="button"
                                    onClick={decrement}
                                    disabled={isReserving || left === 0 || quantity <= 1}
                                    style={quantity <= 1 ? counterBtnDisabled : counterBtn}
                                >
                                    −
                                </button>

                                <div style={counterValue}>
                                    {left === 0 ? 0 : quantity}
                                </div>

                                <button
                                    type="button"
                                    onClick={increment}
                                    disabled={isReserving || left === 0 || quantity >= left}
                                    style={quantity >= left ? counterBtnDisabled : counterBtn}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleReserve}
                            disabled={isReserving || left === 0}
                            style={left === 0 ? btnDisabled : btnPrimary}
                            type="button"
                        >
                            {isReserving
                                ? "Бронювання..."
                                : left === 0
                                    ? "Немає місць"
                                    : "Забронювати"}
                        </button>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={ticketToCancel !== null}
                icon="🎫"
                title="Скасувати бронювання?"
                text="Ви впевнені, що хочете відмовитись від квитка? Ваше місце одразу стане доступним для інших учасників."
                cancelText = "Назад"
                onConfirm={proceedCancel}
                onCancel={() => setTicketToCancel(null)}
            />
        </section>
    );
}

const panel = {
    padding: 24,
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(15, 23, 42, 0.4)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 20,
};

const panelHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const titleStyle = {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#f8fafc",
};

const ticketInfoRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const ticketQuantityBadge = {
    padding: "4px 12px",
    borderRadius: 999,
    background: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    display: "flex",
    alignItems: "baseline",
    gap: 4,
};

const ticketQuantityNumber = {
    color: "#4ade80", // Світло-зелений
    fontWeight: 800,
    fontSize: 15,
};

const ticketQuantitySuffix = {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
};

const btnCancelFlat = {
    padding: "12px",
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.25)",
    background: "rgba(239, 68, 68, 0.08)",
    color: "#fca5a5",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s ease",
    textAlign: "center",
};

const availabilityLabel = {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: 500,
};

const availabilityBadge = {
    padding: "4px 12px",
    borderRadius: 999,
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    display: "flex",
    alignItems: "baseline",
    gap: 4,
};

const availabilityNumber = {
    color: "#60a5fa",
    fontWeight: 800,
    fontSize: 15,
};

const availabilityTotal = {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
};

const reserveForm = {
    display: "grid",
    gap: 20,
};

const labelStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const labelText = {
    fontSize: 14,
    fontWeight: 500,
    color: "#cbd5e1",
};

const counterContainer = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px",
    borderRadius: 12,
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    width: "120px",
};

const counterBtn = {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "none",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#f8fafc",
    fontSize: 18,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
};

const counterBtnDisabled = {
    ...counterBtn,
    opacity: 0.3,
    cursor: "not-allowed",
};

const counterValue = {
    fontSize: 15,
    fontWeight: 700,
    color: "#f8fafc",
    flex: 1,
    textAlign: "center",
};

const btnPrimary = {
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
    transition: "opacity 0.2s ease",
};

const btnDisabled = {
    ...btnPrimary,
    background: "rgba(255, 255, 255, 0.05)",
    color: "rgba(255, 255, 255, 0.3)",
    boxShadow: "none",
    cursor: "not-allowed",
};