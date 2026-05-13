import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef } from "react";
import { registerLocale } from "react-datepicker";
import { uk } from "date-fns/locale";

registerLocale("uk", uk);

export default function DateRangePicker({ label, dateFrom, dateTo, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const [startDate, setStartDate] = useState(dateFrom ? new Date(dateFrom) : null);
    const [endDate, setEndDate] = useState(dateTo ? new Date(dateTo) : null);

    const isFocused = open;

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

    const displayText = startDate
        ? `${fmt(startDate)}${endDate ? " — " + fmt(endDate) : " — …"}`
        : "Оберіть період";

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
                <CalIcon isFocused={isFocused} />
                <span style={{
                    flex: 1,
                    textAlign: "left",
                    color: startDate ? "#f8fafc" : "rgb(148, 163, 184)"
                }}>
                    {displayText}
                </span>

                {(startDate || endDate) && (
                    <span onClick={clear} style={clearBtnStyle} title="Скинути">
                        ✕
                    </span>
                )}
            </button>

            {open && (
                <div style={pickerWrapStyle}>
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

            {open && <div style={backdropStyle} onClick={() => setOpen(false)} />}
        </div>
    );
}

function fmt(date) {
    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
}

function CalIcon({ isFocused }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke={isFocused ? "#8ab4f8" : "rgba(148,163,184,.6)"}
             strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.2s" }}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
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

const clearBtnStyle = {
    opacity: 0.5,
    fontSize: 14,
    padding: "4px 8px",
    cursor: "pointer",
    color: "#94a3b8",
    transition: "opacity 0.2s",
    zIndex: 3
};

const pickerWrapStyle = {
    position: "absolute",
    top: "calc(100%)",
    left: 0,
    zIndex: 1000,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.2)",
    background: "#1e293b",
    boxShadow: "0 20px 50px rgba(0,0,0,.4)",
    overflow: "hidden"
};

const backdropStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 999
};
