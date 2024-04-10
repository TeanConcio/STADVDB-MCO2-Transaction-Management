// Import Modules
import { createApp } from "vue";
import { createPinia } from "pinia";

// Import Components
import App from "./App.vue"; // Main App Component
import router from "./router/router.js"; // Router
import axios from "./services/Api.js"; // Axios Client
import "./assets/main.css";

// Create Vue Instance
const app = createApp(App);

// env Variables
const server_url = import.meta.env.VITE_SERVER_URL + "/API";

// Create Pinia Global State and Router
app.use(createPinia());
app.use(router);
app.use(axios, {
    baseUrl: server_url,
});

// Mount Vue Instance
app.mount("#app");
