import { useEventTickets } from "../hooks/useEventTickets";

export default function TicketHoldersList({ eventId, refreshTrigger }) {
    const { tickets, userById, loading, error} = useEventTickets(eventId, refreshTrigger);

    if (loading) {
        return (
            <section style={card}>
                <h3 style={titleStyle}>👥 Учасники події</h3>
                <div style={loadingText}>⏳ Завантаження...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section style={card}>
                <h3 style={titleStyle}>👥 Учасники події</h3>
                <div style={errorText}>❌ {error}</div>
            </section>
        );
    }

    if (tickets.length === 0) {
        return (
            <section style={card}>
                <div style={headerRow}>
                    <h3 style={titleStyle}>👥 Учасники події</h3>
                </div>
                <div style={emptyState}>
                    <div style={emptyIcon}>🎫</div>
                    <div style={emptyText}>Поки що немає бронювань</div>
                    <div style={emptyHint}>Стань першим учасником цієї події!</div>
                </div>
            </section>
        );
    }

    const activeTickets = tickets.filter(t => t.status === "RESERVED");
    const totalActive = activeTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);

    return (
        <section style={card}>
            <div style={headerRow}>
                <div>
                    <h3 style={titleStyle}>👥 Учасники події</h3>
                    <div style={subtitleStyle}>
                        {activeTickets.length} {activeTickets.length === 1 ? "учасник" : "учасників"} • {totalActive} {totalActive === 1 ? "квиток" : "квитків"}
                    </div>
                </div>
            </div>

            <div style={ticketsList}>
                {tickets.map((ticket) => {
                    const user = userById.get(ticket.user_id);
                    const isActive = ticket.status === "RESERVED";

                    return (
                        <div key={ticket.id} style={isActive ? ticketCard : ticketCardInactive}>
                            <div style={ticketAvatar}>
                                {user?.user_name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div style={ticketInfo}>
                                <div style={ticketName}>
                                    {user?.user_name || `User #${ticket.user_id}`}
                                </div>
                                <div style={ticketMeta}>
                                    <span style={ticketQuantity}>
                                        🎫 {ticket.quantity} {ticket.quantity === 1 ? "квиток" : "квитків"}
                                    </span>
                                    <span style={ticketDivider}>•</span>
                                    <span style={isActive ? ticketStatusActive : ticketStatusCanceled}>
                                        {ticket.status === "RESERVED" ? "Активний" : "Скасовано"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

const card = {
    padding: 24,
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.15)",
    background: "rgba(15, 23, 42, 0.4)",
    display: "grid",
    gap: 20,
};

const headerRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
};

const titleStyle = {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
};

const subtitleStyle = {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.7,
};

const loadingText = {
    opacity: 0.8,
    textAlign: "center",
    padding: 20,
};

const errorText = {
    color: "#fca5a5",
    textAlign: "center",
    padding: 20,
};

const emptyState = {
    textAlign: "center",
};

const emptyIcon = {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
};

const emptyText = {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 6,
    opacity: 0.8,
};

const emptyHint = {
    fontSize: 13,
    opacity: 0.6,
};

const ticketsList = {
    display: "grid",
    gap: 10,
};

const ticketCard = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(148, 163, 184, 0.15)",
    background: "rgba(2, 6, 23, 0.25)",
    transition: "all 0.2s ease",
};

const ticketCardInactive = {
    ...ticketCard,
    opacity: 0.5,
};

const ticketAvatar = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
};

const ticketInfo = {
    flex: 1,
    minWidth: 0,
};

const ticketName = {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};

const ticketMeta = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
};

const ticketQuantity = {
    opacity: 0.85,
};

const ticketDivider = {
    opacity: 0.4,
};

const ticketStatusActive = {
    color: "#86efac",
    fontWeight: 600,
};

const ticketStatusCanceled = {
    color: "#fca5a5",
    fontWeight: 600,
};
