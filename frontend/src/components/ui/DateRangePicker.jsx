import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef } from "react";
import { registerLocale } from "react-datepicker";
import { uk } from "date-fns/locale";

registerLocale("uk", uk);

export default function DateRangePicker({ dateFrom, dateTo, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const [startDate, setStartDate] = useState(dateFrom ? new Date(dateFrom) : null);
    const [endDate, setEndDate] = useState(dateTo ? new Date(dateTo) : null);

    function formatLocal(date) {
        if (!date) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    function handleChange([start, end]) {
        setStartDate(start);
        setEndDate(end);

        onChange({
            dateFrom: formatLocal(start),
            dateTo: formatLocal(end),
        });

        if (end) setOpen(false);
    }

    function clear(e) {
        e.stopPropagation();
        setStartDate(null);
        setEndDate(null);
        onChange({ dateFrom: "", dateTo: "" });
    }

    const label = startDate
        ? `${fmt(startDate)}${endDate ? " — " + fmt(endDate) : " — …"}`
        : "Будь-яка дата";

    return (
        <div ref={wrapRef} style={wrapper}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                style={trigger}
            >
                <CalIcon />
                <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                {(dateFrom || dateTo) && (
                    <span onClick={clear} style={clearBtn} title="Скинути">✕</span>
                )}
            </button>

            {open && (
                <div style={pickerWrap}>
                    <DatePicker
                        locale="uk"
                        selected={startDate}
                        onChange={handleChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        calendarStartDay={1}
                        minDate={new Date()}
                        disabledKeyboardNavigation
                        focusSelectedMonth={false}
                    />
                </div>
            )}

            {open && (
                <div style={backdrop} onClick={() => setOpen(false)} />
            )}
        </div>
    );
}

function fmt(date) {
    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
}

function CalIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="rgba(148,163,184,.7)" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    );
}

const wrapper = {
    position: "relative"
};

const trigger = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    fontSize: 14,
    cursor: "pointer",
    outline: "none"
};

const clearBtn = {
    opacity: 0.5,
    fontSize: 12,
    padding: "2px 4px",
    borderRadius: 6,
    cursor: "pointer"
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
    overflow: "hidden"
};

const backdrop = {
    position: "fixed",
    inset: 0,
    zIndex: 99
};
