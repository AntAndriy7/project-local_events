export default function ConfirmModal({
                                         isOpen,
                                         title,
                                         text,
                                         onConfirm,
                                         onCancel,
                                         confirmText = "Підтвердити",
                                         cancelText = "Скасувати",
                                         icon = "⚠️"
                                     }) {
    if (!isOpen) return null;

    return (
        <div style={modalOverlay}>
            <div style={modalContent}>
                <div style={modalIcon}>{icon}</div>
                <h4 style={modalTitle}>{title}</h4>
                <p style={modalText}>{text}</p>

                <div style={modalActions}>
                    <button onClick={onCancel} style={ghostBtn}>
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} style={dangerBtn}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(2, 6, 23, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
};

const modalContent = {
    width: "90%",
    maxWidth: 400,
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
};

const modalIcon = {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.9,
};

const modalTitle = {
    margin: "0 0 12px",
    fontSize: 20,
    fontWeight: 800,
    color: "#f8fafc",
};

const modalText = {
    margin: "0 0 32px",
    fontSize: 15,
    color: "#94a3b8",
    lineHeight: 1.5,
};

const modalActions = {
    display: "flex",
    gap: 12,
    justifyContent: "center",
};

const ghostBtn = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#e2e8f0",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s ease",
};

const dangerBtn = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
};