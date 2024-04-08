<template>
    <div id="app">
        <Navbar />

        <!-- Routed Page Goes Here -->
        <body>
            <router-view></router-view>
        </body>

        <Footer />
    </div>
</template>

<script setup>
// Import Components
import Navbar from "./components/common/Navbar.vue";
import Footer from "./components/common/Footer.vue";
import { useCredentialsStore } from "./store/store";

const store = useCredentialsStore();
//Init store with local storage information
store.init();
</script>

<script>
export default {
    beforeCreate() {
        const store = useCredentialsStore();
        if (store.token) {
            this.$axios.defaults.headers["Authorization"] = `Bearer ${store.token}`;
        }
    },
};
</script>
