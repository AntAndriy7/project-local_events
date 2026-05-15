import EventCard from "./EventCard";
import { useFavoriteEvents } from "../hooks/useFavoriteEvents";
import { StarIcon } from "../../../components/ui/Icons";

export default function FavoriteEventsList() {
    const { events, loading, error, toggleFavorite } = useFavoriteEvents();

    if (loading) {
        return <div style={msgStyle}>Завантаження збережених подій...</div>;
    }

    if (error) {
        return <div style={{ ...msgStyle, color: "#fca5a5" }}>{error}</div>;
    }

    if (events.length === 0) {
        return (
            <div style={emptyStateBox}>
                <div style={emptyIconWrapper}>
                    <StarIcon filled={true} width={48} height={48} />
                </div>
                <h3 style={emptyTitle}>У вас немає збережених подій</h3>
                <p style={emptyDesc}>
                    Додавайте цікаві події в обране, щоб мати до них швидкий доступ!
                </p>
            </div>
        );
    }

    return (
        <div style={grid}>
            {events.map((e) => (
                <EventCard
                    key={e.id}
                    event={e}
                    onToggleFavorite={toggleFavorite}
                />
            ))}
        </div>
    );
}

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
    paddingBottom: "40px"
};

const msgStyle = {
    opacity: 0.7,
    padding: "20px 0",
    fontSize: "15px",
    textAlign: "center"
};

const emptyStateBox = {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255, 255, 255, 0.01)",
    borderRadius: 20,
    border: "1px dashed rgba(255, 255, 255, 0.1)",
    marginTop: "20px"
};

const emptyIconWrapper = {
    color: "#fbbf24",
    marginBottom: "16px",
    opacity: 0.8,
    display: "flex",
    justifyContent: "center",
};

const emptyTitle = {
    margin: "0 0 10px",
    fontSize: 18,
    color: "#f8fafc"
};

const emptyDesc = {
    opacity: 0.5,
    margin: 0,
    fontSize: 14,
    color: "#f8fafc"
};
