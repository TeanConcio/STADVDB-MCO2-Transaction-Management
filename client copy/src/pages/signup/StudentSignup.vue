<script setup>
// Components
import LogoLink from "../../components/common/LogoLink.vue";
import StudentSignupForm from "../../components/signup/StudentSignupForm.vue";
// Store
import { useCredentialsStore } from "../../store/store";
// Router
import { useRouter } from 'vue-router';
</script>

<template>
    <div class="app-container bg-background_pastel min-h-screen">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
            <div class="flex flex-col items-center mt-16 md:min-h-screen md:max-mt-96 md:w-screen">
                <div class="mb-5">
                    <LogoLink />
                </div>
                <StudentSignupForm />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Router
            router: useRouter(),
        };
    },
    beforeCreate() {
        // On component mount
        const store = useCredentialsStore();
        // If user is logged in
        if (store.isLoggedIn) {
            // Redirect to home page
            this.router.push("/");
        }
    },
};
</script>
