<script setup>
// Components
import LoginForm from "../../components/login/LoginForm.vue";
import LogoLink from "../../components/common/LogoLink.vue";
</script>

<template>
    <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 bg-background_pastel min-h-screen"
    >
        <div class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            <LogoLink />
        </div>
        <LoginForm />
    </div>
</template>
