import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/authApi.js";
import { setAuth } from "../authStorage";
import FloatingField from "../../../components/ui/FloatingField.jsx";

import eyeViewIcon from "../../../assets/eye_view.svg";
import eyeHideIcon from "../../../assets/eye_hide.svg";

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); }

function EyeButton({ shown, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={shown ? "Сховати пароль" : "Показати пароль"}
            style={eyeBtn}
            title={shown ? "Сховати пароль" : "Показати пароль"}
        >
            <img
                src={shown ? eyeHideIcon : eyeViewIcon}
                alt={shown ? "Сховати" : "Показати"}
                style={eyeIconImg}
            />
        </button>
    );
}

export default function LoginModal({ onClose, onSwitchToRegister }) {
    const nav = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const errors = useMemo(() => {
        const e = {};
        if (!email.trim()) e.email = "Вкажи email.";
        else if (!isEmail(email)) e.email = "Некоректний email.";
        if (!password) e.password = "Вкажи пароль.";
        return e;
    }, [email, password]);

    const canSubmit = useMemo(() => Object.keys(errors).length === 0 && !loading, [errors, loading]);
    function mark(name) { setTouched((t) => ({ ...t, [name]: true })); }

    async function onSubmit(e) {
        e.preventDefault();
        setServerError("");
        setTouched({ email: true, password: true });

        if (Object.keys(errors).length) return;

        setLoading(true);
        try {
            const res = await login(email.trim(), password);
            setAuth({ token: res.token, user: res.user });
            onClose();

            // Перевіряємо, звідки прийшов користувач. Якщо інфи немає - кидаємо на /profile
            const origin = location.state?.from || "/profile";
            nav(origin, { replace: true });

        } catch (e2) {
            setServerError(e2.message || "Помилка входу");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={overlay} onClick={onClose}>
            <div style={modalWrap} onClick={(e) => e.stopPropagation()}>
                <button style={closeBtn} onClick={onClose}>✕</button>

                <h2 style={h2}>Вхід</h2>
                <p style={lead}>Увійди, щоб керувати профілем і створювати події.</p>

                {serverError && <div style={errorBox}>{serverError}</div>}

                <form onSubmit={onSubmit} style={form}>
                    <FloatingField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => mark("email")}
                        error={touched.email ? errors.email : ""}
                        disabled={loading}
                    />

                    <FloatingField
                        label="Пароль"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => mark("password")}
                        error={touched.password ? errors.password : ""}
                        disabled={loading}
                        rightElement={
                            <EyeButton shown={showPass} onClick={() => setShowPass(!showPass)} />
                        }
                    />

                    <button disabled={!canSubmit} style={{ ...btn, opacity: canSubmit ? 1 : 0.6 }} type="submit">
                        {loading ? "Зачекайте..." : "Увійти"}
                    </button>
                </form>

                <div style={footerText}>
                    Нема акаунта? <button type="button" onClick={onSwitchToRegister} style={linkBtn}>Зареєструватись</button>
                </div>
            </div>
        </div>
    );
}

const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.1)",
    backdropFilter: "blur(6px)",
    zIndex: 99,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16
};

const modalWrap = {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    padding: "32px 28px",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.16)",
    background: "rgba(15,23,42,0.95)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    color: "white"
};

const closeBtn = {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    color: "white",
    fontSize: 20,
    cursor: "pointer",
    opacity: 0.5
};

const h2 = {
    margin: "0 0 8px",
    fontSize: 28,
    fontWeight: 900
};

const lead = {
    margin: "0 0 24px",
    opacity: 0.8,
    fontSize: 15,
    lineHeight: 1.4
};

const form = {
    display: "flex",
    flexDirection: "column"
};

const btn = {
    marginTop: 8,
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(124,58,237,.35)",
    background: "linear-gradient(135deg, rgba(124,58,237,.95), rgba(37,99,235,.85))",
    boxShadow: "0 12px 35px rgba(37,99,235,.16)",
    color: "white",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    transition: "opacity 0.2s"
};

const errorBox = {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.10)",
    marginBottom: 20,
    fontSize: 14
};

const eyeBtn = {
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    cursor: "pointer",
    opacity: 0.7
};

const eyeIconImg = {
    width: 20,
    height: 20,
    display: "block",
    filter: "brightness(0) invert(1)"
};

const footerText = {
    marginTop: 20,
    textAlign: "center",
    opacity: 0.85,
    fontSize: 14
};

const linkBtn = {
    background: "none",
    border: "none",
    color: "rgba(167, 139, 250, 1)",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14
};