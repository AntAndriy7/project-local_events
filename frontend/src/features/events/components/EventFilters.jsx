import DateRangePicker from "../../../components/ui/DateRangePicker.jsx";
import CustomSelect from "../../../components/ui/CustomSelect.jsx";
import {useMemo} from "react";

export default function EventFilters({ value, onChange, categories = [], districts = [] }) {
    function set(key, v) {
        onChange((prev) => ({ ...prev, [key]: v }));
    }

    function setDates({ dateFrom, dateTo }) {
        onChange((prev) => ({ ...prev, dateFrom, dateTo }));
    }

    const categoryOptions = useMemo(() =>
            categories.map((c) => ({ value: String(c.id), label: c.name })),
        [categories]);

    const districtOptions = useMemo(() =>
            districts.map((d) => ({ value: String(d.id), label: d.name })),
        [districts]);

    return (
        <div style={wrap} className="filters-wrap">
            <input
                placeholder="Пошук події…"
                value={value.q}
                onChange={(e) => set("q", e.target.value)}
                style={input}
            />

            <CustomSelect
                value={value.categoryId}
                onChange={(v) => set("categoryId", v)}
                options={categoryOptions}
                isClearable={true}
                placeholder="Усі категорії"
            />

            <CustomSelect
                value={value.districtId}
                onChange={(v) => set("districtId", v)}
                options={districtOptions}
                isClearable={true}
                placeholder="Усі райони"
            />

            <DateRangePicker
                dateFrom={value.dateFrom}
                dateTo={value.dateTo}
                onChange={setDates}
            />
        </div>
    );
}

const wrap = {
    display: "grid",
    gap: 10,
};

const input = {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
};
