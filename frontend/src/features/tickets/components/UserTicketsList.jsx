import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTickets } from "../hooks/useUserTickets";
import {DEFAULT_EVENT_IMAGE} from "../../../lib/constants.js"; // Перевірити використання

export default function UserTicketsList({ filterType = "active" }) {
    const nav = useNavigate();
    const { tickets, loading, error, reload, handleCancelTicket } = useUserTickets();
    const [processingId, setProcessingId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 4;

    const [prevFilter, setPrevFilter] = useState(filterType);

    if (filterType !== prevFilter) {
        setPrevFilter(filterType);
        setCurrentPage(1);
    }

    if (loading) return <div style={centerMsg}>⏳ Завантаження квитків...</div>;

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
            <div style={{ fontSize: 40, marginBottom: 15 }}>{filterType === "history" ? "🕰️" : "🎫"}</div>
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

    const onCancel = async (ticketId) => {
        if (!window.confirm("Ви впевнені, що хочете скасувати це бронювання?")) return;

        setProcessingId(ticketId);
        const res = await handleCancelTicket(ticketId);
        setProcessingId(null);

        if (!res.success) alert(res.error);
    };

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div style={wrapperStyle}>
            {/* Список квитків */}
            <div style={ticketsGrid}>
                {currentTickets.map(item => {
                    const { id, event, category, district, quantity, status } = item;

                    const isReserved = status === "RESERVED";
                    const isCanceling = processingId === id;

                    let statusColor = "#a78bfa";
                    let statusLabel = status;

                    if (status === "RESERVED") {
                        statusColor = "#10b981";
                        statusLabel = "АКТИВНИЙ";
                    } else if (status === "CANCELED") {
                        statusColor = "#ef4444";
                        statusLabel = "СКАСОВАНО";
                    } else if (status === "EXPIRED") {
                        statusColor = "#94a3b8";
                        statusLabel = "МИНУЛО";
                    }

                    const eventDate = event.date ? new Date(event.date).toLocaleDateString('uk-UA') : "Дата невідома";
                    const imageSrc = event.imageUrl || DEFAULT_EVENT_IMAGE;

                    return (
                        <div key={id} style={{...ticketCardStyle, opacity: isReserved ? 1 : 0.6 }}>
                            {/* Картинка */}
                            <div style={ticketImageSlot}>
                                <img src={imageSrc} alt="event" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>

                            {/* Основна інформація */}
                            <div style={ticketInfo}>
                                <div style={ticketHeader}>
                                    <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                                        {category?.name || "Подія"}
                                    </span>
                                </div>

                                <h4 style={{ margin: "6px 0", fontSize: 18 }}>{event?.title || "Невідома подія"}</h4>

                                {/* Нижня частина центрального блоку: Дата/Локація зліва, Кнопки справа */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>

                                    {/* Інформація про час та місце */}
                                    <div style={ticketMeta}>
                                        <span>📍 {district?.name || "Локація не вказана"}</span>
                                        <span>📅 {eventDate}</span>
                                    </div>

                                    {/* Блок кнопок (завжди однакової висоти, щоб не стрибав UI) */}
                                    <div style={{ minHeight: 28, display: "flex", gap: 10, alignItems: "center" }}>

                                        <button
                                            onClick={() => nav(`/events/${event.id}`)}
                                            style={detailsBtn}
                                        >
                                            Деталі
                                        </button>

                                        {isReserved && (
                                            <button
                                                onClick={() => onCancel(id)}
                                                disabled={isCanceling}
                                                style={isCanceling ? cancelBtnDisabled : cancelBtn}
                                            >
                                                {isCanceling ? "Скасування..." : "Скасувати"}
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* Права колонка (Статус та кількість) */}
                            <div style={ticketAction}>
                                <div style={{ marginBottom: 15 }}>
                                    <span style={{
                                        display: "inline-block",
                                        padding: "4px 10px",
                                        background: `${statusColor}15`,
                                        color: statusColor,
                                        borderRadius: 8,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        textAlign: "center"
                                    }}>
                                        {statusLabel}
                                    </span>
                                </div>

                                <div style={{ textAlign: "center", minWidth: "90px" }}>
                                    <div style={{ fontSize: 12, opacity: 0.5 }}>Кількість</div>
                                    <div style={{ fontSize: 24, fontWeight: 900 }}>{quantity}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* КОНТРОЛИ ПАГІНАЦІЇ */}
            {totalPages > 1 && (
                <div style={paginationWrapper}>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        style={currentPage === 1 ? pageBtnDisabled : pageBtn}
                    >
                        ← Попередня
                    </button>

                    <span style={pageInfo}>
                        Сторінка <span style={{ color: "white", fontWeight: 800 }}>{currentPage}</span> з {totalPages}
                    </span>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        style={currentPage === totalPages ? pageBtnDisabled : pageBtn}
                    >
                        Наступна →
                    </button>
                </div>
            )}
        </div>
    );
}

const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "570px",
    height: "100%"
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
    border: "1px dashed rgba(255, 255, 255, 0.1)"
};

const ticketsGrid = {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    flex: 1
};

const ticketCardStyle = {
    display: "flex",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(148, 163, 184, 0.08)",
    borderRadius: 20,
    paddingRight: 15,
    gap: 20,
    alignItems: "center",
    transition: "0.2s",
    minHeight: 120
};

const ticketImageSlot = {
    width: 118,
    height: 118,
    borderRadius: 14,
    background: "rgba(124, 58, 237, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0
};

const ticketInfo = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
};

const ticketHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const ticketMeta = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    opacity: 0.6,
    fontWeight: 500,
    marginTop: 4
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

const cancelBtn = {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s"
};

const cancelBtnDisabled = {
    ...cancelBtn,
    opacity: 0.5,
    cursor: "not-allowed"
};

const paginationWrapper = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: "12px",
};

const pageBtn = {
    background: "rgba(124, 58, 237, 0.1)",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    color: "#a78bfa",
    padding: "8px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    transition: "0.2s"
};

const pageBtnDisabled = {
    ...pageBtn,
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    color: "rgba(255, 255, 255, 0.3)",
    cursor: "not-allowed"
};

const pageInfo = {
    fontSize: 14,
    opacity: 0.6
};

const detailsBtn = {
    background: "rgba(124, 58, 237, 0.1)",
    color: "#a78bfa",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s"
};