import { useState } from "react";

export default function StarRating({ value, onChange, disabled = false }) {
    const [hover, setHover] = useState(null);

    return (
        <div
            style={wrap}
            onMouseLeave={() => !disabled && setHover(null)}
        >
            {[1, 2, 3, 4, 5].map((i) => {
                const active = i <= (hover ?? value);

                return (
                    <span
                        key={i}
                        onMouseEnter={() => !disabled && setHover(i)}
                        onClick={() => !disabled && onChange(i)}
                        style={{
                            ...star,
                            opacity: active ? 1 : 0.3,
                            transform: active ? "scale(1.15)" : "scale(1)",
                            filter: active
                                ? "drop-shadow(0 0 6px rgba(251,191,36,.8))"
                                : "none",
                            cursor: disabled ? "default" : "pointer",
                        }}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}


const wrap = {
    display: "flex",
    gap: 6,
};

const star = {
    fontSize: 28,
    lineHeight: 1,
    color: "#fbbf24",
    transition: "all 0.2s ease",
    userSelect: "none",
};
