import { useState } from "react";

export default function CustomField({
                                        label,
                                        value,
                                        onChange,
                                        onBlur,
                                        error,
                                        type = "text",
                                        multiline = false,
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

    const InputComponent = multiline ? "textarea" : "input";

    return (
        <div style={wrapperStyle}>
            <label style={getLabelStyle(isActive, isFocused, hasError, multiline)}>
                {label}
            </label>

            <div style={{ position: "relative", width: "100%" }}>
                <InputComponent
                    type={multiline ? undefined : type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={getInputStyle(isFocused, hasError, Boolean(rightElement), multiline)}
                    {...props}
                />

                {rightElement && (
                    <div style={rightElementStyle}>
                        {rightElement}
                    </div>
                )}
            </div>

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

const wrapperStyle = {
    position: "relative",
    width: "100%",
    marginBottom: 8,
};

const getLabelStyle = (isActive, isFocused, hasError, multiline) => {
    let color = "#94a3b8";
    if (hasError) color = "#f472b6";
    else if (isFocused) color = "#8ab4f8";

    return {
        position: "absolute",
        left: isActive ? 10 : 14,
        top: isActive ? 0 : (multiline ? 24 : "50%"),
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

const getInputStyle = (isFocused, hasError, hasRightElement, multiline) => {
    let borderColor = "rgba(148, 163, 184, 0.4)";
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
        minHeight: multiline ? 120 : "auto",
        resize: multiline ? "vertical" : "none",
        fontFamily: "inherit",
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
    bottom: -20,
    left: 4,
    fontSize: 12,
    color: "#f472b6",
    display: "flex",
    alignItems: "center",
    gap: 6,
};