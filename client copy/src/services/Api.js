// Import Modules
import axios from "axios";

// Create Axios Client
export default {
    install: (app, options) => {
        app.config.globalProperties.$axios = axios.create({
            baseURL: options.baseUrl,
        });
    },
};
