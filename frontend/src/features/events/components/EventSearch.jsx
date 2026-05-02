import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents.js";
import { useEventSearch } from "../hooks/useEventSearch.js";

export default function EventSearch({ styles }) {
    const navigate = useNavigate();

    const { events, reload } = useEvents(false);
    const {query, setQuery, results, open, setOpen, hasResults} = useEventSearch(events);

    const rootRef = useRef(null);
    const inputRef = useRef(null);

    function clear() {
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
    }

    function goTo(eventId) {
        clear();
        navigate(`/events/${eventId}`);
    }

    function onKeyDown(e) {
        if (e.key === "Escape") {
            clear();
        }
        if (e.key === "Enter" && results[0]) {
            goTo(results[0].id);
        }
    }

    // КЛІК ПОЗА ПОШУКОМ
    useEffect(() => {
        function onClickOutside(e) {
            if (!rootRef.current?.contains(e.target)) {
                clear();
            }
        }

        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // Функція-обробник для лінивого завантаження
    function handleInteraction() {
        setOpen(true);
        // Робимо запит до API ТІЛЬКИ якщо масив подій ще порожній
        if (events.length === 0) {
            reload();
        }
    }

    return (
        <div ref={rootRef} style={{ position: "relative", flex: 1 }}>
            <div style={styles.searchWrap}>
                <span style={styles.searchIcon}>⌕</span>

                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleInteraction();
                    }}
                    onFocus={handleInteraction}
                    onKeyDown={onKeyDown}
                    placeholder="Пошук подій, локацій…"
                    style={styles.search}
                />

                {query && (
                    <button
                        onClick={clear}
                        type="button"
                        style={clearBtn}
                        aria-label="Очистити"
                    >
                        ×
                    </button>
                )}
            </div>

            {open && hasResults && (
                <div style={dropdown}>
                    {results.map((e) => (
                        <div
                            key={e.id}
                            onMouseDown={() => goTo(e.id)}
                            style={item}
                            onMouseEnter={(el) => el.target.style.background = "rgba(255,255,255,0.08)"}
                            onMouseLeave={(el) => el.target.style.background = "transparent"}
                        >
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</div>
                            <div style={meta}>
                                {e.date} • {e.districtName}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const clearBtn = {
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,.6)",
    fontSize: 18,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    opacity: 0.8,
    transition: "opacity 0.2s ease",
};

const dropdown = {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,.12)",
    background: "rgba(15,23,42,0.85)",
    backdropFilter: "blur(12px)",
    zIndex: 10000,
    overflow: "hidden",
    maxHeight: "320px",
    overflowY: "auto",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
};

const item = {
    padding: "12px 16px",
    cursor: "pointer",
    borderBottom: "1px solid rgba(148,163,184,.08)",
    transition: "background 0.15s ease",
    color: "white",
};

const meta = {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 4,
};