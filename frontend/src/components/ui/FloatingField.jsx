import { useState } from "react";

export default function FloatingField({
                                          label,
                                          value,
                                          onChange,
                                          onBlur,
                                          error,
                                          type = "text",
                                          rightElement,
                                          ...props
                                      }) {
    const [isFocused, setIsFocused] = useState(false);

    const isActive = isFocused || Boolean(value);
    const hasError = Boolean(error);

    const handleFocus = () => setIsFocused(true);

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div style={getWrapperStyle(hasError)}>
            <style>
                {`
                .floating-input:-webkit-autofill,
                .floating-input:-webkit-autofill:hover, 
                .floating-input:-webkit-autofill:focus, 
                .floating-input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 50px #0f172a inset !important;
                    -webkit-text-fill-color: #f8fafc !important;
                    transition: background-color 5000s ease-in-out 0s !important;
                    caret-color: white;
                }

                @keyframes slideDownError {
                    0% { opacity: 0; transform: translateY(-5px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                .error-anim {
                    animation: slideDownError 0.25s ease-out forwards;
                }
                `}
            </style>

            <label style={getLabelStyle(isActive, isFocused, hasError)}>
                {label}
            </label>

            <div style={{ position: "relative" }}>
                <input
                    className="floating-input"
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={getInputStyle(isFocused, hasError, Boolean(rightElement))}
                    {...props}
                />

                {rightElement && (
                    <div style={rightElementStyle}>
                        {rightElement}
                    </div>
                )}
            </div>

            {hasError && (
                <div className="error-anim" style={errorStyle}>
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

const getWrapperStyle = (hasError) => ({
    position: "relative",
    width: "100%",
    marginBottom: hasError ? 38 : 16,
    transition: "margin-bottom 0.25s ease-out",
});

const getLabelStyle = (isActive, isFocused, hasError) => {
    let color = "#94a3b8";
    if (hasError) color = "#f472b6";
    else if (isFocused) color = "#8ab4f8";

    return {
        position: "absolute",
        left: isActive ? 10 : 14,
        top: isActive ? 0 : "50%",
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

const getInputStyle = (isFocused, hasError, hasRightElement) => {
    let borderColor = "#475569";
    if (hasError) borderColor = "#f472b6";
    else if (isFocused) borderColor = "#8ab4f8";

    return {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 14px",
        paddingRight: hasRightElement ? 44 : 14,
        background: "transparent",
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        color: "#f8fafc",
        fontSize: 15,
        outline: "none",
        transition: "border-color 0.2s ease-out",
        zIndex: 1,
    };
};

const rightElementStyle = {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
};

const errorStyle = {
    position: "absolute",
    top: "100%",
    marginTop: 6,
    left: 4,
    fontSize: 12,
    color: "#f472b6",
    display: "flex",
    alignItems: "center",
    gap: 6,
};