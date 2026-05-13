import { useMemo } from "react";
import DateRangePicker from "../../../components/ui/DateRangePicker.jsx";
import CustomSelect from "../../../components/ui/CustomSelect.jsx";
import CustomField from "../../../components/ui/CustomField.jsx";

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
            <CustomField
                label="Пошук події…"
                value={value.q || ""}
                onChange={(e) => set("q", e.target.value)}
            />

            <CustomSelect
                label="Усі категорії"
                value={value.categoryId}
                onChange={(v) => set("categoryId", v)}
                options={categoryOptions}
                isClearable={true}
            />

            <CustomSelect
                label="Усі райони"
                value={value.districtId}
                onChange={(v) => set("districtId", v)}
                options={districtOptions}
                isClearable={true}
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
