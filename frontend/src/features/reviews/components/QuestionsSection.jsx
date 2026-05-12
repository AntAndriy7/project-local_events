import { useMemo, useState } from "react";
import { getUser } from "../../auth/authStorage";
import { deleteReview } from "../api/reviewsApi";
import AddQuestionForm from "./AddQuestionForm";
import ConfirmModal from "../../../components/ui/ConfirmModal";

function formatDateShort(dateString) {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(date);
    } catch {
        return dateString;
    }
}

export default function QuestionsSection({ reviews = [], eventId, onChanged }) {
    const currentUserId = getUser()?.id ?? null;
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    const [questionToDelete, setQuestionToDelete] = useState(null);

    const questions = useMemo(() => {
        return reviews.filter((r) => r.rating === null || r.rating === 0);
    }, [reviews]);

    const sorted = useMemo(() => {
        const toMs = (r) => {
            const d = r?.createdDate;
            const t = r?.createdTime || "00:00:00";
            const ms = new Date(`${d}T${t}`).getTime();
            return Number.isFinite(ms) ? ms : 0;
        };

        return [...questions].sort((a, b) => {
            const aMine = currentUserId && a.userId === currentUserId;
            const bMine = currentUserId && b.userId === currentUserId;
            if (aMine !== bMine) return aMine ? -1 : 1;
            return toMs(b) - toMs(a);
        });
    }, [questions, currentUserId]);

    function confirmDelete(id) { setQuestionToDelete(id); }
    function cancelDelete() { setQuestionToDelete(null); }

    async function proceedDelete() {
        if (!questionToDelete) return;
        const id = questionToDelete;
        setQuestionToDelete(null);
        setError("");

        try {
            await deleteReview(id);
            await onChanged?.();
        } catch (e) {
            setError(e.message || "Не вдалося видалити питання");
        }
    }

    return (
        <section style={panel}>
            <div style={panelTop}>
                <h3 style={titleStyle}>
                    Питання <span style={counterBadge}>{sorted.length}</span>
                </h3>

                {!showForm && currentUserId && (
                    <button onClick={() => setShowForm(true)} style={writeBtn}>
                        Задати питання
                    </button>
                )}
            </div>

            {error && <div style={errorBox}>Помилка: {error}</div>}

            {showForm && currentUserId && (
                <div style={formWrapper}>
                    <AddQuestionForm
                        eventId={eventId}
                        onCreated={() => {
                            setShowForm(false);
                            onChanged?.();
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {sorted.length === 0 ? (
                !showForm && (
                    <div style={emptyState}>
                        <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>💬</div>
                        <div>Поки що немає питань. Задайте перше!</div>
                    </div>
                )
            ) : (
                <div style={questionsList}>
                    {sorted.map((q) => {
                        const isMine = currentUserId && q.userId === currentUserId;

                        return (
                            <div key={q.id} style={{ ...reviewCard, ...(isMine ? myReviewCard : null) }}>

                                <div style={rowBetween}>
                                    <div style={authorInfo}>
                                        <div style={authorAvatar}>
                                            {q.userName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <div style={authorName}>
                                                {q.userName}
                                                {isMine && <span style={mineBadge}>Ви</span>}
                                            </div>
                                            <div style={timestamp}>
                                                {formatDateShort(q.createdDate)}
                                            </div>
                                        </div>
                                    </div>

                                    {isMine && (
                                        <button
                                            onClick={() => confirmDelete(q.id)}
                                            style={iconBtnDanger}
                                            title="Видалити питання"
                                            type="button"
                                        >
                                            🗑️
                                        </button>
                                    )}

                                </div>

                                <div style={commentText}>{q.comment}</div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                isOpen={questionToDelete !== null}
                icon="🗑️"
                title="Видалити питання?"
                text="Цю дію не можна буде скасувати. Ваше питання буде назавжди видалене."
                confirmText="Видалити"
                onConfirm={proceedDelete}
                onCancel={cancelDelete}
            />
        </section>
    );
}

const panel = {
    marginTop: 24,
    padding: 32,
    borderRadius: 24,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(15, 23, 42, 0.4)",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
};

const panelTop = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
};

const titleStyle = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#f8fafc",
};

const counterBadge = {
    background: "rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 700,
};

const rowBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
};

const authorInfo = {
    display: "flex",
    alignItems: "center",
    gap: 12,
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
};

const authorName = {
    fontWeight: 600,
    fontSize: 14,
    color: "#f8fafc",
    display: "flex",
    alignItems: "center",
    gap: 8,
};

const timestamp = {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
};

const iconBtnDanger = {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    fontSize: 14,
    cursor: "pointer",
    padding: "6px",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
};

const emptyState = {
    textAlign: "center",
    padding: "16px 0 8px",
    color: "#94a3b8",
};

const questionsList = {
    display: "grid",
    gap: 16,
};

const reviewCard = {
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.06)",
    background: "rgba(30, 41, 59, 0.3)",
};

const myReviewCard = {
    border: "1px solid rgba(99, 102, 241, 0.3)",
    background: "rgba(79, 70, 229, 0.05)",
};

const mineBadge = {
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 11,
    background: "rgba(99, 102, 241, 0.2)",
    color: "#818cf8",
    fontWeight: 700,
    textTransform: "uppercase",
};

const commentText = {
    color: "#e2e8f0",
    lineHeight: 1.6,
    fontSize: 15,
    marginTop: 4,
};

const formWrapper = {
    padding: 20,
    borderRadius: 16,
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: 20,
};

const writeBtn = {
    padding: "8px 20px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
};

const errorBox = {
    padding: 16,
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
    marginBottom: 20,
    fontSize: 14,
};