import { useState, useRef, useEffect } from "react";
import { createReview } from "../api/reviewsApi";

export default function AddQuestionForm({ eventId, onCreated, onCancel, currentUser, parentId = null, replyToId = null, replyToUserName = "" }) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);

    const isExpanded = isFocused || comment.trim().length > 0;
    const isSubmitDisabled = loading || comment.trim().length < 2;

    // Автоматично збільшуємо висоту поля вводу при багаторядковому тексті
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [comment, isExpanded]);

    async function submit(e) {
        e.preventDefault();

        // Запобіжник, якщо форму спробують відправити через Enter, коли вона невалідна
        if (isSubmitDisabled) return;

        setError("");
        setLoading(true);
        try {
            await createReview({
                eventId,
                rating: 0,
                comment: comment.trim(),
                parentId,
                replyToId
            });

            setComment("");
            setIsFocused(false);
            onCreated?.();
        } catch (e) {
            setError(e.message || "Не вдалося надіслати");
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setComment("");
        setIsFocused(false);
        setError("");
        onCancel?.();
    };

    const avatarLetter = currentUser?.name?.charAt(0)?.toUpperCase() || currentUser?.userName?.charAt(0)?.toUpperCase() || "?";

    return (
        <form onSubmit={submit} style={formContainer}>
            {parentId && (
                <div style={headerStyle}>
                    Відповідь для @{replyToUserName}
                </div>
            )}

            {error && <div style={errorBox}>{error}</div>}

            <div style={inputRow}>
                <div style={authorAvatar}>{avatarLetter}</div>

                <div style={inputWrapper}>
                    <textarea
                        ref={textareaRef}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        rows={1}
                        placeholder={isFocused ? "" : (parentId ? "Напишіть вашу відповідь..." : "Що б ви хотіли дізнатися про цю подію?")}
                        disabled={loading}
                        autoFocus={!!parentId}
                        style={{
                            ...textareaStyle,
                            borderBottom: isExpanded ? "1px solid rgba(255, 255, 255, 1)" : "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                    />

                    {isExpanded && (
                        <div style={actions}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                style={ghostBtn}
                            >
                                Скасувати
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                style={{
                                    ...primaryBtn,
                                    opacity: isSubmitDisabled ? 0.5 : 1,
                                    cursor: isSubmitDisabled ? "default" : "pointer"
                                }}
                            >
                                {loading ? "Надсилання…" : (parentId ? "Відповісти" : "Додати питання")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

const formContainer = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%"
};

const headerStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: 4,
    marginLeft: 48
};

const inputRow = {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    width: "100%"
};

const authorAvatar = {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    color: "#e2e8f0",
    flexShrink: 0,
    marginTop: 2
};

const inputWrapper = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8
};

const textareaStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 0",
    background: "transparent",
    border: "none",
    color: "#f8fafc",
    fontSize: 15,
    lineHeight: 1.5,
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-bottom 0.2s ease",
    overflow: "hidden",
};

const actions = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
};

const primaryBtn = {
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
    transition: "all 0.2s ease",
};

const ghostBtn = {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#cbd5e1",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s ease",
};

const errorBox = {
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    marginLeft: 48
};