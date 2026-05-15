import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTickets } from "../hooks/useUserTickets";
import { DEFAULT_EVENT_IMAGE } from "../../../lib/constants.js";
import { CalendarIcon, MapPinIcon, DotsMenuIcon, TicketIcon, HistoryIcon, WarningIcon } from "../../../components/ui/Icons";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function UserTicketsList({ filterType = "active" }) {
    const nav = useNavigate();
    const { tickets, loading, error, reload, handleCancelTicket } = useUserTickets();
    const [processingId, setProcessingId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [ticketToCancel, setTicketToCancel] = useState(null);

    if (loading) {
        return <div style={centerMsg}>Завантаження квитків...</div>;
    }

    if (error) return (
        <div style={centerMsg}>
            <p style={{ color: "#ef4444" }}>❌ {error}</p>
            <button onClick={reload} style={retryBtn}>Спробувати ще раз</button>
        </div>
    );

    const filteredTickets = tickets.filter(t => {
        if (filterType === "active") {
            return t.status === "RESERVED" || t.status === "CANCELED";
        }
        if (filterType === "history") {
            return t.status === "EXPIRED";
        }
        return true;
    });

    if (filteredTickets.length === 0) return (
        <div style={emptyStateBox}>
            <div style={emptyIconWrapper}>
                {filterType === "history" ? <HistoryIcon size={48} /> : <TicketIcon size={48} />}
            </div>
            <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>
                {filterType === "history" ? "Ваша історія порожня" : "У вас ще немає квитків"}
            </h3>
            <p style={{ opacity: 0.5, margin: 0, fontSize: 14 }}>
                {filterType === "history"
                    ? "Тут з'являться події, які ви вже відвідали"
                    : "Знайдіть цікаву подію та забронюйте місце!"}
            </p>
        </div>
    );

    const confirmCancel = async () => {
        if (!ticketToCancel) return;

        const id = ticketToCancel;
        setTicketToCancel(null);
        setProcessingId(id);

        const res = await handleCancelTicket(id);
        setProcessingId(null);

        if (!res.success) alert(res.error);
    };

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <div style={wrapperStyle}>
            {openMenuId && (
                <div style={overlayStyle} onClick={() => setOpenMenuId(null)} />
            )}

            <div style={ticketsGrid}>
                {filteredTickets.map(item => {
                    const { id, event, category, district, quantity, status } = item;

                    const isReserved = status === "RESERVED";
                    const isCanceling = processingId === id;

                    let statusColor = "#fbbf24";
                    let statusLabel = status;
                    let badgeBorder = "rgba(251,146,60,.3)";
                    let badgeBg = "rgba(251,146,60,.1)";

                    if (status === "RESERVED") {
                        statusColor = "#4ade80";
                        statusLabel = "АКТИВНИЙ";
                        badgeBorder = "rgba(34,197,94,.3)";
                        badgeBg = "rgba(34,197,94,.1)";
                    } else if (status === "CANCELED") {
                        statusColor = "#f87171";
                        statusLabel = "СКАСОВАНО";
                        badgeBorder = "rgba(239,68,68,.3)";
                        badgeBg = "rgba(239,68,68,.1)";
                    } else if (status === "EXPIRED") {
                        statusColor = "#94a3b8";
                        statusLabel = "МИНУЛО";
                        badgeBorder = "rgba(148,163,184,.3)";
                        badgeBg = "rgba(148,163,184,.1)";
                    }

                    const eventDate = event.date ? new Date(event.date).toLocaleDateString('uk-UA') : "Дата невідома";
                    const imageSrc = event.imageUrl || DEFAULT_EVENT_IMAGE;

                    return (
                        <div key={id} style={{...ticketCardStyle, opacity: isReserved ? 1 : 0.65 }}>
                            <div style={ticketImageSlot}>
                                <img src={imageSrc} alt={event?.title} style={imageStyle} />
                                {category?.name && (
                                    <div style={categoryBadgeStyle}>{category.name}</div>
                                )}
                            </div>

                            <div style={ticketInfo}>
                                <div style={ticketHeaderRow}>
                                    <h4 style={ticketTitleStyle}>{event?.title || "Невідома подія"}</h4>

                                    <div style={menuContainer}>
                                        <button style={dotsBtn} onClick={() => toggleMenu(id)}>
                                            <DotsMenuIcon />
                                        </button>

                                        {openMenuId === id && (
                                            <div style={dropdownStyle}>
                                                <button
                                                    style={dropdownItem}
                                                    onClick={() => {
                                                        nav(`/events/${event.id}`);
                                                        setOpenMenuId(null);
                                                    }}
                                                >
                                                    Переглянути деталі
                                                </button>

                                                {isReserved && (
                                                    <>
                                                        <div style={dropdownDivider} />
                                                        <button
                                                            style={dropdownItemDanger}
                                                            onClick={() => {
                                                                setTicketToCancel(id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            disabled={isCanceling}
                                                        >
                                                            {isCanceling ? "Скасування..." : "Скасувати квиток"}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={ticketMeta}>
                                    <div style={metaRow}>
                                        <span style={iconWrap}><MapPinIcon /></span>
                                        <span>{district?.name || "Локація не вказана"}</span>
                                    </div>
                                    <div style={metaRow}>
                                        <span style={iconWrap}><CalendarIcon /></span>
                                        <span>{eventDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={ticketAction}>
                                <div style={{ marginBottom: 12 }}>
                                    <span style={{
                                        display: "inline-block",
                                        padding: "4px 10px",
                                        border: `1px solid ${badgeBorder}`,
                                        background: badgeBg,
                                        color: statusColor,
                                        borderRadius: 8,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        textAlign: "center"
                                    }}>
                                        {statusLabel}
                                    </span>
                                </div>

                                <div style={{ textAlign: "center", minWidth: "90px" }}>
                                    <div style={{ fontSize: 12, color: "#94a3b8", opacity: 0.7 }}>Кількість</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: "#f8fafc" }}>{quantity}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ConfirmModal
                isOpen={!!ticketToCancel}
                title="Скасування квитка"
                text="Ви впевнені, що хочете скасувати це бронювання? Цю дію неможливо відмінити."
                confirmText="Так, скасувати"
                cancelText="Ні, залишити"
                icon={<WarningIcon size={48} />}
                onConfirm={confirmCancel}
                onCancel={() => setTicketToCancel(null)}
            />
        </div>
    );
}

const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingBottom: "40px",
};

const centerMsg = {
    textAlign: "center",
    padding: "40px",
    opacity: 0.8
};

const retryBtn = {
    marginTop: 15,
    padding: "8px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer"
};

const emptyStateBox = {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255, 255, 255, 0.01)",
    borderRadius: 20,
    border: "1px dashed rgba(255, 255, 255, 0.1)",
    marginTop: "20px",
};

const ticketsGrid = {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    flex: 1
};

const ticketCardStyle = {
    display: "flex",
    background: "rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: 20,
    paddingRight: 20,
    gap: 20,
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    transition: "opacity 0.2s ease",
    minHeight: 120,
};

const ticketImageSlot = {
    position: "relative",
    width: 190,
    height: 120,
    background: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    borderRadius: "20px 0 0 20px"
};


const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover"
};

const ticketInfo = {
    flex: 1,
    display: "flex",
    flexDirection: "column",

};

const ticketMeta = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: "auto"
};


const metaRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 500
};

const ticketAction = {
    paddingLeft: 20,
    borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100
};

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 40,
    cursor: "default"
};

const ticketHeaderRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "8px"
};

const ticketTitleStyle = {
    margin: 0,
    fontWeight: 800,
    fontSize: 18,
    lineHeight: 1.3,
    color: "#f8fafc"
};


const menuContainer = {
    position: "relative",
    zIndex: 50
};

const dotsBtn = {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
    opacity: 0.7
};

const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: "rgba(15,23,42,0.95)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "6px",
    minWidth: "180px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
};

const dropdownItem = {
    background: "transparent",
    border: "none",
    color: "#f8fafc",
    padding: "10px 14px",
    textAlign: "left",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.2s ease"
};

const dropdownItemDanger = {
    ...dropdownItem,
    color: "#f87171",
};

const dropdownDivider = {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    margin: "2px 6px"
};

const categoryBadgeStyle = {
    position: "absolute",
    top: 10,
    left: 10,
    background: "rgba(15,23,42,0.65)",
    backdropFilter: "blur(6px)",
    color: "#e2e8f0",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    border: "1px solid rgba(255,255,255,0.1)",
    pointerEvents: "none"
};

const iconWrap = {
    display: "flex",
    alignItems: "center",
    color: "#64748b"
};

const emptyIconWrapper = {
    color: "#4f46e5",
    marginBottom: "16px",
    opacity: 0.8,
    display: "flex",
    justifyContent: "center",
};