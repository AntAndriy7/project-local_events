import { formatDateUA, formatTimeHHmm } from "../../../lib/dateTime";
import { DEFAULT_EVENT_IMAGE } from "../../../lib/constants.js";

export default function EventCardPreview({ event }) {
    const capacity = event.capacity ?? 0;
    const occupied = event.occupiedSeats ?? 0;
    const left = Math.max(0, capacity - occupied);
    const soldOut = capacity > 0 && occupied >= capacity;

    const imageSrc = event.imageUrl?.trim() ? event.imageUrl : DEFAULT_EVENT_IMAGE;

    return (
        <article style={card}>
            <div style={imageWrap}>
                <img
                    src={imageSrc}
                    alt={event.title}
                    style={image}
                />

                {soldOut && <div style={soldOutBadge}>Sold out</div>}
            </div>

            <div style={content}>
                <div style={title}>{event.title}</div>

                <div style={meta}>{formatDateUA(event.date)} • {formatTimeHHmm(event.time)}</div>
                <div style={meta}>{event.districtName ?? `#${event.districtId}`}</div>
                <div style={meta}>{event.categoryName ?? `#${event.categoryId}`}</div>

                <div style={meta}>
                    {occupied}/{capacity} <span style={{ opacity: 0.75 }}>(вільно: {left})</span>
                </div>

                <div style={actions}>
                    <div style={linkPrimary}>
                        Деталі
                    </div>
                    <div style={btnGhost}>Квитки</div>
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
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
    opacity: 0.7,
    pointerEvents: "none",
};

const btnGhost = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(2,6,23,0.2)",
    color: "white",
    opacity: 0.7,
    pointerEvents: "none",
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
