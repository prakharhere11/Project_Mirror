import api from "./axiosInstance";

export const getAllJournals = async () => {
    const { data } = await api.get("/journals");
    return data;
};

export const createJournal = async (journalData) => {
    const { data } = await api.post("/journals", journalData);
    return data;
};

export const getJournalById = async (id) => {
    const { data } = await api.get(`/journals/${id}`);
    return data;
};

export const updateJournal = async (id, journalData) => {
    const { data } = await api.put(`/journals/${id}`, journalData);
    return data;
};

export const deleteJournal = async (id) => {
    const { data } = await api.delete(`/journals/${id}`);
    return data;
};