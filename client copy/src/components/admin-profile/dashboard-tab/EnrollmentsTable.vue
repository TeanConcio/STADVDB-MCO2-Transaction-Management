<script setup>
import { formatName } from "@/util/helpers";
import MessagePopup from "../../common/MessagePopup.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
</script>

<template>
    <LoadingSpinner v-if="!render" /> <!-- loading spinner while it is loading -->
    <div v-else class="overflow-x-auto shadow-md rounded-lg overflow-y-auto">
        <div class="overflow-x-auto shadow-md rounded-lg overflow-y-auto max-h-96">
            <table class="w-full text-gray-500 dark:text-gray-400 text-xl text-center">
                <thead
                    class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">Module</th>
                        <th scope="col" class="px-6 py-3">Student ID</th>
                        <th scope="col" class="px-6 py-3">Name</th>
                        <th scope="col" class="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- if enrollmentArray is empty, display No Enrollments Found-->
                    <tr
                        v-if="enrollmentArray === null || enrollmentArray.length === 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Enrollments Found
                        </th>
                    </tr>
                    <!-- display all the enrollment details in the enrollmentArray-->
                    <tr
                        v-for="(enrollment, index) in enrollmentArray"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ `${enrollment.module_name}-${enrollment.school_year}` }}
                        </th>

                        <th scope="row" class="px-6 py-3 font-medium">
                            {{ enrollment.student.student_id }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{
                                formatName(
                                    enrollment.student.last_name,
                                    enrollment.student.first_name
                                )
                            }}
                        </th>

                        <td class="px-6 py-4" v-if="enrollment.status === 'PENDING_APPROVAL'">
                            <button
                                @click="
                                    accept(
                                        enrollment.module_name,
                                        enrollment.school_year,
                                        enrollment.student.student_id,
                                        formatName(
                                            enrollment.student.last_name,
                                            enrollment.student.first_name
                                        ),
                                        index
                                    )
                                "
                                type="button"
                                class="xl:w-auto w-full mr-3 mb-3 xl:mb-0 text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                            >
                                Accept
                            </button>
                            <button
                                @click="
                                    reject(
                                        enrollment.module_name,
                                        enrollment.school_year,
                                        enrollment.student.student_id,
                                        formatName(
                                            enrollment.student.last_name,
                                            enrollment.student.first_name
                                        ),
                                        index
                                    )
                                "
                                type="button"
                                class="xl:w-auto w-full w-43.5 mr-3 mb-3 md:mb-0 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                            >
                                Reject
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <MessagePopup
        v-if="showUpdatePopup"
        :title="title"
        :description="description"
        :accepted="acception"
        exit-text="Close"
        @on-exit="showUpdatePopup = false"
    />
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Data
            enrollmentArray: null,
            // Popups
            title: String,
            description: String,
            acception: Boolean,
            showUpdatePopup: false,
        };
    },
    methods: {
        // Get Enrollments
        async getEnrollments() {
            // Call get all for approval enrollments api endpoint
            await this.$axios
                .get(`/module_enrollments/approval`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.enrollmentArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        getTitle(accepted) {
            // If accepted, return Enrollment successfully accepted
            if (accepted) {
                return "Enrollment successfully accepted";
            } else {
                return "Enrollment successfully rejected";
            }
        },
        getDescription(accepted, module_name, school_year, name) {
            // If accepted, show that the student has been accepted
            if (accepted) {
                return `Student ${name}'s ${module_name}-${school_year} has been successfully accepted`;
            } else {
                return `Student ${name}'s' ${module_name}-${school_year} has been rejected`;
            }
        },
        accept(module_name, school_year, student_id, name, index) {
            // Set title and description
            this.title = this.getTitle(true);
            this.description = this.getDescription(true, module_name, school_year, name);
            this.acception = true;
            // Update enrollment status to in progress
            this.updateEnrollmentStatus(module_name, school_year, student_id, "IN_PROGRESS", index);
        },
        reject(module_name, school_year, student_id, name, index) {
            // Set title and description
            this.title = this.getTitle(false);
            this.description = this.getDescription(false, module_name, school_year, name);
            // Update enrollment status to cancelled
            this.updateEnrollmentStatus(module_name, school_year, student_id, "CANCELLED", index);
        },
        async updateEnrollmentStatus(module_name, school_year, student_id, status, index) {
            // Call update enrollment status api endpoint
            await this.$axios
                .patch(`/module_enrollments/status/${student_id}/${module_name}/${school_year}`, {
                    status: status,
                })
                .then(({ data }) => {
                    // Show popup
                    this.showUpdatePopup = true;
                })
                .then(async () => {
                    // Remove enrollment from array
                    this.enrollmentArray.splice(index, 1);
                })
                .catch((error) => {
                    console.log(error);
                    // Show error popup
                    this.showErrorPopup = true;
                });
        },
    },
    async created() {
        // Get enrollments
        await this.getEnrollments().then(() => {
            this.render = true;
        });
    },
};
</script>
