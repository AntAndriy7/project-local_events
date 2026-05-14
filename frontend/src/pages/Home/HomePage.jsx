import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import EventCard from "../../features/events/components/EventCard";
import PopularEventCard from "../../features/events/components/PopularEventCard";
import EventFilters from "../../features/events/components/EventFilters";
import { useEvents } from "../../features/events/hooks/useEvents";
import { usePopularEvent } from "../../features/events/hooks/usePopularEvent";
import ProtectedLink from "../../app/guards/ProtectedLink.jsx";

export default function HomePage() {
    const { events, categories, districts, loading, reload, toggleFavorite } = useEvents();
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

            if (filters.categoryId && Number(e.categoryId) !== Number(filters.categoryId)) {
                return false;
            }

            if (filters.districtId && Number(e.districtId) !== Number(filters.districtId)) {
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
                                Local Events — платформа для локальних активностей, на якій кожен зможе знайти щось для себе.
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
                        <PopularEventCard
                            popularData={popularData}
                            loadingPopular={loadingPopular}
                        />
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
                        <div style={{ opacity: 0.8, padding: "10px 0" }}>Нічого не знайдено.</div>
                    ) : (
                        <div style={grid}>
                            {filteredEvents.map((e) => (
                                <EventCard
                                    key={e.id}
                                    event={e}
                                    onToggleFavorite={toggleFavorite}
                                />
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
