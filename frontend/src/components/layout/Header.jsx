import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";
import { clearAuth, getToken, getUser } from "../../features/auth/authStorage";
import EventSearch from "../../features/events/components/EventSearch.jsx";

export default function Header({ onOpenLogin, onOpenRegister }) {
    const nav = useNavigate();
    const token = getToken();
    const user = getUser();
    const isAdmin = user?.role === "ADMIN";

    function logout() {
        clearAuth();
        nav("/");
    }

    return (
        <header style={styles.header}>
            <Container>
                <div style={styles.row}>
                    <Link to="/" style={styles.brand}>
                        <span style={styles.brandDot} />
                        Local Events
                    </Link>

                    <EventSearch styles={styles} />

                    <nav style={styles.nav}>
                        {token ? (
                            <>
                                {!isAdmin && <Link to="/create" style={styles.primaryBtn}>
                                    + Створити
                                </Link>}

                                {!isAdmin && <Link to="/my-events" style={styles.primaryBtn}>
                                    Мої події
                                </Link>}

                                {isAdmin && <Link to="/admin" style={styles.primaryBtn}>
                                    Admin
                                </Link>}

                                <Link to="/profile" style={styles.pill}>
                                    {user?.user_name ? user.user_name : "Кабінет"}
                                </Link>

                                <button onClick={logout} style={styles.ghostBtn} type="button">
                                    Вийти
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={onOpenLogin} style={styles.ghostBtn} type="button">
                                    Увійти
                                </button>
                                <button onClick={onOpenRegister} style={styles.primaryBtn} type="button">
                                    Реєстрація
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </Container>
        </header>
    );
}

const styles = {
    header: {
        position: "sticky",
        top: 0,
        zIndex: 20,
        padding: "14px 0",
        backdropFilter: "blur(14px)",
        background: "rgba(5, 8, 22, 0.55)",
        borderBottom: "1px solid rgba(148,163,184,.16)"
    },

    row: {
        display: "flex",
        gap: 14,
        alignItems: "center"
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 900,
        letterSpacing: 0.2,
        textDecoration: "none",
        whiteSpace: "nowrap"
    },

    brandDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
        boxShadow: "0 0 22px rgba(124,58,237,.55)"
    },

    searchWrap: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 999,
        border: "1px solid rgba(148,163,184,.16)",
        background: "rgba(255,255,255,.06)"
    },

    searchIcon: {
        opacity: 0.65,
        fontSize: 14
    },

    search: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        color: "rgba(255,255,255,.9)"
    },

    nav: {
        display: "flex",
        gap: 10,
        alignItems: "center"
    },

    navLink: {
        opacity: 0.8,
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 10
    },

    pill: {
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 999,
        border: "1px solid rgba(148,163,184,.16)",
        background: "rgba(255,255,255,.06)",
        opacity: 0.95,
        maxWidth: 180,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },

    primaryBtn: {
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(124,58,237,.35)",
        background: "linear-gradient(135deg, rgba(124,58,237,.95), rgba(37,99,235,.85))",
        boxShadow: "0 10px 30px rgba(37,99,235,.15)",
        color: "white",
        fontWeight: 700,
        whiteSpace: "nowrap"
    },

    ghostBtn: {
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(148,163,184,.18)",
        background: "rgba(255,255,255,.06)",
        color: "rgba(255,255,255,.92)",
        cursor: "pointer",
        whiteSpace: "nowrap"
    }
};
