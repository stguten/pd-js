import axios from "axios";

const pixeldrain = axios.create({
    baseURL: "https://pixeldrain.com/api",
    headers: {
        "User-Agent": "StGuten/Ecosystem/1.0 (Axios/1.7.4; @stguten/pd-js/1.2.0)"
    }
});

export default pixeldrain;