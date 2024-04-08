<script setup>
// Store
import { useCredentialsStore } from "../../store/store";
// Components
import LoadingSpinner from "../common/LoadingSpinner.vue";
// Helpers
import { formatDate, formatName, formatEnum } from "../../util/helpers";

const currentYear = new Date().getFullYear();
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="w-full grid">
        <h1 class="text-4xl font-bold mb-4">Grades</h1>
        <h2 class="text-xl font-semibold mb-4">AY. {{ currentYear }} - {{ currentYear + 1 }}</h2>

        <div class="overflow-x-auto shadow-md rounded-lg mb-10">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead
                    class="sticky top-0 text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">Module Name</th>
                        <th scope="col" class="px-6 py-3">Track</th>
                        <th scope="col" class="px-6 py-3">Teacher</th>
                        <th scope="col" class="px-6 py-3">Session 1</th>
                        <th scope="col" class="px-6 py-3">Session 2</th>
                        <th scope="col" class="px-6 py-3">Final Grade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="currentModulesArray === null || currentModulesArray.length === 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Enrolled Modules
                        </th>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">
                            <p class="font-medium">-</p>
                        </td>
                    </tr>
                    <!-- display the current modules one by one with the necessary data-->
                    <tr
                        v-for="module in currentModulesArray"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ module.module.details.module_name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ formatEnum(module.module.details.program) }}
                        </td>
                        <td class="px-6 py-4">
                            {{
                                formatName(
                                    module.module.teacher.last_name,
                                    module.module.teacher.first_name
                                )
                            }}
                        </td>
                        <td class="px-6 py-4">
                            {{ formatDate(module.module.session_1) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ formatDate(module.module.session_2) }}
                        </td>
                        <td class="px-6 py-4">
                            <p class="font-medium">
                                {{ module.grade || "TBD" }}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Store
            store: useCredentialsStore(),
            // Modules
            currentModulesArray: null,
        };
    },
    methods: {
        async getCurrentModules() {
            // Call get all student's current modules api endpoint
            await this.$axios
                .get(`/module_enrollments/active/${this.store.user_id}`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.currentModulesArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    async created() {
        await this.getCurrentModules().then(() => {
            this.render = true;
        });
    },
};
</script>
