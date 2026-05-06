import { useEventTickets } from "../hooks/useEventTickets";

export default function TicketHoldersList({ eventId, refreshTrigger }) {
    const { tickets, userById, loading, error} = useEventTickets(eventId, refreshTrigger);

    if (loading) {
        return (
            <section style={panel}>
                <h3 style={titleStyle}>Учасники події</h3>
                <div style={loadingText}>⏳ Завантаження...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section style={panel}>
                <h3 style={titleStyle}>Учасники події</h3>
                <div style={errorBox}>Помилка: {error}</div>
            </section>
        );
    }

    if (tickets.length === 0) {
        return (
            <section style={emptyPanel}>
                <div style={panelTop}>
                    <h3 style={titleStyle}>Учасники події</h3>
                </div>
                <div style={emptyState}>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>🎫</div>
                    <div style={emptyText}>Поки що немає бронювань</div>
                    <div style={emptyHint}>Стань першим учасником цієї події!</div>
                </div>
            </section>
        );
    }

    const activeTickets = tickets.filter(t => t.status === "RESERVED");
    const totalActive = activeTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);

    return (
        <section style={panel}>
            <div style={panelTop}>
                <h3 style={titleStyle}>
                    Учасники <span style={counterBadge}>{activeTickets.length}</span>
                </h3>
                <div style={subtitleStyle}>
                    Всього квитків: <span style={highlightText}>{totalActive}</span>
                </div>
            </div>

            <div style={ticketsList}>
                {tickets.map((ticket) => {
                    const user = userById.get(ticket.user_id);
                    const isActive = ticket.status === "RESERVED";

                    return (
                        <div key={ticket.id} style={isActive ? ticketCard : ticketCardInactive}>

                            <div style={ticketLeft}>
                                <div style={ticketAvatar}>
                                    {user?.user_name?.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                <div style={ticketInfo}>
                                    <div style={ticketName}>
                                        {user?.user_name || `Користувач #${ticket.user_id}`}
                                    </div>
                                    <div style={ticketRole}>
                                        Учасник події
                                    </div>
                                </div>
                            </div>

                            <div style={ticketAction}>
                                <div style={quantityBlock}>
                                    <div style={quantityLabel}>Кількість</div>
                                    <div style={quantityValue}>{ticket.quantity}</div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </section>
    );
}

const panel = {
    marginTop: 24,
    padding: 32,
    borderRadius: 24,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(15, 23, 42, 0.4)",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
    display: "grid",
    gap: 24,
};

const emptyPanel = {
    ...panel,
    gap: 12,
};

const panelTop = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
};

const titleStyle = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#f8fafc",
};

const counterBadge = {
    background: "rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 700,
};

const subtitleStyle = {
    fontSize: 14,
    color: "#94a3b8",
};

const highlightText = {
    color: "#e2e8f0",
    fontWeight: 600,
};

const loadingText = {
    color: "#94a3b8",
    textAlign: "center",
    padding: "32px 0",
};

const errorBox = {
    padding: 16,
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
    fontSize: 14,
};

const emptyState = {
    textAlign: "center",
    padding: "16px 0 8px",
    color: "#94a3b8",
};

const emptyText = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: "#e2e8f0",
};

const emptyHint = {
    fontSize: 14,
    color: "#94a3b8",
};

const ticketsList = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: 16,
};

const ticketCard = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.06)",
    background: "rgba(30, 41, 59, 0.3)",
};

const ticketCardInactive = {
    ...ticketCard,
    opacity: 0.5,
};

const ticketLeft = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flex: 1,
    minWidth: 0,
};

const ticketAvatar = {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#e2e8f0",
    flexShrink: 0,
};

const ticketInfo = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
};

const ticketName = {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 4,
    color: "#f8fafc",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};

const ticketRole = {
    fontSize: 13,
    color: "#64748b",
};

const ticketAction = {
    paddingLeft: 20,
    marginLeft: 16,
    borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
    flexShrink: 0,
};

const quantityBlock = {
    textAlign: "center",
};

const quantityLabel = {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    color: "rgba(248,250,252,0.5)"
};

const quantityValue = {
    fontSize: 24,
    fontWeight: 900,
    color: "rgba(248,250,252,0.9)",
    lineHeight: 1,
};