import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { register } from "../api/authApi.js";
import { setAuth } from "../authStorage";
import FloatingField from "../../../components/ui/FloatingField.jsx";

import eyeViewIcon from "../../../assets/eye_view.svg";
import eyeHideIcon from "../../../assets/eye_hide.svg";

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); }
function isStrongPassword(v) { const s = String(v); return s.length >= 6 && /[A-Za-z]/.test(s) && /\d/.test(s); }
// function isUAPhone(v) { return /^\+380\d{9}$/.test(String(v).replace(/\s/g, "")); }

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

export default function RegisterModal({ onClose, onSwitchToLogin }) {
    const nav = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    // const [phone, setPhone] = useState("+380");
    // const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    const [touched, setTouched] = useState({
        userName: false,
        email: false,
        // phone: false,
        // birthDate: false,
        password: false,
        password2: false
    });

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const errors = useMemo(() => {
        const e = {};
        if (!userName.trim()) e.userName = "Вкажи імʼя.";
        if (!email.trim() || !isEmail(email)) e.email = "Некоректний email.";
        // if (!phone.trim() || phone === "+380" || !isUAPhone(phone)) e.phone = "Некоректний номер телефону.";
        // if (!birthDate) e.birthDate = "Обери дату народження.";
        if (!password || !isStrongPassword(password)) e.password = "Мін. 6 символів, літера + цифра.";
        if (!password2 || password2 !== password) e.password2 = "Паролі не збігаються.";
        return e;
    }, [userName, email, password, password2]); // phone та birthDate прибрані з залежностей

    const canSubmit = useMemo(() => Object.keys(errors).length === 0 && !loading, [errors, loading]);
    function mark(name) { setTouched((t) => ({ ...t, [name]: true })); }

    /*
    function handlePhoneChange(e) {
        const val = e.target.value;
        const onlyNums = val.replace(/\D/g, "");
        let digits = onlyNums.startsWith("380") ? onlyNums.slice(3) : onlyNums.slice(0, 9);
        digits = digits.slice(0, 9);

        let formatted = "+380";
        if (digits.length > 0) formatted += " " + digits.substring(0, 2);
        if (digits.length > 2) formatted += " " + digits.substring(2, 5);
        if (digits.length > 5) formatted += " " + digits.substring(5, 7);
        if (digits.length > 7) formatted += " " + digits.substring(7, 9);
        setPhone(formatted);
    }
    */

    async function onSubmit(e) {
        e.preventDefault();
        setServerError("");
        setTouched({
            userName: true,
            email: true,
            // phone: true,
            // birthDate: true,
            password: true,
            password2: true
        });

        if (Object.keys(errors).length) return;

        setLoading(true);
        try {
            const res = await register({
                userName: userName.trim(),
                email: email.trim(),
                password,
                // phoneNumber: phone.replace(/\s/g, ""),
                // birthDate: birthDate,
            });
            setAuth({ token: res.token, user: res.user });
            onClose();

            const from = location.state?.from || "/profile";
            nav(from, { replace: true });

        } catch (e2) {
            setServerError(e2.message || "Помилка реєстрації");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={overlay} onClick={onClose}>
            <div style={modalWrap} onClick={(e) => e.stopPropagation()}>
                <button style={closeBtn} onClick={onClose}>✕</button>

                <h2 style={h2}>Реєстрація</h2>

                {serverError && <div style={errorBox}>{serverError}</div>}

                <form onSubmit={onSubmit} style={form}>
                    <FloatingField
                        label="Імʼя"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onBlur={() => mark("userName")}
                        error={touched.userName ? errors.userName : ""}
                        disabled={loading}
                    />

                    <FloatingField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => mark("email")}
                        error={touched.email ? errors.email : ""}
                        disabled={loading}
                    />

                    {/* Закоментовано поля телефону та дати народження */}
                    {/*
                    <FloatingField
                        label="Телефон"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => mark("phone")}
                        maxLength={17}
                        error={touched.phone ? errors.phone : ""}
                        disabled={loading}
                    />

                    <FloatingField
                        label="Дата народження"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        onBlur={() => mark("birthDate")}
                        error={touched.birthDate ? errors.birthDate : ""}
                        disabled={loading}
                    />
                    */}

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

                    <FloatingField
                        label="Повтори пароль"
                        type={showPass2 ? "text" : "password"}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        onBlur={() => mark("password2")}
                        error={touched.password2 ? errors.password2 : ""}
                        disabled={loading}
                        rightElement={
                            <EyeButton shown={showPass2} onClick={() => setShowPass2(!showPass2)} />
                        }
                    />

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        style={{ ...btn, opacity: canSubmit ? 1 : 0.6 }}
                    >
                        {loading ? "Створюємо..." : "Зареєструватись"}
                    </button>
                </form>

                <div style={footerText}>
                    Вже є акаунт? <button type="button" onClick={onSwitchToLogin} style={linkBtn}>Увійти</button>
                </div>
            </div>
        </div>
    );
}

// --- СТИЛІ ---

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
    padding: 16,
    overflowY: "auto"
};

const modalWrap = {
    position: "relative",
    width: "100%",
    maxWidth: 460,
    padding: "32px 28px",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.16)",
    background: "rgba(15,23,42,0.95)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    color: "white",
    maxHeight: "90vh",
    overflowY: "auto"
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
    margin: "0 0 24px",
    textAlign: "center",
    fontSize: 28,
    fontWeight: 900
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
    transition: "opacity 0.2s",
};

const errorBox = {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.10)",
    marginBottom: 20,
    fontSize: 14,
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
    opacity: 0.7,
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
    fontSize: 14,
};

const linkBtn = {
    background: "none",
    border: "none",
    color: "rgba(167, 139, 250, 1)",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14
};