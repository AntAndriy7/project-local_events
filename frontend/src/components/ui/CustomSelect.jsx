import { useState, useRef, useEffect } from "react";

export default function CustomSelect({
                                         label,
                                         value,
                                         onChange,
                                         options = [],
                                         placeholder,
                                         disabled,
                                         isClearable = false,
                                         error
                                     }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const selected = options.find((o) => o.value === value) ?? null;

    const isFocused = open;
    const isActive = isFocused || Boolean(selected);
    const hasError = Boolean(error);

    useEffect(() => {
        if (!open) return;
        function handle(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    function pick(val, e) {
        e.stopPropagation();
        onChange(val);
        setOpen(false);
    }

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div ref={wrapRef} style={wrapperStyle}>
            {label && (
                <label style={getLabelStyle(isActive, isFocused, hasError)}>
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                style={{
                    ...getTriggerStyle(isFocused, hasError),
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? "not-allowed" : "pointer"
                }}
            >
                <span style={{
                    flex: 1,
                    textAlign: "left",
                    opacity: selected ? 1 : (isActive ? 0.5 : 0),
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: "1.2"
                }}>
                    {selected ? selected.label : placeholder}
                </span>

                {isClearable && selected && !disabled && (
                    <span onClick={handleClear} style={clearBtnStyle}>
                        ✕
                    </span>
                )}

                <ChevronIcon open={open} />
            </button>

            {open && !disabled && (
                <div style={dropdownStyle}>
                    {options.map((o) => {
                        const isCurrent = o.value === value;
                        return (
                            <div
                                key={o.value}
                                onMouseDown={(e) => pick(o.value, e)}
                                style={{
                                    ...optionStyle,
                                    background: isCurrent ? "rgba(255,255,255,0.15)" : "transparent",
                                    fontWeight: isCurrent ? "600" : "400"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                                onMouseLeave={(e) => e.target.style.background = isCurrent ? "rgba(255,255,255,0.15)" : "transparent"}
                            >
                                {o.label}
                            </div>
                        );
                    })}
                </div>
            )}

            {hasError && (
                <div style={errorStyle}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}

function ChevronIcon({ open }) {
    return (
        <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            style={{
                transition: "transform .2s",
                transform: open ? "rotate(180deg)" : "none",
                opacity: 0.6,
                flexShrink: 0
            }}
        >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const wrapperStyle = {
    position: "relative",
    width: "100%",
    marginBottom: 8,
};

const getLabelStyle = (isActive, isFocused, hasError) => {
    let color = "#94a3b8";
    if (hasError) color = "#f472b6";
    else if (isFocused) color = "#8ab4f8";

    return {
        position: "absolute",
        left: isActive ? 10 : 14,
        top: isActive ? 0 : "25px",
        transform: "translateY(-50%)",
        fontSize: isActive ? 12 : 15,
        color: color,
        pointerEvents: "none",
        transition: "all 0.2s ease-out",
        background: isActive ? "#0f172a" : "transparent",
        padding: isActive ? "0 4px" : 0,
        zIndex: 2,
    };
};

const getTriggerStyle = (isFocused, hasError) => {
    let borderColor = "rgba(148, 163, 184, 0.4)";
    if (hasError) borderColor = "#f472b6";
    else if (isFocused) borderColor = "#8ab4f8";

    return {
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxSizing: "border-box",
        padding: "0 14px",
        background: "transparent",
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        color: "#f8fafc",
        fontSize: 15,
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.2s ease-out",
        zIndex: 1,
    };
};

const clearBtnStyle = {
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    opacity: 0.5,
    cursor: "pointer",
    lineHeight: 1,
    marginRight: 4
};

const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 12,
    background: "rgb(15,23,42)",
    border: "1px solid rgba(148,163,184,.2)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
    padding: "4px",
    maxHeight: "250px",
    overflowY: "auto",
};

const optionStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    color: "white",
    transition: "all 0.2s",
};

const errorStyle = {
    position: "absolute",
    bottom: -18,
    left: 4,
    fontSize: 12,
    color: "#f472b6",
    display: "flex",
    alignItems: "center",
    gap: 6,
};