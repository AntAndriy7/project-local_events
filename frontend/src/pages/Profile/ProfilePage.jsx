import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import { clearAuth } from "../../features/auth/authStorage";
import { useProfile } from "../../features/users/hooks/useProfile";
import UserTicketsList from "../../features/tickets/components/UserTicketsList";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants.js"; // Якщо використовується

export default function ProfilePage() {
    const nav = useNavigate();
    const { user, loading, error, reload, update, changePassword } = useProfile();

    const [activeTab, setActiveTab] = useState("general");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [passFormData, setPassFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    if (loading) return <div style={fullPageCenter}>Завантаження...</div>;

    if (error || !user) return (
        <div style={fullPageCenter}>
            <div style={{ textAlign: 'center' }}>
                <p>❌ {error || "Користувача не знайдено"}</p>
                <button onClick={reload} style={editBtn}>Спробувати ще раз</button>
            </div>
        </div>
    );

    const avatar = user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.user_name || "U")}`;

    const changeTab = (tab) => {
        setActiveTab(tab);
        setIsEditing(false);
        setFormData({});
        setPassFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await update(formData);
        setIsSaving(false);
        if (res?.success) {
            setIsEditing(false);
            setFormData({});
        }
    };

    const handlePasswordChange = async () => {
        if (passFormData.newPassword !== passFormData.confirmPassword) return;

        setIsSaving(true);
        try {
            const res = await changePassword({
                oldPassword: passFormData.oldPassword,
                newPassword: passFormData.newPassword
            });
            if (res?.success) {
                alert("Пароль успішно оновлено!");
                setPassFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                alert(res?.error || "Помилка при зміні пароля");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main style={{ padding: "60px 0", minHeight: "85vh" }}>
            <Container>
                <div style={mainCard}>
                    {/* SIDEBAR */}
                    <aside style={sidebar}>
                        <div style={sidebarProfile}>
                            <img src={avatar} alt="avatar" style={avatarImg} />
                            <div style={{ marginTop: 12, fontWeight: 800, fontSize: 18 }}>{user.user_name}</div>
                            <div style={roleBadge}>{user.role?.replace("ROLE_", "") || "USER"}</div>
                        </div>

                        <nav style={sideNav}>
                            <div onClick={() => changeTab("general")} style={activeTab === "general" ? navItemActive : navItem}>👤 Профіль</div>
                            <div onClick={() => changeTab("tickets")} style={activeTab === "tickets" ? navItemActive : navItem}>🎟️ Мої квитки</div>
                            <div onClick={() => changeTab("history")} style={activeTab === "history" ? navItemActive : navItem}>🕰️ Історія</div>
                            <div onClick={() => changeTab("security")} style={activeTab === "security" ? navItemActive : navItem}>🔒 Безпека</div>
                        </nav>

                        <button onClick={() => { clearAuth(); nav("/"); }} style={logoutLink}>🚪 Вийти з системи</button>
                    </aside>

                    {/* CONTENT AREA */}
                    <section style={contentArea}>
                        {activeTab === "general" ? (
                            <div style={fadeAnim}>
                                <div style={contentHeader}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 26 }}>Основна інформація</h2>
                                        <p style={{ opacity: 0.5, margin: "4px 0 0" }}>Керуйте своїми публічними даними</p>
                                    </div>
                                    {!isEditing && (
                                        <button onClick={() => { setFormData({ ...user }); setIsEditing(true); }} style={editBtn}>Редагувати</button>
                                    )}
                                </div>

                                <div style={formGrid}>
                                    <InputGroup label="Ім'я користувача" name="user_name" val={isEditing ? formData.user_name : user.user_name} edit={isEditing} onChange={setFormData} />
                                    <InputGroup label="Електронна пошта" name="email" val={isEditing ? formData.email : user.email} edit={isEditing} onChange={setFormData} />
                                    <InputGroup label="Номер телефону" name="phone_number" val={isEditing ? formData.phone_number : user.phone_number} edit={isEditing} onChange={setFormData} />
                                    <InputGroup label="Ваш район" name="district" val={isEditing ? formData.district : user.district} edit={isEditing} onChange={setFormData} />
                                </div>

                                {isEditing && (
                                    <div style={saveActions}>
                                        <button onClick={handleSave} disabled={isSaving} style={saveBtn}>{isSaving ? "Збереження..." : "Зберегти зміни"}</button>
                                        <button onClick={handleCancel} style={cancelBtn}>Скасувати</button>
                                    </div>
                                )}

                                {!isEditing && (
                                    <div style={activitySection}>
                                        <h3 style={subTitle}>Детальна активність</h3>
                                        <div style={activityGrid}>
                                            <ActivityCard title="Організатор" count={user.events_created_count} label="створених подій" icon="🎨" color="#8b5cf6" />
                                            <ActivityCard title="Відвідувач" count={user.events_visited_count} label="завершених візитів" icon="⚡" color="#3b82f6" />
                                            <ActivityCard title="Квитки" count={user.tickets_purchased_count} label="активних замовлень" icon="🎟️" color="#10b981" />
                                            <ActivityCard title="Рейтинг" count={user.reviews_written_count} label="залишених відгуків" icon="⭐" color="#f59e0b" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === "tickets" ? (
                            <div style={fadeAnim}>
                                <div style={contentHeader}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 26 }}>Мої квитки</h2>
                                        <p style={{ opacity: 0.5, margin: "4px 0 0" }}>Активні та скасовані бронювання</p>
                                    </div>
                                </div>
                                <UserTicketsList filterType="active" />
                            </div>

                        ) : activeTab === "history" ? (
                            <div style={fadeAnim}>
                                <div style={contentHeader}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 26 }}>Історія відвідувань</h2>
                                        <p style={{ opacity: 0.5, margin: "4px 0 0" }}>Події, які вже відбулися</p>
                                    </div>
                                </div>
                                <UserTicketsList filterType="history" />
                            </div>

                        ) : (
                            <div style={fadeAnim}>
                                <div style={contentHeader}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 26 }}>Безпека акаунта</h2>
                                        <p style={{ opacity: 0.5, margin: "4px 0 0" }}>Зміна пароля та захист даних</p>
                                    </div>
                                </div>

                                <div style={securityBox}>
                                    <div style={{ maxWidth: 400 }}>
                                        <h4 style={{ margin: "0 0 20px" }}>Змінити пароль</h4>
                                        <div style={formGridSingle}>
                                            <InputGroup
                                                label="Поточний пароль"
                                                name="oldPassword"
                                                val={passFormData.oldPassword}
                                                edit={true}
                                                isPassword={true}
                                                onChange={setPassFormData}
                                            />
                                            <InputGroup
                                                label="Новий пароль"
                                                name="newPassword"
                                                val={passFormData.newPassword}
                                                edit={true}
                                                isPassword={true}
                                                onChange={setPassFormData}
                                            />
                                            <InputGroup
                                                label="Підтвердіть новий пароль"
                                                name="confirmPassword"
                                                val={passFormData.confirmPassword}
                                                edit={true}
                                                isPassword={true}
                                                onChange={setPassFormData}
                                                error={passFormData.confirmPassword && passFormData.newPassword !== passFormData.confirmPassword}
                                            />
                                            <p style={{ fontSize: 12, opacity: 0.5 }}>Пароль має містити не менше 6 символів</p>
                                        </div>

                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={isSaving || !passFormData.oldPassword || !passFormData.newPassword || passFormData.newPassword !== passFormData.confirmPassword}
                                            style={{
                                                ...saveBtn,
                                                opacity: (isSaving || !passFormData.oldPassword || !passFormData.newPassword || passFormData.newPassword !== passFormData.confirmPassword) ? 0.4 : 1
                                            }}
                                        >
                                            {isSaving ? "Оновлення..." : "Оновити пароль"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </Container>
        </main>
    );
}

function InputGroup({ label, name, val, edit, onChange, isPassword, error }) {
    return (
        <div style={group}>
            <label style={labelStyle}>{label}</label>
            {edit ? (
                <>
                    <input
                        type={isPassword ? "password" : "text"}
                        style={{
                            ...inputStyle,
                            borderColor: error ? "#ef4444" : "rgba(148, 163, 184, 0.12)"
                        }}
                        value={val || ""}
                        placeholder={isPassword ? "••••••••" : ""}
                        onChange={e => onChange(prev => ({ ...prev, [name]: e.target.value }))}
                    />
                    {error && <span style={{ fontSize: 11, color: "#ef4444", marginTop: -4 }}>Паролі не збігаються</span>}
                </>
            ) : (
                <div style={staticVal}>{val || "не вказано"}</div>
            )}
        </div>
    );
}

function ActivityCard({ title, count, label, icon, color }) {
    return (
        <div style={activityCard}>
            <div style={{ ...iconCircle, background: `${color}15`, color: color }}>{icon}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, opacity: 0.6, fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 24, fontWeight: 900, margin: "2px 0" }}>{count || 0}</div>
                <div style={{ fontSize: 12, opacity: 0.4 }}>{label}</div>
            </div>
        </div>
    );
}

const mainCard = {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.08)",
    overflow: "auto",
    backdropFilter: "blur(20px)",
    height: "750px",
    width: "100%",
    minWidth: "1000px",
};

const sidebar = {
    background: "rgba(0, 0, 0, 0.15)",
    padding: "40px 24px 34px 24px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(148, 163, 184, 0.08)"
};

const sidebarProfile = {
    textAlign: "center",
    marginBottom: 40
};

const avatarImg = {
    width: 90,
    height: 90,
    borderRadius: 24,
    objectFit: "cover",
    border: "2px solid rgba(124, 58, 237, 0.5)",
    padding: 4
};

const roleBadge = {
    display: "inline-block",
    marginTop: 8,
    padding: "4px 10px",
    background: "rgba(124, 58, 237, 0.1)",
    color: "#a78bfa",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase"
};

const sideNav = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flex: 1
};

const navItem = {
    padding: "14px 18px",
    borderRadius: 14,
    cursor: "pointer",
    opacity: 0.5,
    transition: "0.2s",
    fontWeight: 600
};

const navItemActive = {
    ...navItem,
    background: "rgba(124, 58, 237, 0.1)",
    color: "#a78bfa",
    opacity: 1
};

const contentArea = {
    padding: "40px 50px",
    display: "flex",
    flexDirection: "column",
    height: "100%"
};

const contentHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: 28
};

const formGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px 40px"
};

const formGridSingle = {
    display: "grid",
    gap: "20px",
    marginBottom: 20
};

const group = {
    display: "flex",
    flexDirection: "column",
    gap: 8
};

const labelStyle = {
    fontSize: 12,
    opacity: 0.4,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5
};

const staticVal = {
    fontSize: 17,
    fontWeight: 500,
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
};

const inputStyle = {
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "white",
    fontSize: 16,
    outline: "none",
    transition: "border-color 0.2s"
};

const editBtn = {
    background: "rgba(124, 58, 237, 0.1)",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    color: "#a78bfa",
    padding: "10px 20px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700
};

const saveBtn = {
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    border: "none",
    color: "white",
    padding: "14px 28px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 800,
    boxShadow: "0 10px 20px rgba(124, 58, 237, 0.2)"
};

const cancelBtn = {
    background: "none",
    border: "none",
    color: "white",
    opacity: 0.4,
    cursor: "pointer",
    fontWeight: 600
};

const saveActions = {
    marginTop: 40,
    display: "flex",
    gap: 15,
    alignItems: "center"
};

const activitySection = {
    marginTop: 50,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 30
};

const subTitle = {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 25,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 800
};

const activityGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20
};

const activityCard = {
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    gap: 20,
    alignItems: "center"
};

const iconCircle = {
    width: 50,
    height: 50,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24
};

const securityBox = {
    background: "rgba(255,255,255,0.02)",
    padding: 30,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.05)"
};

const logoutLink = {
    background: "none",
    border: "none",
    color: "#f87171",
    textAlign: "left",
    padding: "14px 18px",
    cursor: "pointer",
    opacity: 0.7,
    fontWeight: 600,
    marginTop: "auto"
};

const fullPageCenter = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    color: "white",
    fontSize: 18
};

const fadeAnim = {
    animation: "fadeIn 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    flex: 1
};
