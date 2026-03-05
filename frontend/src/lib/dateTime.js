export function formatDateUA(yyyyMmDd) {
    if (!yyyyMmDd) return "";
    const [y, m, d] = yyyyMmDd.split("-");
    return `${d}.${m}.${y}`;
}

export function formatTimeHHmm(hhmmss) {
    if (!hhmmss) return "";
    return hhmmss.slice(0, 5); // "18:30"
}
