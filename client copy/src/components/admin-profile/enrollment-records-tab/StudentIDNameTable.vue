<script setup>
// Helpers
import { formatName } from "../../../util/helpers";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
// Props
defineProps({
    filter: {
        type: String,
        required: true,
    },
    selectedModule: {
        type: String,
        required: false,
    },
});
// Emits
defineEmits(["select-student"]);
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="overflow-x-auto shadow-md rounded-lg overflow-y-auto max-h-96">
        <table class="w-full text-gray-500 dark:text-gray-400 text-xl text-center">
            <thead
                class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
            >
                <tr>
                    <th scope="col" class="px-6 py-3">ID Number</th>
                    <th scope="col" class="px-6 py-3 text-center">Student Name</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="studentArray?.length === 0"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        No Students Found
                    </th>
                    <td class="px-6 py-4">-</td>
                </tr>
                <tr
                    v-else
                    v-for="student in studentArray"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                <!-- display info of the students from studentArray-->
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        {{ student.student_id }}
                    </th>
                    <td class="px-6 py-4">
                        {{ formatName(student.first_name, student.last_name) }}
                    </td>
                    <td class="px-6 py-4">
                        <button
                            @click="$emit('select-student', student.student_id)"
                            type="button"
                            class="xl:w-auto w-full mr-3 mb-3 xl:mb-0 text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                        >
                            View Student Data
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Data
            studentArray: null,
        };
    },
    methods: {
        // Get student array
        async getStudentArray() {
            switch (this.filter) {
                case "All Students": // Get all students
                    this.getAllStudents();
                    break;
                case "Currently Enrolled Students": // Get in progress students
                    this.getInProgressStudents();
                    break;
                case "Incomplete Students": // Get unpaid students
                    this.getUnpaidStudents();
                    break;
                case "Module Specific": // Get module specific students
                    this.getModuleSpecificStudents();
                    break;
            }
        },
        async getAllStudents() {
            await this.$axios
                .get(`/students/id_name`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.studentArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        async getInProgressStudents() {
            // Get all students
            await this.$axios
                .get(`/students/in_progress`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.studentArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        async getUnpaidStudents() {
            // Get all students
            await this.$axios
                .get(`/students/unpaid_bills`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.studentArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        async getModuleSpecificStudents() {
            await this.$axios
                .get(`/students/module/${this.selectedModule}`) // If successful
                .then(({ data }) => {
                    // Store data
                    this.studentArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    watch: {
        // Watch for changes in filter
        async filter() {
            await this.getStudentArray().then(() => {
                this.render = true;
            });
        },
        // Watch for changes in selected module
        async selectedModule() {
            await this.getStudentArray().then(() => {
                this.render = true;
            });
        },
    },
    async created() {
        // Get student array
        await this.getStudentArray().then(() => {
            this.render = true;
        });
    },
};
</script>
