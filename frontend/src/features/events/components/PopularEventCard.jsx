import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UsersIcon } from "../../../components/ui/Icons";
import { DEFAULT_EVENT_IMAGE } from "../../../lib/constants";

export default function PopularEventCard({ popularData, loadingPopular }) {
    return (
        <div style={heroCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                <div style={miniTitle}>🔥 Сьогодні в тренді</div>
            </div>

            {loadingPopular ? (
                <div style={placeholderStyle}>Шукаємо найцікавіше...</div>
            ) : popularData && popularData.event ? (
                <div style={popularContent}>
                    <div style={popularImageWrapper}>
                        <img
                            src={popularData.event.imageUrl || DEFAULT_EVENT_IMAGE}
                            alt={popularData.event.title}
                            style={popularImage}
                        />
                        <div style={categoryBadge}>
                            {popularData.category?.name || "Подія"}
                        </div>

                        {(popularData.event.capacity > 0 && popularData.event.occupiedSeats >= popularData.event.capacity) && (
                            <div style={soldOutBadge}>Sold out</div>
                        )}
                    </div>

                    <h3 style={popularEventTitle}>{popularData.event.title}</h3>

                    <div style={metaGroup}>
                        <div style={metaRow}>
                            <span style={iconWrap}><CalendarIcon /></span>
                            <span>{new Date(popularData.event.date).toLocaleDateString('uk-UA')}</span>
                        </div>
                        <div style={metaRow}>
                            <span style={iconWrap}><MapPinIcon /></span>
                            <span>{popularData.district?.name || "Локація не вказана"}</span>
                        </div>
                    </div>

                    <div style={capacityBlock}>
                        <div style={capacityHeader}>
                            <div style={metaRow}>
                                <span style={iconWrap}><UsersIcon /></span>
                                <span>{popularData.event.occupiedSeats ?? 0} / {popularData.event.capacity ?? 0} місць</span>
                            </div>
                            <span style={capacityLeftText}>
                                {Math.max(0, (popularData.event.capacity ?? 0) - (popularData.event.occupiedSeats ?? 0))} вільних
                            </span>
                        </div>
                        <div style={progressBarBg}>
                            <div
                                style={{
                                    ...progressBarFill,
                                    width: `${popularData.event.capacity > 0 ? Math.min(((popularData.event.occupiedSeats ?? 0) / popularData.event.capacity) * 100, 100) : 0}%`,
                                    backgroundColor: (popularData.event.capacity > 0 && popularData.event.occupiedSeats >= popularData.event.capacity) ? "#ef4444" : "#3b82f6"
                                }}
                            />
                        </div>
                    </div>

                    <Link to={`/events/${popularData.event.id}`} style={popularLinkBtn}>
                        Переглянути деталі
                    </Link>
                </div>
            ) : (
                <div style={{...placeholderStyle, textAlign: "center", lineHeight: 1.5}}>
                    Поки немає активних подій.<br/>Створіть першу!
                </div>
            )}
        </div>
    );
}

const heroCard = {
    padding: "20px",
    borderRadius: 20,
    border: "1px solid rgba(148,163,184,.16)",
    background: "radial-gradient(400px 220px at 20% 0%, rgba(124,58,237,.15), transparent 60%), rgba(255,255,255,.03)",
    backdropFilter: "blur(10px)",
    minHeight: 400,
    display: "flex",
    flexDirection: "column"
};

const miniTitle = {
    fontWeight: 900,
    fontSize: 18,
    color: "#a78bfa",
    textTransform: "uppercase",
    letterSpacing: 1
};

const placeholderStyle = {
    opacity: 0.5,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const popularContent = {
    display: "flex",
    flexDirection: "column",
    flex: 1
};

const popularImageWrapper = {
    width: "100%",
    height: "180px",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginBottom: 15,
    border: "1px solid rgba(255,255,255,0.05)"
};

const popularImage = {
    width: "100%",
    height: "100%",
    objectFit: "cover"
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
    border: "1px solid rgba(255,255,255,0.1)"
};

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
    backdropFilter: "blur(4px)"
};

const popularEventTitle = {
    margin: "0 0 10px 0",
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.2
};

const metaGroup = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16
};

const metaRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 500
};

const iconWrap = {
    display: "flex",
    alignItems: "center",
    color: "#a78bfa"
};

const capacityBlock = {
    marginTop: "auto",
    padding: "12px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: 16
};

const capacityHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
};

const capacityLeftText = {
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1"
};

const progressBarBg = {
    height: 6,
    width: "100%",
    background: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden"
};

const progressBarFill = {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.3s ease"
};

const popularLinkBtn = {
    padding: "12px",
    borderRadius: 12,
    background: "rgba(124, 58, 237, 0.15)",
    color: "#c4b5fd",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    transition: "background 0.2s ease"
};
