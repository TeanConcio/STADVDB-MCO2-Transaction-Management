<template>
    <Cover />
    <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row max-h-fit">
        <div class="bg-white rounded-lg shadow-lg p-6 md:p-8 flex-1">
            <div class="text-center md:text-left">
                <h1 class="text-2xl font-bold mb-4">Why should you join us?</h1>
                <p class="mb-4">
                    A special modular program designed to prepare participants to undertake a
                    holistic and transformational early childhood program. It is based on
                    developmentally appropriate practice Designed to provide participants with
                    knowledge and skills to develop, implement, and evaluate an early childhood
                    education.
                </p>
                <p class="mb-4">
                    Students have an option of enrolling either in the Teacher's Track or
                    Administrator's Track or both. In any chosen tract, bible courses are part of
                    the curriculum
                </p>
                <div class="flex items-start mt-4 flex-col">
                    <router-link
                        to="/student/signup"
                        class="bg-highlight hover:bg-highlight_hover text-white font-bold py-2 px-2 rounded mb-2"
                        v-if="!store.isLoggedIn"
                    >
                        Apply Now
                    </router-link>
                    <router-link
                        to="/login"
                        class="text-highlight hover:text-highlight_hover"
                        v-if="!store.isLoggedIn"
                    >
                        Already have an account? Log In
                    </router-link>
                </div>
            </div>
        </div>
        <div class="flex-1">
            <img
                src="https://www.worldvision.org/wp-content/uploads/2017/06/Miljhon-Feature.png"
                alt="Your Image"
                class="max-w-full h-auto"
            />
        </div>
    </div>
    <div class="container mx-auto mb-10">
        <Carousel />
    </div>
</template>

<script setup>
import Cover from "../../components/index/Cover.vue";
import Carousel from "../../components/index/Carousel.vue";
import { useCredentialsStore } from "../../store/store";

const store = useCredentialsStore();
</script>

<!-- Mobile responsiveness -->
<style scoped>
@media (max-width: 768px) {
    .flex-col {
        flex-direction: column;
    }
}
</style>
