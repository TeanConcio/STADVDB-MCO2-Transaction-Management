<script setup>
// Components
import LogoLink from "../../components/common/LogoLink.vue";
import ContactForm from "../../components/contact/ContactForm.vue";
import About from "../../components/contact/About.vue";
import ContactCarousel from "../../components/contact/ContactCarousel.vue";
</script>

<template>

    <About />

    <div class="container mx-auto">
        <ContactCarousel />
    </div>

    <div class="items-center container bg-background_pastel mx-auto px-4 py-14 flex flex-col md:flex-row max-w-full">
        <div class="flex-1">
            <div class="mb-5">
                <LogoLink />
            </div>
            <ContactForm/>
        </div>
        <div class="flex-1 max-h-full">
            <img
                src="https://img.freepik.com/free-photo/hot-line-contact-us-call-center-search-interface_53876-124009.jpg"
                alt="Your Image"
                class="max-w-full item-center"
            />
        </div>
    </div>

</template>

<!-- Mobile responsiveness -->
<style scoped>
@media (max-width: 768px) {
    .flex-col {
        flex-direction: column;
    }
}
</style>
