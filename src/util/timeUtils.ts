import dayjs from "dayjs";

export const getTimeDifference = (createdAt: string): string => {
    const now = dayjs();
    const createdTime = dayjs(createdAt);
    const diffInMinutes = now.diff(createdTime, "minute");
    const diffInHours = now.diff(createdTime, "hour");
    const diffInDays = now.diff(createdTime, "day");

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${diffInDays}일 전`;
};