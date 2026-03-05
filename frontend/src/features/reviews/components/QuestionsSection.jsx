import { useMemo, useState } from "react";
import { getUser } from "../../auth/authStorage";
import { updateReview, deleteReview } from "../api/reviewsApi";
import AddQuestionForm from "./AddQuestionForm";

const STATUS = {
    idle: "idle",
    saving: "saving",
    deleting: "deleting",
};

export default function QuestionsSection({ reviews = [], eventId, onChanged }) {
    const currentUserId = getUser()?.id ?? null;
    const [showForm, setShowForm] = useState(false);

    // беремо тільки питання (rating == null)
    const questions = useMemo(() => {
        return reviews.filter((r) => r.rating === null || r.rating === 0);
    }, [reviews]);

    // свої зверху + новіші вище
    const sorted = useMemo(() => {
        const toMs = (r) => {
            const d = r?.created_date;
            const t = r?.created_time || "00:00:00";
            const ms = new Date(`${d}T${t}`).getTime();
            return Number.isFinite(ms) ? ms : 0;
        };

        return [...questions].sort((a, b) => {
            const aMine = currentUserId && a.user_id === currentUserId;
            const bMine = currentUserId && b.user_id === currentUserId;
            if (aMine !== bMine) return aMine ? -1 : 1;
            return toMs(b) - toMs(a);
        });
    }, [questions, currentUserId]);

    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({ comment: "" });
    const [status, setStatus] = useState(STATUS.idle);
    const [error, setError] = useState("");

    function startEdit(q) {
        setError("");
        setEditingId(q.id);
        setDraft({ comment: q.comment ?? "" });
    }

    function cancelEdit() {
        setEditingId(null);
        setDraft({ comment: "" });
        setError("");
    }

    async function saveEdit(id) {
        setError("");

        const comment = String(draft.comment || "").trim();

        if (comment.length < 2) {
            return setError("Питання має бути мінімум 2 символи.");
        }

        setStatus(STATUS.saving);
        try {
            await updateReview(id, { rating: null, comment }); // rating null
            setEditingId(null);
            await onChanged?.();
        } catch (e) {
            setError(e.message || "Не вдалося оновити питання");
        } finally {
            setStatus(STATUS.idle);
        }
    }

    async function removeQuestion(id) {
        setError("");
        const ok = confirm("Видалити питання? Це дію не можна відмінити.");
        if (!ok) return;

        setStatus(STATUS.deleting);
        try {
            await deleteReview(id);
            if (editingId === id) setEditingId(null);
            await onChanged?.();
        } catch (e) {
            setError(e.message || "Не вдалося видалити питання");
        } finally {
            setStatus(STATUS.idle);
        }
    }

    return (
        <section style={panel}>
            <div style={panelTop}>
                <h3 style={{ margin: "10px 0px 10px 1px" }}>
                    Питання ({sorted.length})
                </h3>

                {!showForm && currentUserId && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={writeBtn}
                    >
                        ❓ Задати питання
                    </button>
                )}
            </div>

            {error && <div style={errorBox}>❌ {error}</div>}

            {showForm && currentUserId && (
                <AddQuestionForm
                    eventId={eventId}
                    onCreated={() => {
                        setShowForm(false);
                        onChanged?.();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {sorted.length === 0 ? (
                <div style={{ opacity: 0.8 }}>Поки що немає питань.</div>
            ) : (
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {sorted.map((q) => {
                        const isMine = currentUserId && q.user_id === currentUserId;
                        const isEditing = editingId === q.id;

                        return (
                            <div
                                key={q.id}
                                style={{ ...reviewCard, ...(isMine ? myReviewCard : null) }}
                            >
                                <div style={rowBetween}>
                                    <div style={{ fontWeight: 700 }}>
                                        ❓ Питання {isMine ? <span style={mineBadge}>моє</span> : null}
                                    </div>

                                    <div style={{ opacity: 0.7, fontSize: 12 }}>
                                        {q.created_date} {q.created_time}
                                    </div>
                                </div>

                                {!isEditing ? (
                                    <>
                                        <div style={{ opacity: 0.85, marginTop: 6 }}>
                                            {q.comment}
                                        </div>

                                        <div style={{ opacity: 0.6, marginTop: 8, fontSize: 12 }}>
                                            Автор: {q.userName}
                                        </div>

                                        {isMine && (
                                            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                                <button
                                                    onClick={() => startEdit(q)}
                                                    disabled={status !== STATUS.idle}
                                                    style={btnGhost}
                                                    type="button"
                                                >
                                                    Редагувати
                                                </button>

                                                <button
                                                    onClick={() => removeQuestion(q.id)}
                                                    disabled={status !== STATUS.idle}
                                                    style={btnDanger}
                                                    type="button"
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                                            <label style={label}>
                                                Питання
                                                <textarea
                                                    value={draft.comment}
                                                    onChange={(e) =>
                                                        setDraft((d) => ({ ...d, comment: e.target.value }))
                                                    }
                                                    rows={3}
                                                    style={textarea}
                                                    disabled={status !== STATUS.idle}
                                                />
                                            </label>
                                        </div>

                                        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                            <button
                                                onClick={() => saveEdit(q.id)}
                                                disabled={status !== STATUS.idle}
                                                style={btnPrimary}
                                                type="button"
                                            >
                                                {status === STATUS.saving ? "Збереження…" : "Зберегти"}
                                            </button>

                                            <button
                                                onClick={cancelEdit}
                                                disabled={status !== STATUS.idle}
                                                style={btnGhost}
                                                type="button"
                                            >
                                                Скасувати
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

const panel = {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.55)",
};

const panelTop = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
};

const rowBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
};

const reviewCard = {
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.25)",
};

const myReviewCard = {
    border: "1px solid rgba(124,58,237,0.35)",
    background:
        "radial-gradient(420px 160px at 20% 0%, rgba(124,58,237,.18), transparent 60%), rgba(2,6,23,0.28)",
};

const mineBadge = {
    marginLeft: 8,
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid rgba(124,58,237,0.35)",
    background: "rgba(124,58,237,0.14)",
    opacity: 0.95,
};


const label = {
    display: "grid",
    gap: 6,
    fontSize: 13,
    opacity: 0.95
};

const textarea = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    resize: "vertical",
};

const btnPrimary = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(124,58,237,.35)",
    background: "linear-gradient(135deg, rgba(124,58,237,.95), rgba(37,99,235,.85))",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
};

const btnGhost = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    cursor: "pointer",
};

const btnDanger = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.35)",
    background: "rgba(239, 68, 68, 0.12)",
    color: "white",
    cursor: "pointer",
};

const errorBox = {
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.10)",
    marginTop: 10,
    marginBottom: 10,
};

const writeBtn = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(37,99,235,0.5)",
    background: "rgba(37,99,235,0.85)",
    color: "white",
    cursor: "pointer",
};
