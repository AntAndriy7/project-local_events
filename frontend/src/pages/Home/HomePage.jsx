import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import EventCard from "../../features/events/components/EventCard";
import EventFilters from "../../features/events/components/EventFilters";
import { useEvents } from "../../features/events/hooks/useEvents";
import ProtectedLink from "../../app/guards/ProtectedLink.jsx";

export default function HomePage() {
    const { events, categories, districts, loading, error, reload } = useEvents();

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

            if (filters.categoryId && e.category_id !== filters.categoryId) {
                return false;
            }

            if (filters.districtId && e.district_id !== filters.districtId) {
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
                        <div style={{ maxWidth: 680 }}>
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

                            {error && (
                                <div style={errorBox}>
                                    ❌ {error}
                                    <button onClick={reload} style={smallBtn} type="button">Спробувати ще</button>
                                </div>
                            )}
                        </div>

                        <div style={heroCard}>
                            <div style={miniTitle}>Сьогодні популярне</div>
                            <div style={miniList}>
                                <MiniItem title="Jazz Night" meta="18:30 • Центр" />
                                <MiniItem title="Виставка сучасного мистецтва" meta="14:00 • Галерея" />
                                <MiniItem title="React Workshop" meta="19:00 • Коворкінг" />
                            </div>
                            <div style={{ opacity: 0.7, fontSize: 12, marginTop: 10 }}>
                                (це поки заглушка — замінимо на реальні тренди)
                            </div>
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

function MiniItem({ title, meta }) {
    return (
        <div style={miniItem}>
            <div style={{ fontWeight: 700 }}>{title}</div>
            <div style={{ opacity: 0.72, fontSize: 13 }}>{meta}</div>
        </div>
    );
}

const hero = {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: 14,
    alignItems: "stretch",
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
    fontSize: 40,
    lineHeight: 1.1,
    fontWeight: 900
};

const lead = {
    margin: 0,
    opacity: 0.8,
    maxWidth: 620
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
    border: "1px solid rgba(124,58,237,.35)",
    background: "linear-gradient(135deg, rgba(124,58,237,.95), rgba(37,99,235,.85))",
    boxShadow: "0 12px 35px rgba(37,99,235,.16)",
    color: "white",
    fontWeight: 800,
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
    background: "rgba(255,255,255,.06)",
};

const grid = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 348px)",
    gap: 12,
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
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.16)",
    background: "radial-gradient(400px 220px at 20% 0%, rgba(124,58,237,.25), transparent 60%), rgba(255,255,255,.06)",
    minHeight: 240,
};

const miniTitle = {
    fontWeight: 900,
    marginBottom: 10,
    opacity: 0.92
};

const miniList = {
    display: "grid",
    gap: 10
};

const miniItem = {
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.14)",
    background: "rgba(2,6,23,.20)",
};

const errorBox = {
    marginTop: 14,
    padding: 10,
    borderRadius: 14,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.10)",
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
};

const smallBtn = {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    cursor: "pointer",
};
