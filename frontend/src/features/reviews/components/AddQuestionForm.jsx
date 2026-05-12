import { useState } from "react";
import { createReview } from "../api/reviewsApi";

export default function AddQuestionForm({ eventId, onCreated, onCancel }) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function submit(e) {
        e.preventDefault();
        setError("");

        if (comment.trim().length < 2) {
            return setError("Питання занадто коротке. Напишіть хоча б кілька слів.");
        }

        setLoading(true);
        try {
            await createReview({
                eventId,
                rating: 0,
                comment: comment.trim(),
            });

            onCreated?.();
        } catch (e) {
            setError(e.message || "Не вдалося додати питання");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submit} style={formContainer}>
            <div style={headerStyle}>Нове питання</div>

            {error && <div style={errorBox}>{error}</div>}

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Що б ви хотіли дізнатися про цю подію?"
                disabled={loading}
                style={textareaStyle}
            />

            <div style={actions}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    style={ghostBtn}
                >
                    Скасувати
                </button>

                <button type="submit" disabled={loading} style={primaryBtn}>
                    {loading ? "Надсилання…" : "Додати питання"}
                </button>
            </div>
        </form>
    );
}

const formContainer = {
    display: "grid",
    gap: 12,
};

const headerStyle = {
    fontSize: 16,
    fontWeight: 600,
    color: "#f8fafc",
    marginBottom: 4,
};

const textareaStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: 16,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#f8fafc",
    fontSize: 15,
    lineHeight: 1.5,
    resize: "vertical",
    minHeight: 80,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s ease",
};

const actions = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 4,
};

const primaryBtn = {
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
    transition: "opacity 0.2s ease",
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
};