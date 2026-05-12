import { Link, useParams } from "react-router-dom";
import Container from "../../components/layout/Container";
import { formatDateUA, formatTimeHHmm } from "../../lib/dateTime";
import TicketReservationForm from "../../features/tickets/components/TicketReservationForm";
import TicketHoldersList from "../../features/tickets/components/TicketHoldersList";
import { useEventDetails } from "../../features/events/hooks/useEventDetails";
import QuestionsSection from "../../features/reviews/components/QuestionsSection";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants.js";
import { getUser } from "../../features/auth/authStorage";

const STATUS_LABEL = {
    PENDING: "На модерації",
    APPROVED: "Схвалено",
    REJECTED: "Відхилено",
};

export default function EventDetailsPage() {
    const { id } = useParams();
    const eventId = Number(id);
    const { event, reviews, loading, error, reload, stats } = useEventDetails(eventId);
    console.log("EVENT FROM API:", event);

    const user = getUser();
    const isOwner = user && event && user.id === event.userId;

    return (
        <main style={mainStyle}>
            <Container>
                {loading && <div style={loadingStyle}>⏳ Завантаження…</div>}
                {error && <div style={errorStyle}>❌ {error}</div>}

                {!loading && !error && !event && (
                    <div style={notFoundStyle}>
                        <div style={notFoundIcon}>🔍</div>
                        <div>Подію не знайдено</div>
                    </div>
                )}

                {event && (
                    <>
                        {/* Hero секція з фото */}
                        <div style={heroSection}>
                            <div style={imageContainer}>
                                <img
                                    src={event.imageUrl || DEFAULT_EVENT_IMAGE}
                                    alt={event.title}
                                    style={heroImage}
                                />
                                {stats.soldOut && (
                                    <div style={soldOutBadge}>
                                        Немає вільних місць
                                    </div>
                                )}
                                {isOwner && event.status && (
                                    <div style={{
                                        ...statusBadge,
                                        ...(STATUS_STYLE[event.status] || {})
                                    }}>
                                        {STATUS_LABEL[event.status] || event.status}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Основний контент */}
                        <div style={contentGrid}>
                            {/* Ліва колонка - інформація */}
                            <div style={leftColumn}>
                                <h1 style={titleStyle}>{event.title}</h1>

                                {event.description && (
                                    <div style={descriptionBox}>
                                        <div style={sectionTitle}>📝 Опис</div>
                                        <div style={descriptionText}>{event.description}</div>
                                    </div>
                                )}

                                {/* Деталі події */}
                                <div style={detailsCard}>
                                    <div style={sectionTitle}>ℹ️ Деталі події</div>

                                    <div style={detailsGrid}>
                                        <div style={detailItem}>
                                            <div style={detailLabel}>📅 Дата</div>
                                            <div style={detailValue}>{formatDateUA(event.date)}</div>
                                        </div>

                                        <div style={detailItem}>
                                            <div style={detailLabel}>⏰ Час</div>
                                            <div style={detailValue}>{formatTimeHHmm(event.time)}</div>
                                        </div>

                                        <div style={detailItem}>
                                            <div style={detailLabel}>🏷️ Категорія</div>
                                            <div style={detailValue}>
                                                {event.categoryName ?? `#${event.categoryId}`}
                                            </div>
                                        </div>

                                        <div style={detailItem}>
                                            <div style={detailLabel}>📍 Район</div>
                                            <div style={detailValue}>
                                                {event.districtName ?? `#${event.districtId}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Місткість */}
                                <div style={capacityCard}>
                                    <div style={sectionTitle}>👥 Доступність місць</div>

                                    <div style={capacityStats}>
                                        <div style={capacityStat}>
                                            <div style={capacityNumber}>{stats.capacity}</div>
                                            <div style={capacityLabel}>Всього місць</div>
                                        </div>

                                        <div style={capacityStat}>
                                            <div style={{...capacityNumber, color: "#f59e0b"}}>
                                                {stats.occupied}
                                            </div>
                                            <div style={capacityLabel}>Зайнято</div>
                                        </div>

                                        <div style={capacityStat}>
                                            <div style={{...capacityNumber, color: stats.left > 0 ? "#22c55e" : "#ef4444"}}>
                                                {stats.left}
                                            </div>
                                            <div style={capacityLabel}>Вільно</div>
                                        </div>
                                    </div>

                                    <div style={capacityProgress}>
                                        <div
                                            style={{
                                                ...capacityProgressBar,
                                                width: `${stats.capacity > 0 ? (stats.occupied / stats.capacity) * 100 : 0}%`
                                            }}
                                        />
                                    </div>

                                    <div style={capacityStatus}>
                                        {stats.soldOut ? (
                                            <span style={statusBadgeFull}>🔴 Немає вільних місць</span>
                                        ) : stats.left <= 5 ? (
                                            <span style={statusBadgeLow}>🟡 Залишилось мало місць</span>
                                        ) : (
                                            <span style={statusBadgeAvailable}>🟢 Є вільні місця</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Права колонка - квитки */}
                            <div style={rightColumn}>
                                <TicketReservationForm event={event} onAfterChange={reload} />
                            </div>
                        </div>

                        {/* Учасники події - на всю ширину */}
                        <TicketHoldersList eventId={event.id} refreshTrigger={stats.occupied}/>

                        {/* Відгуки - на всю ширину */}
                        <QuestionsSection
                            reviews={reviews}
                            eventId={event.id}
                            onChanged={reload}
                        />
                    </>
                )}
            </Container>
        </main>
    );
}

const STATUS_STYLE = {
    PENDING: {
        background: "rgba(251,146,60,0.15)",
        border: "1px solid rgba(251,146,60,0.3)",
        color: "#fdba74",
    },
    APPROVED: {
        background: "rgba(34,197,94,0.15)",
        border: "1px solid rgba(34,197,94,0.3)",
        color: "#86efac",
    },
    REJECTED: {
        background: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#fca5a5",
    },
};

const mainStyle = {
    padding: "24px 0 60px",
    minHeight: "100vh",
};

const loadingStyle = {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    opacity: 0.8,
};

const errorStyle = {
    marginTop: 20,
    padding: "16px 20px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
};

const notFoundStyle = {
    marginTop: 60,
    textAlign: "center",
    opacity: 0.7,
};

const notFoundIcon = {
    fontSize: 48,
    marginBottom: 12,
};

const heroSection = {
    marginBottom: 32,
};

const imageContainer = {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,.15)",
    aspectRatio: "21 / 9",
};

const heroImage = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
};

const soldOutBadge = {
    position: "absolute",
    top: 20,
    right: 20,
    padding: "10px 20px",
    borderRadius: 999,
    background: "rgba(239,68,68,0.95)",
    fontSize: 16,
    fontWeight: 700,
    backdropFilter: "blur(10px)",
};

const statusBadge = {
    position: "absolute",
    top: 20,
    left: 20,
    padding: "10px 20px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    backdropFilter: "blur(10px)",
};

const contentGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: 32,
    alignItems: "start",
    marginBottom: 20,
};

const leftColumn = {
    display: "grid",
    gap: 24,
};

const rightColumn = {
    position: "sticky",
    top: 100,
};

const titleStyle = {
    margin: 0,
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1.2,
};

const descriptionBox = {
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.15)",
    background: "rgba(15,23,42,.4)",
};

const descriptionText = {
    opacity: 0.85,
    lineHeight: 1.6,
};

const detailsCard = {
    padding: 24,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.15)",
    background: "rgba(15,23,42,.4)",
};

const sectionTitle = {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 16,
    opacity: 0.95,
};

const detailsGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
};

const detailItem = {
    display: "grid",
    gap: 6,
};

const detailLabel = {
    fontSize: 13,
    opacity: 0.7,
};

const detailValue = {
    fontSize: 15,
    fontWeight: 600,
};

const capacityCard = {
    padding: 24,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.15)",
    background: "rgba(15,23,42,.4)",
};

const capacityStats = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 20,
};

const capacityStat = {
    textAlign: "center",
};

const capacityNumber = {
    fontSize: 32,
    fontWeight: 900,
    color: "#3b82f6",
    lineHeight: 1,
    marginBottom: 8,
};

const capacityLabel = {
    fontSize: 13,
    opacity: 0.7,
};

const capacityProgress = {
    height: 12,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 16,
    border: "1px solid rgba(148,163,184,.1)",
};

const capacityProgressBar = {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
    transition: "width 0.3s ease",
    borderRadius: 999,
};

const capacityStatus = {
    textAlign: "center",
};

const statusBadgeAvailable = {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#86efac",
};

const statusBadgeLow = {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    background: "rgba(251,146,60,0.15)",
    border: "1px solid rgba(251,146,60,0.3)",
    color: "#fdba74",
};

const statusBadgeFull = {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
};
