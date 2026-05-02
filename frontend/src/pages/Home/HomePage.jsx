import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import EventCard from "../../features/events/components/EventCard";
import EventFilters from "../../features/events/components/EventFilters";
import { useEvents } from "../../features/events/hooks/useEvents";
import { usePopularEvent } from "../../features/events/hooks/usePopularEvent";
import ProtectedLink from "../../app/guards/ProtectedLink.jsx";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants.js";

export default function HomePage() {
    const { events, categories, districts, loading, reload } = useEvents();
    const { popularData, loadingPopular } = usePopularEvent();

    const [filters, setFilters] = useState({
        q: "",
        categoryId: null,
        districtId: null,
        dateFrom: "",
        dateTo: "",
    });

    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            if (filters.q) {
                const q = filters.q.toLowerCase();
                if (!e.title?.toLowerCase().includes(q)) return false;
            }

            if (filters.categoryId && Number(e.category_id) !== Number(filters.categoryId)) {
                return false;
            }

            if (filters.districtId && Number(e.district_id) !== Number(filters.districtId)) {
                return false;
            }

            if (filters.dateFrom && e.date < filters.dateFrom) {
                return false;
            }

            if (filters.dateTo && e.date > filters.dateTo) {
                return false;
            }

            return true;
        });
    }, [events, filters]);

    return (
        <main>
            {/* HERO */}
            <section style={{ padding: "44px 0 18px" }}>
                <Container>
                    <div style={hero}>
                        <div style={heroLeft}>
                            <div style={kicker}>Події твого міста</div>

                            <h1 style={h1}>
                                Знаходь концерти, виставки та воркшопи — або створи свою подію!
                            </h1>

                            <p style={lead}>
                                Local Events — платформа для локальних активностей, на якій кожен зможе знайти щось для себе.
                            </p>

                            <div style={ctaRow}>
                                <a href="#events" style={primaryBtn}>Переглянути події</a>
                                <Link to="/create" style={ghostBtn}>Створити подію</Link>
                                <ProtectedLink to="/create" style={ghostBtn}>
                                    Створити подію
                                </ProtectedLink>
                            </div>
                        </div>

                        {/* --- БЛОК ПОПУЛЯРНОЇ ПОДІЇ --- */}
                        <div style={heroCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                                <div style={miniTitle}>🔥 Сьогодні в тренді</div>
                            </div>

                            {loadingPopular ? (
                                <div style={{ opacity: 0.5, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    Шукаємо найцікавіше...
                                </div>
                            ) : popularData ? (
                                <div style={popularContent}>
                                    <div style={popularImageWrapper}>
                                        <img
                                            src={popularData.event.imageUrl || DEFAULT_EVENT_IMAGE}
                                            alt={popularData.event.title}
                                            style={popularImage}
                                        />
                                        <div style={popularCategoryBadge}>
                                            {popularData.category?.name || "Подія"}
                                        </div>
                                    </div>

                                    <h3 style={popularEventTitle}>{popularData.event.title}</h3>

                                    <div style={popularEventMeta}>
                                        <span>📅 {new Date(popularData.event.date).toLocaleDateString('uk-UA')}</span>
                                        <span>📍 {popularData.district?.name || "Локація не вказана"}</span>
                                    </div>

                                    <Link to={`/events/${popularData.event.id}`} style={popularLinkBtn}>
                                        Переглянути деталі →
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ opacity: 0.5, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1.5 }}>
                                    Поки немає активних подій.<br/>Створіть першу!
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            {/* FILTERS */}
            <section style={{ padding: "16px 0" }}>
                <Container>
                    <div style={panel}>
                        <div style={{ fontWeight: 800, marginBottom: 10 }}>Фільтри</div>
                        <EventFilters
                            value={filters}
                            onChange={setFilters}
                            categories={categories}
                            districts={districts}
                        />

                    </div>
                </Container>
            </section>

            {/* EVENTS */}
            <section id="events" style={{ padding: "18px 0 46px" }}>
                <Container>
                    <div style={sectionTop}>
                        <h2 style={h2}>Найближчі події</h2>
                        <button onClick={reload} style={ghostBtn} type="button">
                            Оновити
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ opacity: 0.8, padding: "10px 0" }}>Завантаження…</div>
                    ) : filteredEvents.length === 0 ? (
                        <div style={{ opacity: 0.8, padding: "10px 0" }}>
                            Нічого не знайдено.
                        </div>
                    ) : (
                        <div style={grid}>
                            {filteredEvents.map((e) => (
                                <EventCard key={e.id} event={e} />
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}

const hero = {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: 14,
    alignItems: "stretch",
};

const heroLeft = {
    maxWidth: 680,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20px",
    padding: "20px 0"
};

const kicker = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,.16)",
    background: "rgba(255,255,255,.06)",
    opacity: 0.9,
    fontSize: 13,
};

const h1 = {
    margin: "10px 0 10px",
    fontSize: "40px",
    lineHeight: 1.1,
    fontWeight: 900,
    background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
};

const lead = {
    margin: 0,
    opacity: 0.8,
    fontSize: 18, // Було стандартно 16
    lineHeight: 1.5,
    maxWidth: 580
};

const ctaRow = {
    marginTop: 16,
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
};

const primaryBtn = {
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 14,
    background: "linear-gradient(135deg, rgba(124,58,237,.95), rgba(37,99,235,.85))",
    boxShadow: "0 12px 35px rgba(37,99,235,.16)",
    color: "white",
    fontWeight: 800
};

const ghostBtn = {
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.92)",
    cursor: "pointer",
    fontWeight: 700,
};

const panel = {
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.16)",
    background: "rgba(255,255,255,.04)"
};

const grid = {
    marginTop: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
};

const sectionTop = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
};

const h2 = {
    margin: 0,
    fontSize: 20,
    fontWeight: 900
};

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

const popularCategoryBadge = {
    position: "absolute",
    top: 10,
    left: 10,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white"
};

const popularEventTitle = {
    margin: "0 0 10px 0",
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.2
};

const popularEventMeta = {
    display: "flex",
    gap: 15,
    opacity: 0.7,
    fontSize: 13,
    marginBottom: "auto"
};

const popularLinkBtn = {
    marginTop: 20,
    padding: "10px 0",
    textAlign: "center",
    textDecoration: "none",
    background: "rgba(124, 58, 237, 0.15)",
    color: "#c4b5fd",
    borderRadius: 12,
    fontWeight: 800,
    border: "1px solid rgba(124, 58, 237, 0.3)",
    transition: "0.2s"
};
