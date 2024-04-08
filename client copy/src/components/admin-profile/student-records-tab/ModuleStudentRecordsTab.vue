<script setup>
// Components
import LoadingSpinner from "../../common/LoadingSpinner.vue";
// Helpers
import { formatName, formatText } from "../../../util/helpers";
// Props
defineProps({
    moduleName: String,
    schoolYear: Number,
});
// Emits
defineEmits(["on-back"]);
</script>

<!-- this is the structure of the module student records table-->
<template>
    <div class="block w-full">
        <button
            @click="$emit('on-back')"
            type="button"
            class="px-8 py-3 text-base font-medium text-center text-white bg-highlight mb-7 rounded-lg hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
            Back
        </button>
        <LoadingSpinner v-if="!render" />
        <div v-else>
            <div class="sm:flex justify-between">
                <div>
                    <h1 class="text-4xl font-bold mb-4">{{ moduleName }} {{ schoolYear }}</h1>
                    <h2 class="text-2xl font-semibold mb-4">Students</h2>
                </div>
            </div>
            <div class="grid">
                <div class="overflow-x-auto shadow-md sm:rounded-lg w-full rounded">
                    <table class="w-full text-gray-500 text-xl text-center">
                        <thead class="text-xs text-white uppercase bg-highlight sticky top-0">
                            <tr>
                                <th scope="col" class="px-6 py-3">Student ID</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Grade</th>
                                <th scope="col" class="px-6 py-3">Absences</th>
                                <th scope="col" class="px-6 py-3 text-center">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-if="
                                    moduleEnrollmentArray === null ||
                                    moduleEnrollmentArray.length === 0
                                "
                                class="bg-white border-b hover:bg-gray-300"
                            >
                                <th
                                    id="student-id"
                                    scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    No Enrolled Students
                                </th>
                                <th id="name" scope="row" class="px-6 py-3 font-medium">-</th>
                                <th
                                    id="student-grade"
                                    scope="row"
                                    class="px-6 py-3 font-medium"
                                    contenteditable="true"
                                >
                                    -
                                </th>
                                <th id="absences" scope="row" class="px-6 py-3 font-medium">-</th>
                                <th id="remarks" scope="row" class="px-6 py-3 font-medium">-</th>
                            </tr>
                            <tr
                                v-for="enrollment in moduleEnrollmentArray"
                                class="bg-white border-b hover:bg-gray-300"
                            >
                                <th
                                    id="student-id"
                                    scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {{ enrollment.student.student_id }}
                                </th>
                                <th id="name" scope="row" class="px-6 py-3 font-medium">
                                    {{
                                        formatName(
                                            enrollment.student.last_name,
                                            enrollment.student.first_name
                                        )
                                    }}
                                </th>
                                <th>
                                    {{ enrollment.grade }}
                                </th>
                                <th>
                                    {{ enrollment.no_of_absences }}
                                </th>
                                <th>
                                    {{ formatText(enrollment.remarks) }}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Data
            moduleEnrollmentArray: null,
        };
    },
    methods: {
        // Get info of a module
        async getModuleEnrollments() {
            await this.$axios
                .get(`/module_enrollments/enrollments/${this.moduleName}/${this.schoolYear}`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.moduleEnrollmentArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    async created() {
        await this.getModuleEnrollments().then(() => {
            this.render = true;
        });
    },
};
</script>
