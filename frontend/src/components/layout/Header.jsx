import { Link } from "react-router-dom";
import Container from "./Container";
import { getToken, getUser } from "../../features/auth/authStorage";
import EventSearch from "../../features/events/components/EventSearch.jsx";

export default function Header({ onOpenLogin }) {
    const token = getToken();
    const user = getUser();
    const isAdmin = user?.role === "ADMIN";

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
                                {!isAdmin && (
                                    <Link to="/my-events" style={styles.primaryBtn}>
                                        Мої події
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link to="/admin" style={styles.primaryBtn}>
                                        Admin
                                    </Link>
                                )}

                                <Link to="/profile" style={styles.profilePill}>
                                    <div style={styles.avatarPlaceholder}>
                                        {user?.user_name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span style={styles.userName}>{user?.user_name || "Профіль"}</span>
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={onOpenLogin}
                                style={styles.loginPill}
                                type="button"
                            >
                                <UserIcon />
                                <span style={{ fontSize: "14px", fontWeight: "600" }}>Профіль</span>
                            </button>
                        )}
                    </nav>
                </div>
            </Container>
        </header>
    );
}

function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

const styles = {
    header: {
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "16px 0",
        backdropFilter: "blur(16px)",
        background: "rgba(5, 8, 22, 0.65)",
        borderBottom: "1px solid rgba(148,163,184,.12)",
    },

    row: {
        display: "flex",
        gap: 20,
        alignItems: "center",
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 900,
        fontSize: 16,
        letterSpacing: "-0.01em",
        textDecoration: "none",
        whiteSpace: "nowrap",
        color: "white",
    },

    brandDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
        boxShadow: "0 0 22px rgba(124,58,237,.55)",
    },

    searchWrap: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 16px",
        borderRadius: 12,
        border: "1.5px solid rgba(148,163,184,.12)",
        background: "rgba(15,23,42,0.4)",
        transition: "all 0.25s ease",
    },

    searchIcon: {
        opacity: 0.6,
        fontSize: 14,
    },

    search: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        color: "rgba(255,255,255,.92)",
        fontSize: 14,
        fontWeight: 500,
    },

    nav: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
    },

    navLink: {
        opacity: 0.8,
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 10,
    },

    pill: {
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1.5px solid rgba(148,163,184,.12)",
        background: "rgba(15,23,42,0.4)",
        opacity: 0.92,
        maxWidth: 180,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "white",
        fontSize: 14,
        fontWeight: 600,
        transition: "all 0.25s ease",
    },

    loginPill: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        height: "40px",
        padding: "0 16px 0 12px",
        borderRadius: "12px",
        border: "1.5px solid rgba(148,163,184,.12)",
        background: "rgba(15,23,42,0.4)",
        color: "rgba(255,255,255,.92)",
        cursor: "pointer",
        outline: "none",
    },

    profilePill: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        height: "40px",
        padding: "0 14px 0 0",
        borderRadius: "12px",
        background: "rgba(124, 58, 237, 0.1)",
        border: "1.5px solid rgba(124, 58, 237, 0.2)",
        textDecoration: "none",
        color: "white",
        transition: "all 0.2s ease",
        overflow: "hidden",
    },

    avatarPlaceholder: {
        width: "40px",
        height: "100%",
        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "800",
        color: "white",
    },

    userName: {
        fontSize: "14px",
        fontWeight: "600",
        maxWidth: "120px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    loginIconButton: {
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        border: "1.5px solid rgba(148,163,184,.12)",
        background: "rgba(255,255,255,.05)",
        color: "white",
        cursor: "pointer",
        transition: "all 0.25s ease",
        outline: "none",
    },

    primaryBtn: {
        textDecoration: "none",
        padding: "11px 16px",
        borderRadius: 10,
        border: "1.5px solid rgba(148,163,184,.12)",
        background: "rgba(15,23,42,0.4)",
        color: "rgba(255,255,255,.92)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontSize: 14,
        fontWeight: 600,
        transition: "all 0.25s ease",
    },
};