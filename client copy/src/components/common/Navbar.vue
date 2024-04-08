<script setup>
// Store
import { useCredentialsStore } from "../../store/store";
// Components
import PromptPopup from "./PromptPopup.vue";
// Router
import { useRouter } from 'vue-router';
</script>

<template>
    <nav class="bg-white md:max-p-4 fixed w-full z-50 top-0 left-0 border-b border-gray-200">
        <div class="w-screen flex flex-wrap items-center justify-between mx-auto p-4">
            <div class="flex items-center justify order-first">
                <router-link to="/" class="flex items-center">
                    <img src="https://i.imgur.com/yCabNBZ.png" class="h-8 mr-3" alt="MMP Logo" />
                    <span
                        class="hidden self-center text-2xl font-semibold whitespace-nowrap text-logo md:block"
                        >Mission Ministries Philippines</span
                    >
                    <span
                        class="block self-center text-2xl font-semibold whitespace-nowrap dark:text-logo md:hidden text-logo"
                        >MMP</span
                    >
                </router-link>
                </div>
                <div v-if="store.isLoggedIn" class="md:hidden block">
                    <button
                        @click="redirectProfile()"
                        class="block py-2 pl-3 pr-4 font-semibold text-gray-900 rounded hover:bg-gray-100 hover:underline md:hover:bg-transparent md:hover:text-highlight_hover md:p-0"
                        :class="{
                            'text-highlight': ['admin', 'teacher', 'student'].includes(
                                $route.name
                            ),
                        }"
                    >
                        Profile
                    </button>
                </div>
                <div class="flex order-last">
                    <router-link v-if="!store.isLoggedIn" to="/login">
                        <button
                            type="button"
                            class="text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Login
                        </button>
                    </router-link>
                    <button
                        v-else
                        @click="currentPopup = 'confirmation'"
                        type="button"
                        class="text-white bg-highlight hover:bg-highlight-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Logout
                    </button>

                </div>
            <div
                class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 order-none xl:mr-72"
                id="navbar-sticky"
            >
                <ul
                    class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-500 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
                >
                    <li>
                        <router-link
                            to="/"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:underline md:hover:bg-transparent md:hover:text-highlight_hover md:p-0"
                            :class="{ 'md:text-highlight': $route.name === 'index' }"
                            aria-current="page"
                        >
                            Home
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            to="/contact"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:underline md:hover:bg-transparent md:hover:text-highlight_hover md:p-0"
                            :class="{ 'md:text-highlight': $route.name === 'contact' }"
                            aria-current="page"
                        >
                            Contact Us
                        </router-link>
                    </li>
                    <li v-if="!store.isLoggedIn">
                        <router-link
                            to="/student/signup"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:underline md:hover:bg-transparent md:hover:text-highlight_hover md:p-0"
                            :class="{ 'md:text-highlight': $route.name === 'student signup' }"
                        >
                            Enrollment
                        </router-link>
                    </li>
                    <li v-if="!store.isLoggedIn">
                        <router-link
                            to="/teacher/signup"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:underline md:hover:bg-transparent md:hover:text-highlight_hover md:p-0"
                            :class="{ 'md:text-highlight': $route.name === 'teacher signup' }"
                        >
                            Faculty Sign-Up
                        </router-link>
                    </li>
                    <li v-if="store.isLoggedIn">
                        <button
                            @click="redirectProfile()"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:underline md:hover:bg-transparent md:hover:text-highlight_hover md:p-0"
                            :class="{
                                'md:text-highlight': ['admin', 'teacher', 'student'].includes(
                                    $route.name
                                ),
                            }"
                        >
                            Profile
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <PromptPopup
        v-if="currentPopup === 'confirmation'"
        title="Are You Sure You Want To Logout?"
        description="You will need to sign in again to access your account."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        @on-confirm="logout()"
        @on-exit="currentPopup = null"
    />

</template>

<script>
export default {
    data() {
        // Data of the component
        return {
            // Store
            store: useCredentialsStore(),
            // Router
            router: useRouter(),
            // Popups
            currentPopup: null,
        };
    },
    methods: {
        // Methods of the component
        // Logout User
        logout() {
            this.store.logout();
            //Change the authorization headers of axious
            this.$axios.defaults.headers["Authorization"] = null;
            this.currentPopup = null
            // Redirect to login
            if (!this.store.isLoggedIn) {
                this.router.push("/login");
            }
        },
        redirectProfile() {
            if (this.store.account_type == "student") {
                this.router.push("/student");
            }
            if (this.store.account_type == "teacher") {
                this.router.push("/teacher");
            }
            if (this.store.account_type == "admin") {
                this.router.push("/admin");
            }
        },
    },
};
</script>
