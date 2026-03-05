import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { register } from "../api/authApi.js";
import { setAuth } from "../authStorage";

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); }
function isStrongPassword(v) { const s = String(v); return s.length >= 6 && /[A-Za-z]/.test(s) && /\d/.test(s); }
function isUAPhone(v) { return /^\+380\d{9}$/.test(String(v).replace(/\s/g, "")); }

function EyeButton({ shown, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={shown ? "Сховати пароль" : "Показати пароль"}
            style={eyeBtn}
            title={shown ? "Сховати пароль" : "Показати пароль"}
        >
            {shown ? "🙈" : "👁"}
        </button>
    );
}

export default function RegisterModal({ onClose, onSwitchToLogin }) {
    const nav = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+380");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [touched, setTouched] = useState({ userName: false, email: false, phone: false, birthDate: false, password: false, password2: false });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const errors = useMemo(() => {
        const e = {};
        if (!userName.trim()) e.userName = "Вкажи імʼя.";
        if (!email.trim() || !isEmail(email)) e.email = "Некоректний email.";
        if (!phone.trim() || phone === "+380" || !isUAPhone(phone)) e.phone = "Некоректний номер телефону.";
        if (!birthDate) e.birthDate = "Обери дату народження.";
        if (!password || !isStrongPassword(password)) e.password = "Мін. 6 символів, літера + цифра.";
        if (!password2 || password2 !== password) e.password2 = "Паролі не збігаються.";
        return e;
    }, [userName, email, phone, birthDate, password, password2]);

    const canSubmit = useMemo(() => Object.keys(errors).length === 0 && !loading, [errors, loading]);
    function mark(name) { setTouched((t) => ({ ...t, [name]: true })); }

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

    async function onSubmit(e) {
        e.preventDefault();
        setServerError("");
        setTouched({ userName: true, email: true, phone: true, birthDate: true, password: true, password2: true });

        if (Object.keys(errors).length) return;

        setLoading(true);
        try {
            const res = await register({
                user_name: userName.trim(), email: email.trim(), phone_number: phone.replace(/\s/g, ""), password, birth_date: birthDate,
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

                {serverError && <div style={errorBox}>❌ {serverError}</div>}

                <form onSubmit={onSubmit} style={form}>
                    <Field
                        label="Імʼя"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onBlur={() => mark("userName")}
                        error={touched.userName ? errors.userName : ""}
                    />

                    <Field
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => mark("email")}
                        error={touched.email ? errors.email : ""}
                    />

                    <Field
                        label="Телефон"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => mark("phone")}
                        maxLength={17}
                        error={touched.phone ? errors.phone : ""}
                    />

                    <Field
                        label="Дата народження"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        onBlur={() => mark("birthDate")}
                        error={touched.birthDate ? errors.birthDate : ""}
                    />

                    <PasswordField
                        label="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => mark("password")}
                        error={touched.password ? errors.password : ""}
                        shown={showPass}
                        toggle={() => setShowPass((s) => !s)}
                    />

                    <PasswordField
                        label="Повтори пароль"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        onBlur={() => mark("password2")}
                        error={touched.password2 ? errors.password2 : ""}
                        shown={showPass2}
                        toggle={() => setShowPass2((s) => !s)}
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
                    Вже є акаунт? <button onClick={onSwitchToLogin} style={linkBtn}>Увійти</button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, error, ...inputProps }) {
    const hasError = Boolean(error);
    return (
        <label style={labelStyle}>
            {label}
            <input {...inputProps} style={{ ...control, border: hasError ? errBorder : okBorder }} />
            {hasError && <div style={errText}>{error}</div>}
        </label>
    );
}

function PasswordField({ label, error, shown, toggle, ...inputProps }) {
    const hasError = Boolean(error);
    return (
        <label style={labelStyle}>
            {label}
            <div style={{ position: "relative" }}>
                <input
                    {...inputProps}
                    type={shown ? "text" : "password"}
                    style={{ ...control, paddingRight: 44, border: hasError ? errBorder : okBorder }}
                />
                <EyeButton shown={shown} onClick={toggle} />
            </div>
            {hasError && <div style={errText}>{error}</div>}
        </label>
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
    display: "grid",
    gap: 16
};

const labelStyle = {
    display: "grid",
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.95
};

const control = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(2, 6, 23, 0.4)",
    color: "white",
    outline: "none",
    fontSize: 15,
    transition: "border 0.2s",
};

const okBorder = "1px solid rgba(148, 163, 184, 0.25)";
const errBorder = "1px solid rgba(239,68,68,0.6)";
const errText = {
    fontSize: 12,
    color: "rgba(248, 113, 113, 1)",
    marginTop: 2
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
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "white",
    fontSize: 16,
    width: 32,
    height: 32,
    cursor: "pointer",
    opacity: 0.7,
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
