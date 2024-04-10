<script setup>
import { useCredentialsStore } from "../../store/store";
const store = useCredentialsStore();
</script>

<template>
    <section class="bg-center bg-no-repeat bg-blend-multiply bg-background">
        <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-48 mt-16">
            <h1
                class="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white"
            >
                Training Certificate in Early Childhood Care and Education
            </h1>
            <p class="mb-8 text-lg font-normal text-white lg:text-xl sm:px-16 lg:px-48">
                Training Certificate in Early Childhood Care & Education is a joint program of
                Mission Ministries Philippines and Asian Theological Seminary under the Strategic
                Leader Development Center. The program is in response to the growing need of
                offering quality Early Childhood Care and Education distinguished by a biblical
                perspective.
            </p>
            <div
                class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
            >
                <router-link
                    to="/student/signup"
                    class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-black rounded-lg bg-gray-100 hover:bg-highlight hover:text-white focus:ring-4 focus:ring-gray-400"
                    v-if="!store.isLoggedIn"
                >
                    Get started
                    <svg
                        class="w-3.5 h-3.5 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </router-link>
                <!-- clicking on button routes to MMP ECE FB page-->
                <a
                    href="https://www.facebook.com/MMPece/"
                    target="_blank"
                    class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white focus:ring-4 focus:ring-gray-400"
                >
                    Learn more
                </a>
            </div>
        </div>
    </section>
</template>
