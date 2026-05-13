import axios from "axios";

const api = axios.create({
    baseURL: "proud-truth-production.up.railway.app/api",
});

export default api;