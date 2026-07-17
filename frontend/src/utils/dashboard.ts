import {TFunction} from "i18next";

export const OVERDUE_HOURS = 48;

export const plural = (n: number, one: string, few: string, many: string): string => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
};

export const fmtTime = (d: Date) =>
    d.toLocaleTimeString("ru-RU", {hour: "2-digit", minute: "2-digit"});

export const dayLabel = (d: Date, t: (k: string) => string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((day.getTime() - today.getTime()) / 864e5);
    if (diff === 0) return t("today");
    if (diff === 1) return t("tomorrow");
    return d.toLocaleDateString("ru-RU", {day: "numeric", month: "short"}).replace(".", "");
};

export const waitedText = (
    from: Date,
    t: TFunction
): string => {
    const hrs = Math.floor((Date.now() - from.getTime()) / 36e5);

    if (hrs < 1) {
        return t("less_than_hour");
    }

    if (hrs < 24) {
        return t("hours", {count: hrs});
    }

    const days = Math.floor(hrs / 24);

    return t("days", {count: days});
};

export const untilText = (
    to: Date,
    t: TFunction
): string | null => {
    const min = Math.round((to.getTime() - Date.now()) / 6e4);

    if (min < 0) return null;

    if (min < 60) {
        return t("in_minutes", { count: min });
    }

    const hrs = Math.round(min / 60);

    if (hrs < 24) {
        return t("in_hours", { count: hrs });
    }

    return null;
}

export const extract = (r: any): { list: any[]; count: number } => {
    const list = r?.results || r?.data || (Array.isArray(r) ? r : []);
    return {list: Array.isArray(list) ? list : [], count: r?.count ?? r?.total ?? list.length};
};