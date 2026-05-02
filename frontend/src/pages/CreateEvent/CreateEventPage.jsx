import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import { createEvent } from "../../features/events/api/eventsApi";
import { useMeta } from "../../features/meta/hooks/useMeta";
import { uploadToCloudinary } from "../../lib/uploadImage";
import EventCardPreview from "../../features/events/components/EventCardPreview";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants.js";
import CustomSelect from "../../components/ui/CustomSelect.jsx";
import CustomDateTimePicker from "../../components/ui/CustomDateTimePicker.jsx";

export default function CreateEventPage() {
    const nav = useNavigate();
    const { categories, districts, loading: metaLoading, error: metaError } = useMeta();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(DEFAULT_EVENT_IMAGE);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDateTime, setEventDateTime] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [capacity, setCapacity] = useState(50);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const categoryOptions = useMemo(() =>
            categories.map(c => ({ value: String(c.id), label: c.name })),
        [categories]);

    const districtOptions = useMemo(() =>
            districts.map(d => ({ value: String(d.id), label: d.name })),
        [districts]);

    const canSubmit = useMemo(() => {
        return (
            title.trim() &&
            categoryId &&
            districtId &&
            eventDateTime &&
            !loading &&
            !metaLoading
        );
    }, [title, categoryId, districtId, eventDateTime, loading, metaLoading]);

    const previewEvent = useMemo(() => {
        const category = categories.find(c => c.id === Number(categoryId));
        const district = districts.find(d => d.id === Number(districtId));

        const previewDate = eventDateTime ? eventDateTime.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA');
        const previewTime = eventDateTime ? eventDateTime.toTimeString().split(' ')[0] : "18:00:00";

        return {
            id: "preview",
            title: title || "Назва події",
            description: description || "",
            date: previewDate,
            time: previewTime,
            imageUrl: imagePreview,
            capacity: Number(capacity) || 50,
            occupied_seats: 0,
            categoryName: category?.name,
            category_id: categoryId,
            districtName: district?.name,
            district_id: districtId,
        };
    }, [title, description, eventDateTime, imagePreview, capacity, categoryId, districtId, categories, districts]);

    function onImageSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return setError("Фото не може бути більше 5 MB");
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Дозволені лише JPG, PNG або WEBP");

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            if (img.width < 600 || img.height < 400) return setError("Мінімальна роздільна здатність 600×400");
            setImageFile(file);
            setImagePreview(img.src);
            setError("");
        };
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        if (!canSubmit) return setError("Заповни всі обов'язкові поля.");

        setLoading(true);
        try {
            let imageUrl = DEFAULT_EVENT_IMAGE;
            if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

            const formattedDate = eventDateTime.toLocaleDateString('en-CA');
            const formattedTime = eventDateTime.toTimeString().split(' ')[0];

            const dto = {
                title: title.trim(),
                description: description.trim() || null,
                date: formattedDate,
                time: formattedTime,
                category_id: Number(categoryId),
                district_id: Number(districtId),
                capacity: Number(capacity),
                occupied_seats: 0,
                imageUrl,
            };

            const created = await createEvent(dto);
            nav(`/events/${created.id}`);
        } catch (e2) {
            setError(e2.message || "Помилка створення події");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={mainStyle}>
            <Container>
                <div style={headerStyle}>
                    <h1 style={h1Style}>✨ Створити подію</h1>
                    <p style={subtitleStyle}>Заповни форму нижче, щоб створити нову подію для спільноти</p>
                </div>

                <div style={layoutStyle}>
                    <div style={formSectionStyle}>
                        {(metaError || error) && (
                            <div style={errorBoxStyle}>❌ {metaError || error}</div>
                        )}

                        <form onSubmit={onSubmit} style={formStyle}>
                            <div style={sectionStyle}>
                                <h3 style={sectionTitleStyle}>📸 Візуалізація</h3>
                                <label style={dropZoneStyle}>
                                    <span style={{ fontSize: "40px" }}>🖼️</span>
                                    <span style={labelTextStyle}>Натисніть або перетягніть фото</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={onImageSelect}
                                        style={{ display: "none" }}
                                    />
                                    <div style={hintStyle}>PNG, JPG до 5 MB (мінімум 600×400px)</div>
                                    {imageFile && <div style={{ color: "#10b981", fontSize: "12px" }}>✅ {imageFile.name} завантажено</div>}
                                </label>
                            </div>

                            <div style={sectionStyle}>
                                <h3 style={sectionTitleStyle}>📝 Основна інформація</h3>
                                <label style={labelStyle}>
                                    <span style={labelTextStyle}>Назва події *</span>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад: Концерт на свіжому повітрі" style={inputStyle} maxLength={100} />
                                </label>
                                <label style={labelStyle}>
                                    <span style={labelTextStyle}>Опис</span>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Розкажи детальніше..." style={textareaStyle} maxLength={500} />
                                </label>
                            </div>

                            <div style={sectionStyle}>
                                <h3 style={sectionTitleStyle}>🏷️ Категорія та локація</h3>

                                <label style={labelStyle}>
                                    <span style={labelTextStyle}>Категорія *</span>
                                    <CustomSelect
                                        value={categoryId}
                                        onChange={setCategoryId}
                                        options={categoryOptions}
                                        placeholder={metaLoading ? "Завантаження..." : "Обери категорію"}
                                        disabled={metaLoading}
                                        isClearable={true}
                                    />
                                </label>

                                <label style={labelStyle}>
                                    <span style={labelTextStyle}>Район *</span>
                                    <CustomSelect
                                        value={districtId}
                                        onChange={setDistrictId}
                                        options={districtOptions}
                                        placeholder={metaLoading ? "Завантаження..." : "Обери район"}
                                        disabled={metaLoading}
                                        isClearable={true}
                                    />
                                </label>
                            </div>

                            <div style={sectionStyle}>
                                <h3 style={sectionTitleStyle}>📅 Дата та час</h3>
                                <div style={labelStyle}>
                                    <span style={labelTextStyle}>Коли відбудеться подія? *</span>
                                    <CustomDateTimePicker
                                        selectedDate={eventDateTime}
                                        onChange={setEventDateTime}
                                    />
                                </div>
                            </div>

                            <div style={sectionStyle}>
                                <h3 style={sectionTitleStyle}>👥 Місткість</h3>
                                <label style={labelStyle}>
                                    <span style={labelTextStyle}>Кількість місць *</span>
                                    <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} style={inputStyle} />
                                </label>
                            </div>

                            <button disabled={!canSubmit} style={canSubmit ? btnStyle : btnDisabledStyle} type="submit">
                                {loading ? "⏳ Створення..." : "✨ Створити подію"}
                            </button>
                        </form>
                    </div>

                    <div style={previewSectionStyle}>
                        <h3 style={previewTitleStyle}>Попередній перегляд</h3>
                        <div style={previewCardWrapStyle}>
                            <EventCardPreview event={previewEvent} />
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}

const mainStyle = {
    padding: "40px 0 80px",
    minHeight: "100vh",
};

const headerStyle = {
    marginBottom: 40,
    textAlign: "center",
};

const h1Style = {
    margin: 0,
    fontSize: 36,
    fontWeight: 900,
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

const subtitleStyle = {
    marginTop: 12,
    fontSize: 15,
    opacity: 0.7,
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
};

const layoutStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: 40,
    alignItems: "start",
};

const formSectionStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
};

const previewSectionStyle = {
    width: "100%",
    position: "sticky",
    top: 100,
};

const previewTitleStyle = {
    margin: "0 0 8px",
    fontSize: 18,
    fontWeight: 700,
};

const previewCardWrapStyle = {
    maxWidth: 400,
};

const errorBoxStyle = {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,0.3)",
    background: "rgba(239,68,68,0.1)",
    color: "#fca5a5",
    marginBottom: 20,
    fontSize: 14,
};

const formStyle = {
    display: "grid",
    gap: 24,
};

const sectionStyle = {
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid rgba(148,163,184,.15)",
    background: "rgba(15,23,42,.4)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    display: "grid",
    gap: "20px",
};

const sectionTitleStyle = {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    opacity: 0.95,
};

const labelStyle = {
    display: "grid",
    gap: 8,
};

const labelTextStyle = {
    fontSize: 14,
    fontWeight: 600,
    opacity: 0.9,
};

const inputStyle = {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.2)",
    background: "rgba(255,255,255,.05)",
    color: "white",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
};

const dropZoneStyle = {
    border: "2px dashed rgba(139, 92, 246, 0.4)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(139, 92, 246, 0.05)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
};

const textareaStyle = {
    ...inputStyle,
    minHeight: 120,
    resize: "vertical",
    fontFamily: "inherit",
};

const hintStyle = {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
};

const btnStyle = {
    padding: "16px 32px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "800",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginTop: "20px",
    boxShadow: "0 10px 20px -10px rgba(139, 92, 246, 0.5)",
};

const btnDisabledStyle = {
    ...btnStyle,
    opacity: 0.5,
    cursor: "not-allowed",
    background: "rgba(100,100,100,0.3)",
};
