import { useMemo, useState } from "react";
import { getUser } from "../../auth/authStorage";
import { deleteReview } from "../api/reviewsApi";
import AddQuestionForm from "./AddQuestionForm";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import dotsIcon from "../../../assets/dots.svg";

function formatDateShort(dateString) {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(date);
    } catch {
        return dateString;
    }
}

function getRepliesWord(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "відповідь";
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "відповіді";
    return "відповідей";
}

export default function QuestionsSection({ reviews = [], eventId, onChanged }) {
    const currentUser = getUser();
    const currentUserId = currentUser?.id ?? null;

    const [error, setError] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [expandedIds, setExpandedIds] = useState(new Set());

    const [openMenuId, setOpenMenuId] = useState(null);

    const mainQuestions = useMemo(() => {
        const questions = reviews.filter((r) => (r.rating === null || r.rating === 0) && r.parentId === null);

        const toMs = (r) => {
            const ms = new Date(`${r.createdDate}T${r.createdTime || "00:00:00"}`).getTime();
            return Number.isFinite(ms) ? ms : 0;
        };

        return questions.sort((a, b) => {
            const aMine = currentUserId && a.userId === currentUserId;
            const bMine = currentUserId && b.userId === currentUserId;
            if (aMine !== bMine) return aMine ? -1 : 1;
            return toMs(b) - toMs(a);
        });
    }, [reviews, currentUserId]);

    const repliesByParent = useMemo(() => {
        const replies = reviews.filter((r) => (r.rating === null || r.rating === 0) && r.parentId !== null);
        const grouped = {};

        replies.forEach(r => {
            if (!grouped[r.parentId]) grouped[r.parentId] = [];
            grouped[r.parentId].push(r);
        });

        for (const key in grouped) {
            grouped[key].sort((a, b) => {
                const aTime = new Date(`${a.createdDate}T${a.createdTime || "00:00:00"}`).getTime();
                const bTime = new Date(`${b.createdDate}T${b.createdTime || "00:00:00"}`).getTime();
                return aTime - bTime;
            });
        }
        return grouped;
    }, [reviews]);

    async function proceedDelete() {
        if (!questionToDelete) return;
        const id = questionToDelete;
        setQuestionToDelete(null);
        setError("");

        try {
            await deleteReview(id);
            await onChanged?.();
        } catch (e) {
            setError(e.message || "Не вдалося видалити");
        }
    }

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const renderActionsMenu = (item, parentId) => {
        if (!currentUserId) return null;

        const isMine = item.userId === currentUserId;
        const isOpen = openMenuId === item.id;

        return (
            <div style={{ position: "relative" }}>
                <button
                    onClick={() => setOpenMenuId(isOpen ? null : item.id)}
                    style={menuTriggerBtn}
                    type="button"
                    title="Дії"
                >
                    <img src={dotsIcon} alt="Дії" width="20" height="20" style={{ filter: "brightness(0) invert(1)" }} />
                </button>

                {isOpen && (
                    <div style={dropdownMenu}>
                        <button
                            onClick={() => {
                                setReplyingTo({
                                    parentId: parentId || item.id,
                                    replyToId: item.id,
                                    userName: item.userName
                                });
                                if (parentId && !expandedIds.has(parentId)) toggleExpand(parentId);
                                if (!parentId && !expandedIds.has(item.id)) toggleExpand(item.id);
                                setOpenMenuId(null);
                            }}
                            style={dropdownItem}
                            type="button"
                        >
                            Відповісти
                        </button>

                        {isMine && (
                            <button
                                onClick={() => {
                                    setQuestionToDelete(item.id);
                                    setOpenMenuId(null);
                                }}
                                style={{ ...dropdownItem, color: "#ef4444" }}
                                type="button"
                            >
                                Видалити
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section style={panel}>
            <div style={panelTop}>
                <h3 style={titleStyle}>
                    Питання <span style={counterBadge}>{mainQuestions.length}</span>
                </h3>
            </div>

            {error && <div style={errorBox}>Помилка: {error}</div>}

            {currentUserId && (
                <div style={{ marginBottom: 32 }}>
                    <AddQuestionForm
                        eventId={eventId}
                        currentUser={currentUser}
                        onCreated={() => onChanged?.()}
                    />
                </div>
            )}

            {mainQuestions.length === 0 ? (
                <div style={emptyState}>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>💬</div>
                    <div>Поки що немає питань. Задайте перше!</div>
                </div>
            ) : (
                <div style={questionsList}>
                    {mainQuestions.map((q) => {
                        const isMine = currentUserId && q.userId === currentUserId;
                        const qReplies = repliesByParent[q.id] || [];
                        const isExpanded = expandedIds.has(q.id);

                        return (
                            <div key={q.id} style={reviewCard}>

                                <div style={rowBetween}>
                                    <div style={authorInfo}>
                                        <div style={authorAvatar}>{q.userName?.charAt(0)?.toUpperCase() || "?"}</div>
                                        <div>
                                            <div style={authorName}>
                                                {q.userName} {isMine && <span style={mineBadge}>Ви</span>}
                                            </div>
                                            <div style={timestamp}>{formatDateShort(q.createdDate)}</div>
                                        </div>
                                    </div>
                                    {renderActionsMenu(q, q.id)}
                                </div>

                                <div style={commentText}>{q.comment}</div>

                                {qReplies.length > 0 && (
                                    <button onClick={() => toggleExpand(q.id)} style={expandBtn}>
                                        <svg
                                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                        <span>
                                            {isExpanded
                                                ? "Сховати відповіді"
                                                : `Показати ${qReplies.length} ${getRepliesWord(qReplies.length)}`}
                                        </span>
                                    </button>
                                )}

                                {replyingTo?.replyToId === q.id && (
                                    <div style={{ marginTop: 16 }}>
                                        <AddQuestionForm
                                            eventId={eventId}
                                            currentUser={currentUser}
                                            parentId={replyingTo.parentId}
                                            replyToId={replyingTo.replyToId}
                                            replyToUserName={replyingTo.userName}
                                            onCreated={() => { setReplyingTo(null); onChanged?.(); }}
                                            onCancel={() => setReplyingTo(null)}
                                        />
                                    </div>
                                )}

                                {isExpanded && qReplies.length > 0 && (
                                    <div style={repliesContainer}>
                                        {qReplies.map(reply => {
                                            const mentionName = reply.replyToUserName || reply.reply_to_user_name;

                                            return (
                                                <div key={reply.id} style={replyCard}>
                                                    <div style={rowBetween}>
                                                        <div style={authorInfo}>
                                                            <div style={{...authorAvatar, width: 28, height: 28, fontSize: 12}}>
                                                                {reply.userName?.charAt(0)?.toUpperCase() || "?"}
                                                            </div>
                                                            <div>
                                                                <div style={{...authorName, fontSize: 13}}>
                                                                    {reply.userName} {reply.userId === currentUserId && <span style={mineBadge}>Ви</span>}
                                                                </div>
                                                                <div style={timestamp}>{formatDateShort(reply.createdDate)}</div>
                                                            </div>
                                                        </div>
                                                        {renderActionsMenu(reply, q.id)}
                                                    </div>

                                                    <div style={{...commentText, fontSize: 14}}>
                                                        {mentionName && (
                                                            <span style={mention}>@{mentionName} </span>
                                                        )}
                                                        {reply.comment}
                                                    </div>

                                                    {replyingTo?.replyToId === reply.id && (
                                                        <div style={{ marginTop: 12 }}>
                                                            <AddQuestionForm
                                                                eventId={eventId}
                                                                currentUser={currentUser}
                                                                parentId={replyingTo.parentId}
                                                                replyToId={replyingTo.replyToId}
                                                                replyToUserName={replyingTo.userName}
                                                                onCreated={() => { setReplyingTo(null); onChanged?.(); }}
                                                                onCancel={() => setReplyingTo(null)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                isOpen={questionToDelete !== null}
                icon="🗑️"
                title="Видалити?"
                text="Цю дію не можна буде скасувати."
                confirmText="Видалити"
                onConfirm={proceedDelete}
                onCancel={() => setQuestionToDelete(null)}
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

const errorBox = {
    padding: 16,
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
    marginBottom: 20,
    fontSize: 14,
};

const menuTriggerBtn = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s ease"
};

const dropdownMenu = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 4,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    minWidth: 140,
    padding: "6px 0",
    zIndex: 10,
};

const dropdownItem = {
    background: "transparent",
    border: "none",
    color: "#e2e8f0",
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
    transition: "background 0.2s ease"
};

const expandBtn = {
    background: "transparent",
    border: "none",
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "opacity 0.2s ease"
};

const repliesContainer = {
    marginLeft: 18,
    paddingLeft: 16,
    borderLeft: "2px solid rgba(255,255,255,0.1)",
    marginTop: 16,
    display: "grid",
    gap: 24
};

const replyCard = {
    background: "transparent",
    padding: "2px 0",
};

const mention = {
    color: "#60a5fa",
    fontWeight: 600
};