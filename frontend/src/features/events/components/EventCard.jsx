import { Link } from "react-router-dom";
import { formatDateUA, formatTimeHHmm } from "../../../lib/dateTime";
import { DEFAULT_EVENT_IMAGE } from "../../../lib/constants.js";

export default function EventCard({ event, showStatus = false }) {
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

    return (
        <article style={card}>
            <Link to={`/events/${event.id}`} style={imageWrap}>
                <img
                    src={imageSrc}
                    alt={event.title}
                    style={image}
                    loading="lazy"
                />

                {soldOut && <div style={soldOutBadge}>Sold out</div>}
            </Link>

            <div style={content}>
                <div style={title}>{event.title}</div>

                {showStatus && event.status && (
                    <div style={{ ...badgeBase, ...(STATUS[event.status]?.style || {}) }}>
                        {STATUS[event.status]?.text || event.status}
                    </div>
                )}

                <div style={meta}>{formatDateUA(event.date)} • {formatTimeHHmm(event.time)}</div>
                <div style={meta}>{event.districtName ?? `#${event.districtId}`}</div>
                <div style={meta}>{event.categoryName ?? `#${event.categoryId}`}</div>

                <div style={meta}>
                    {occupied}/{capacity} <span style={{ opacity: 0.75 }}>(вільно: {left})</span>
                </div>

                <div style={actions}>
                    <Link to={`/events/${event.id}`} style={linkPrimary}>
                        Деталі
                    </Link>
                    <button style={btnGhost}>Квитки</button>
                </div>
            </div>
        </article>
    );
}

const linkPrimary = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(37,99,235,0.5)",
    background: "rgba(37,99,235,0.85)",
    color: "white",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
};

const btnGhost = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(2,6,23,0.2)",
    color: "white",
    cursor: "pointer",
};

const badgeBase = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 10,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    opacity: 0.95,
};

const badgePending = {
    border: "1px solid rgba(251,146,60,.35)",
    background: "rgba(251,146,60,.12)",
};

const badgeApproved = {
    border: "1px solid rgba(34,197,94,.35)",
    background: "rgba(34,197,94,.12)",
};

const badgeRejected = {
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.12)",
};

const card = {
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(15,23,42,.6)",
    display: "flex",
    flexDirection: "column",
};

const imageWrap = {
    position: "relative",
    display: "block",
    aspectRatio: "16 / 9",
    overflow: "hidden",
};

const image = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform .35s ease",
};

const soldOutBadge = {
    position: "absolute",
    top: 10,
    right: 10,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(239,68,68,.9)",
    fontSize: 12,
    fontWeight: 700,
};

const content = {
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
};

const title = {
    fontWeight: 800,
    fontSize: 16,
    lineHeight: 1.25,
};

const meta = {
    fontSize: 13,
    opacity: 0.85,
};

const actions = {
    display: "flex",
    gap: 10,
    marginTop: 10,
};
