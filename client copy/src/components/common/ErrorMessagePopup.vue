<script setup>
// Props
defineProps({
    title: String,
    description: String,
    exitText: String,
});
// Emits
defineEmits(["on-exit"]);
</script>

<template>
    <teleport to="body">
        <div class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
        <div
            tabindex="-1"
            class="grid h-screen place-items-center fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full"
        >
            <div class="relative w-full max-w-md max-h-full">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                        @click="$emit('on-exit')"
                        type="button"
                        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="popup-modal-success"
                    >
                        <svg
                            class="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-6 text-center">
                        <h3
                            class="mb-5 text-lg font-normal text-red-800 dark:text-gray-400 whitespace-pre-line"
                        >
                            {{ title }}
                        </h3>
                        <p
                            class="mb-5 text-base font-normal text-red-800 dark:text-gray-400 whitespace-pre-line"
                        >
                            {{ description }}
                        </p>
                        <button
                            @click="$emit('on-exit')"
                            type="button"
                            class="text-green-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                        >
                            {{ exitText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>
