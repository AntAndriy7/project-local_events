import { Link } from "react-router-dom";
import { formatDateUA, formatTimeHHmm } from "../../../lib/dateTime";
import { DEFAULT_EVENT_IMAGE } from "../../../lib/constants.js";
import { StarIcon, CalendarIcon, MapPinIcon, UsersIcon } from "../../../components/ui/Icons";

export default function EventCard({ event, showStatus = false, onToggleFavorite }) {
    const capacity = event.capacity ?? 0;
    const occupied = event.occupiedSeats ?? 0;
    const left = Math.max(0, capacity - occupied);
    const soldOut = capacity > 0 && occupied >= capacity;

    const imageSrc = event.imageUrl || DEFAULT_EVENT_IMAGE;

    const STATUS = {
        PENDING: { text: "На модерації", style: badgePending },
        APPROVED: { text: "Схвалено", style: badgeApproved },
        REJECTED: { text: "Відхилено", style: badgeRejected },
    };

    const fillPercentage = capacity > 0 ? Math.min((occupied / capacity) * 100, 100) : 0;

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(event.id, event.favorite);
        }
    };

    return (
        <article style={card}>
            <Link to={`/events/${event.id}`} style={imageWrap}>
                <img src={imageSrc} alt={event.title} style={image} loading="lazy" />

                {event.categoryName && (
                    <div style={categoryBadge}>{event.categoryName}</div>
                )}

                <button
                    style={floatingFavoriteBtn(event.favorite)}
                    onClick={handleFavoriteClick}
                    title={event.favorite ? "Видалити з обраного" : "Додати в обране"}
                >
                    <StarIcon filled={event.favorite} />
                </button>

                {soldOut && <div style={soldOutBadge}>Sold out</div>}
            </Link>

            <div style={content}>
                {showStatus && event.status && (
                    <div style={{ ...badgeBase, ...(STATUS[event.status]?.style || {}) }}>
                        {STATUS[event.status]?.text || event.status}
                    </div>
                )}

                <h3 style={title} title={event.title}>{event.title}</h3>

                <div style={metaGroup}>
                    <div style={metaRow}>
                        <span style={iconWrap}><CalendarIcon /></span>
                        <span>{formatDateUA(event.date)}, {formatTimeHHmm(event.time)}</span>
                    </div>

                    <div style={metaRow}>
                        <span style={iconWrap}><MapPinIcon /></span>
                        <span>{event.districtName ?? "Локація уточнюється"}</span>
                    </div>
                </div>

                <div style={capacityBlock}>
                    <div style={capacityHeader}>
                        <div style={metaRow}>
                            <span style={iconWrap}><UsersIcon /></span>
                            <span>{occupied} / {capacity} місць</span>
                        </div>
                        <span style={capacityLeftText}>
                            {soldOut ? "Місць немає" : `Ще ${left} вільних`}
                        </span>
                    </div>
                    <div style={progressBarBg}>
                        <div style={{...progressBarFill, width: `${fillPercentage}%`, backgroundColor: soldOut ? "#ef4444" : "#3b82f6"}} />
                    </div>
                </div>

                <div style={actions}>
                    <Link to={`/events/${event.id}`} style={linkPrimary}>
                        Переглянути деталі
                    </Link>
                </div>
            </div>
        </article>
    );
}

const linkPrimary = {
    padding: "12px",
    borderRadius: 12,
    background: "rgba(37,99,235,0.15)",
    color: "#60a5fa",
    border: "1px solid rgba(37,99,235,0.3)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    transition: "background 0.2s ease",
};

const badgeBase = {
    alignSelf: "flex-start",
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 12,
};

const badgePending = { border: "1px solid rgba(251,146,60,.3)", background: "rgba(251,146,60,.1)", color: "#fbbf24" };
const badgeApproved = { border: "1px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.1)", color: "#4ade80" };
const badgeRejected = { border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.1)", color: "#f87171" };

const card = {
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,.15)",
    background: "rgba(15,23,42,.7)",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const imageWrap = {
    position: "relative",
    display: "block",
    aspectRatio: "16 / 10",
    overflow: "hidden",
};

const image = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
};

const categoryBadge = {
    position: "absolute",
    top: 12,
    left: 12,
    background: "rgba(15,23,42,0.65)",
    backdropFilter: "blur(6px)",
    color: "#e2e8f0",
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    border: "1px solid rgba(255,255,255,0.1)",
};

const floatingFavoriteBtn = (isFavorite) => ({
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
    background: isFavorite ? "rgba(15,23,42,0.8)" : "rgba(15,23,42,0.4)",
    backdropFilter: "blur(8px)",
    color: isFavorite ? "#fbbf24" : "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 10,
});

const soldOutBadge = {
    position: "absolute",
    bottom: 12,
    right: 12,
    padding: "4px 10px",
    borderRadius: 8,
    background: "rgba(239,68,68,.95)",
    fontSize: 12,
    fontWeight: 700,
    color: "white",
    backdropFilter: "blur(4px)",
};

const content = {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    flex: 1,
};

const title = {
    margin: "0 0 12px 0",
    fontWeight: 800,
    fontSize: 18,
    lineHeight: 1.3,
    color: "#f8fafc",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
};

const metaGroup = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
};

const metaRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 500,
};

const iconWrap = {
    display: "flex",
    alignItems: "center",
    color: "#64748b",
};

const capacityBlock = {
    marginTop: "auto",
    padding: "12px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: 16,
};

const capacityHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
};

const capacityLeftText = {
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
};

const progressBarBg = {
    height: 6,
    width: "100%",
    background: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
};

const progressBarFill = {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.3s ease",
};

const actions = {
    display: "flex",
};
