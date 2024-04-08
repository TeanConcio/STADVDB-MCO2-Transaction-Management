<script setup>
import { formatDate, formatName, formatEnum } from "../../util/helpers";
// Props
defineProps({
    completedModulesArray: Array,
});
</script>

<template>
    <div class="w-full p-5">
        <h2 class="text-xl font-semibold mb-4">Completed</h2>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mb-10">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead
                    class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">Title</th>
                        <th scope="col" class="px-6 py-3">Track</th>
                        <th scope="col" class="px-6 py-3">Teacher</th>
                        <th scope="col" class="px-6 py-3">Session 1</th>
                        <th scope="col" class="px-6 py-3">Session 2</th>
                        <th scope="col" class="px-6 py-3">Final Grade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="completedModulesArray === null || completedModulesArray.length === 0"
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
                    <tr
                        v-for="module in completedModulesArray"
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
