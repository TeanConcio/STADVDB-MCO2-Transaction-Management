<script setup>
// Store
import { useCredentialsStore } from "../../store/store";
// Components
import LoadingSpinner from "../common/LoadingSpinner.vue";
// Popups
import PromptPopup from "../../components/common/PromptPopup.vue";
import MessagePopup from "../../components/common/MessagePopup.vue";
// Helpers
import { formatDate, formatName, formatEnum } from "../../util/helpers";
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="w-full grid">
        <h1 class="text-4xl font-bold mb-4">Enroll in Additional Modules</h1>
        <h2 class="text-xl font-semibold mb-4">Available Modules</h2>
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
                        <th scope="col" class="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="
                            enrollableModulesArray === null || enrollableModulesArray.length === 0
                        "
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Available Modules
                        </th>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">-</td>
                        <td class="px-6 py-4">
                            <p class="font-medium">-</p>
                        </td>
                    </tr>
                    <!-- display the module and the necessary info for every entry in the enrollable modules array-->
                    <tr
                        v-for="(module, index) in enrollableModulesArray"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ module.details.module_name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ formatEnum(module.details.program) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ formatName(module.teacher.last_name, module.teacher.first_name) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ formatDate(module.session_1) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ formatDate(module.session_2) }}
                        </td>
                        <td class="px-6 py-4">
                            <!-- button for the user to enroll in that module-->
                            <button
                                type="button"
                                @click="clickEnroll(module, index)"
                                class="font-medium text-highlight_hover dark:text-blue-500 hover:underline"
                            >
                                Enroll
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <PromptPopup
        v-if="showEnrollmentPopup"
        :title="`Enroll in ${module_name}?`"
        description="This will send an email to the admin with your information and email."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        @on-confirm="enrollModule()"
        @on-exit="showEnrollmentPopup = false"
    />

    <MessagePopup
        v-if="showSuccessPopup"
        title="Enrollment Request Successful."
        description="Your enrollment request has been sent."
        accepted="true"
        exit-text="Close"
        @on-exit="showSuccessPopup = false"
    />

    <MessagePopup
        v-if="showExistsPopup"
        title="Enrollment Failed"
        description="You are already enrolled in this module. If you just enrolled, please wait for admin to approve your enrollment."
        exit-text="Close"
        @on-exit="showExistsPopup = false"
    />

    <MessagePopup
        v-if="showErrorPopup"
        title="Enrollment Failed"
        description="You have not been enrolled in this module."
        exit-text="Close"
        @on-exit="showErrorPopup = false"
    />
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
            enrollableModulesArray: null,
            // Module Info
            module_name: null,
            school_year: null,
            // Popups
            showEnrollmentPopup: false,
            showSuccessPopup: false,
            showExistsPopup: false,
            showErrorPopup: false,
            // Index
            index: null,
        };
    },
    methods: {
        async getEnrollableModules() {
            // Call get student's enrollable modules api endpoint
            await this.$axios
                .get(`/modules/student/${this.store.user_id}`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.enrollableModulesArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        // Click Enroll
        clickEnroll(module, index) {
            // Store module info
            this.module_name = module.details.module_name;
            this.school_year = module.school_year;
            // Show enrollment popup
            this.showEnrollmentPopup = true;
            this.index = index;
        },
        // Enroll Student into Module
        async enrollModule() {
            // Call login api endpoint
            await this.$axios
                .post(`/module_enrollments/`, {
                    student_id: this.store.user_id,
                    module_name: this.module_name,
                    school_year: this.school_year,
                    status: "PENDING_APPROVAL",
                })
                // If successful
                .then((data) => {
                    // Show success popup and close enrollment popup
                    this.showSuccessPopup = true;
                    this.showEnrollmentPopup = false;
                    this.enrollableModulesArray.splice(this.index, 1);
                    this.index = null;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    // If enrollment already exists
                    if (error.response.data.error === "Enrollment already exists")
                        this.showExistsPopup = true;
                    // Show success popup and close enrollment popup
                    else this.showErrorPopup = true;
                    this.showEnrollmentPopup = false;
                });
        },
    },
    async created() {
        await this.getEnrollableModules().then(() => {
            this.render = true;
        });
    },
};
</script>
