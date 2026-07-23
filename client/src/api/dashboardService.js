import api from "./axiosInstance";

export const getDashboardSummary = async () => {
    const { data } = await api.get("/dashboard/summary");
    return data;
};