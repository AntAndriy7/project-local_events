import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { uk } from "date-fns/locale";
import { useState, useRef } from "react";

registerLocale("uk", uk);

export default function CustomDateTimePicker({ selectedDate, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    function formatLabel(date) {
        if (!date) return "Обери дату та час";
        return date.toLocaleString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function handleChange(date) {
        onChange(date);
    }

    return (
        <div ref={wrapRef} style={wrapper}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                style={trigger}
            >
                <CalTimeIcon />
                <span style={{ flex: 1, textAlign: "left" }}>{formatLabel(selectedDate)}</span>
            </button>

            {open && (
                <div style={pickerWrap}>
                    <DatePicker
                        locale="uk"
                        selected={selectedDate}
                        onChange={handleChange}
                        inline
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Час"
                        calendarStartDay={1}
                        minDate={new Date()}
                        disabledKeyboardNavigation
                    />
                    {/* Кнопка "Готово", щоб закрити календар після вибору */}
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

function CalTimeIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="rgba(148,163,184,.7)" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <circle cx="12" cy="15" r="3" />
            <path d="M12 13.5V15l1 1" />
        </svg>
    );
}

const wrapper = {
    position: "relative",
    width: "100%"
};

const trigger = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.25)",
    background: "rgba(2, 6, 23, 0.6)",
    color: "white",
    fontSize: 14,
    cursor: "pointer",
    outline: "none"
};

const pickerWrap = {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    zIndex: 100,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.18)",
    background: "#0f172a",
    boxShadow: "0 20px 60px rgba(0,0,0,.5)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
};

const backdrop = {
    position: "fixed",
    inset: 0,
    zIndex: 99
};

const doneBtnStyle = {
    padding: "10px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 14
};
