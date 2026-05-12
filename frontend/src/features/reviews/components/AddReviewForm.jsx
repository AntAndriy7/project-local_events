import { useState } from "react";
import { createReview } from "../api/reviewsApi";
import StarRating from "./StarRating";

export default function AddReviewForm({ eventId, onCreated, onCancel }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function submit(e) {
        e.preventDefault();
        setError("");

        if (comment.trim().length < 2) {
            return setError("Коментар занадто короткий");
        }

        setLoading(true);
        try {
            await createReview({
                eventId,
                rating,
                comment: comment.trim(),
            });

            onCreated?.();
        } catch (e) {
            setError(e.message || "Не вдалося додати відгук");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submit} style={item}>
            <strong style={{ fontSize: 14 }}>Залишити відгук</strong>

            {error && <div style={errorBox}>{error}</div>}

            <StarRating value={rating} onChange={setRating} disabled={loading} />

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Ваші враження від події…"
                disabled={loading}
                style={textarea}
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
                    {loading ? "Надсилання…" : "Додати відгук"}
                </button>
            </div>
        </form>
    );
}

const item = {
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.35)",
    display: "grid",
    gap: 10,
};

const textarea = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    resize: "vertical",
};

const actions = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 4,
};

const primaryBtn = {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(124,58,237,.35)",
    background: "linear-gradient(135deg, rgba(124,58,237,.9), rgba(37,99,235,.8))",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
};

const ghostBtn = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.25)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    cursor: "pointer",
};

const errorBox = {
    padding: "6px 10px",
    borderRadius: 10,
    fontSize: 12,
    background: "rgba(239,68,68,.12)",
    border: "1px solid rgba(239,68,68,.35)",
};
