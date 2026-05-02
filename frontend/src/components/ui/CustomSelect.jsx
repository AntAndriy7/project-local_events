import { useState, useRef, useEffect } from "react";

export default function CustomSelect({value, onChange, options, placeholder, disabled, isClearable = false}) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const selected = options.find((o) => o.value === value) ?? null;

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
        <div ref={wrapRef} style={wrapper}>
            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                style={{
                    ...trigger,
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? "not-allowed" : "pointer"
                }}
            >
                <span style={{ flex: 1, textAlign: "left", opacity: selected ? 1 : 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selected ? selected.label : placeholder}
                </span>

                {isClearable && selected && !disabled && (
                    <span
                        onClick={handleClear}
                        style={clearBtn}
                    >
                        ✕
                    </span>
                )}

                <ChevronIcon open={open} />
            </button>

            {open && !disabled && (
                <div style={dropdown}>
                    {options.map((o) => {
                        const isActive = o.value === value;
                        return (
                            <div
                                key={o.value}
                                onMouseDown={(e) => {
                                    pick(o.value, e);
                                }}
                                style={{
                                    ...option,
                                    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                                    fontWeight: isActive ? "600" : "400"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                                onMouseLeave={(e) => e.target.style.background = isActive ? "rgba(255,255,255,0.15)" : "transparent"}
                            >
                                {o.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ChevronIcon({ open }) {
    return (
        <svg
            width="10" height="6" viewBox="0 0 12 8" fill="none"
            style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none", opacity: 0.6 }}
        >
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.2)",
    background: "rgba(255,255,255,.05)",
    color: "white",
    fontSize: 14,
    outline: "none",
};

const clearBtn = {
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    opacity: 0.5,
    cursor: "pointer",
    lineHeight: 1,
};

const dropdown = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 12,
    background: "#1e293b",
    border: "1px solid rgba(148,163,184,.2)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
    padding: "4px",
    maxHeight: "250px",
    overflowY: "auto",
};

const option = {
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    color: "white",
    transition: "all 0.2s",
};
