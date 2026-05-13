import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { uk } from "date-fns/locale";
import { useState, useRef } from "react";

registerLocale("uk", uk);

export default function CustomDateTimePicker({ label, selectedDate, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    const isFocused = open;

    function formatLabel(date) {
        if (!date) return "Оберіть дату та час";
        return date.toLocaleString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    return (
        <div ref={wrapRef} style={wrapperStyle}>
            {label && (
                <label style={getLabelStyle(isFocused)}>
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                style={getTriggerStyle(isFocused)}
            >
                <CalTimeIcon isFocused={isFocused} />
                <span style={{
                    flex: 1,
                    textAlign: "left",
                    color: selectedDate ? "#f8fafc" : "rgb(148, 163, 184)"
                }}>
                    {formatLabel(selectedDate)}
                </span>
            </button>

            {open && (
                <div style={pickerWrap}>
                    <DatePicker
                        locale="uk"
                        selected={selectedDate}
                        onChange={(date) => onChange(date)}
                        inline
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Час"
                        calendarStartDay={1}
                        minDate={new Date()}
                        disabledKeyboardNavigation
                    />
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        style={doneBtnStyle}
                    >
                        Готово
                    </button>
                </div>
            )}

            {open && <div style={backdrop} onClick={() => setOpen(false)} />}
        </div>
    );
}

function CalTimeIcon({ isFocused }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke={isFocused ? "#8ab4f8" : "rgba(148,163,184,.6)"}
             strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <circle cx="12" cy="15" r="3" />
            <path d="M12 13.5V15l1 1" />
        </svg>
    );
}

const wrapperStyle = {
    position: "relative",
    width: "100%",
};

const getLabelStyle = (isFocused) => ({
    position: "absolute",
    left: 10,
    top: 0,
    transform: "translateY(-50%)",
    fontSize: 12,
    color: isFocused ? "#8ab4f8" : "#94a3b8",
    pointerEvents: "none",
    transition: "all 0.2s ease-out",
    background: "#0f172a",
    padding: "0 4px",
    zIndex: 2,
});

const getTriggerStyle = (isFocused) => ({
    width: "100%",
    height: "50px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxSizing: "border-box",
    padding: "0 14px",
    background: "transparent",
    border: `1px solid ${isFocused ? "#8ab4f8" : "rgba(148, 163, 184, 0.4)"}`,
    borderRadius: 8,
    color: "#f8fafc",
    fontSize: 15,
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s ease-out",
});

const pickerWrap = {
    position: "absolute",
    top: "calc(100%)",
    left: 0,
    zIndex: 1000,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.2)",
    background: "#1e293b",
    boxShadow: "0 20px 50px rgba(0,0,0,.4)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
};

const backdrop = {
    position: "fixed",
    inset: 0,
    zIndex: 999
};

const doneBtnStyle = {
    padding: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 14,
};
