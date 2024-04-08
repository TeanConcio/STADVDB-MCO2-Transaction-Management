<template>
    <div class="flex items-center justify-center w-full h-36 bg-white p-4 border border-gray-300 rounded shadow-md">
        <!-- add more info for the card after this part-->
        <h3 class="text-lg font-semibold mb-3">
            {{ moduleName }}
        </h3>
    </div>
</template>

<script setup>
// Props
defineProps({
    moduleName: String,
    moduleDescription: String,
});
</script>
