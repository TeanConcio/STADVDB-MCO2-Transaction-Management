<script setup>
// Popups
import PromptPopup from "../../components/common/PromptPopup.vue";
import MessagePopup from "../../components/common/MessagePopup.vue";
// Tabs
import StudentDetailsTab from "../../components/student-profile/StudentDetailsTab.vue";
import CurrentEnrollmentsTab from "../../components/student-profile/CurrentEnrollmentsTab.vue";
import AllEnrollmentsTab from "../../components/student-profile/AllEnrollmentsTab.vue";
import EnrollTab from "../../components/student-profile/EnrollTab.vue";
// Store
import { useCredentialsStore } from "../../store/store";
// Router
import { useRouter } from 'vue-router';
// Helpers
import { formatName } from "../../util/helpers";
</script>
<template>
    <div class="flex flex-row min-h-screen">
        <aside class="z-10 w-64 bg-background_pastel py-4 px-2 pt-28 fixed inset-y-0 left-0 md:pt-20 md:block md:-translate-x-0 transform -translate-x-full transition duration-200 ease-in-out"
            :class="{ 'translate-x-0': showSidebar}">
            <div id="student-info" class="flex flex-col items-center justify-center mb-4">
                <h2>{{ formatName(store.user?.last_name, store.user?.first_name) }}</h2>
                <h2>{{ store.user_id || "Invalid ID" }}</h2>
                <h2>{{ store.user?.email || "Invalid Email" }}</h2>
                <h2>{{ store.user?.mobile_number || "Invalid Mobile Number" }}</h2>
            </div>
            <!-- drop down -->
            <div class="space-y-2">
                <button
                    @click="gotoStudentDetails()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'details',
                        'bg-white text-black': pageMode !== 'details',
                    }"
                    class="w-full text-left py-2 px-4 hover:bg-highlight_hover border hover:text-white border-gray-300 rounded"
                >
                    Student Details
                </button>
                <button
                    @click="gotoGrades()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'grades',
                        'bg-white text-black': pageMode !== 'grades',
                    }"
                    class="w-full text-left py-2 px-4 hover:text-white hover:bg-highlight_hover border border-gray-300 rounded"
                >
                    Grades
                </button>
                <button
                    @click="gotoEnroll()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'enroll',
                        'bg-white text-black': pageMode !== 'enroll',
                    }"
                    class="w-full text-left py-2 px-4 hover:bg-highlight_hover border hover:text-white border-gray-300 rounded"
                >
                    Enroll in Additional Modules
                </button>
                <button
                    @click="gotoEnrollmentHistory()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'history',
                        'bg-white text-black': pageMode !== 'history',
                    }"
                    class="w-full text-left py-2 px-4 hover:bg-highlight_hover border hover:text-white border-gray-300 rounded"
                >
                    Previous Enrollments
                </button>
                <button
                    @click="showRequestPopup = true"
                    class="w-full text-left py-2 px-4 bg-white hover:bg-highlight_hover border hover:text-white border-gray-300 rounded"
                >
                    Request Transcript
                </button>
            </div>
        </aside>

        <button @click="showSidebar = !showSidebar"
                        type="button"
                        class="z-20 inline-flex items-center p-2 w-10 h-10 mt-20 m-2 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 fixed"
                    >
                        <span class="sr-only">Open main menu</span>
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
        </button>

        <div class="p-4 w-full ml-10 md:ml-64 mt-20">
            <div class="w-full">

            <StudentDetailsTab
                v-if="pageMode === 'details'"
                :student-id="store.user_id"
            />

            <CurrentEnrollmentsTab
                v-if="pageMode === 'grades'"
            />

            <EnrollTab
                v-if="pageMode === 'enroll'"
            />

            <AllEnrollmentsTab
                v-if="pageMode === 'history'"
            />
        </div>
        </div>
        <PromptPopup
            v-if="showRequestPopup"
            title="Proceed with Transcript of Records Request?"
            description="This will send an email to the admin with your information and email."
            confirm-text="Yes, I'm sure"
            exit-text="No, cancel"
            @on-confirm="requestTOR()"
            @on-exit="showRequestPopup = false"
        />

        <MessagePopup
            v-if="showSuccessPopup"
            title="Transcript Request Successful."
            description=
            "Your transcript request has been sent."
            accepted=true
            exit-text="Close"
            @on-exit="showSuccessPopup = false"
        />

        <MessagePopup
            v-if="showErrorPopup"
            title="Request Failed"
            description="Your request has not been sent to the admin."
            exit-text="Close"
            @on-exit="showErrorPopup = false"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            store: useCredentialsStore(),
            // Router
            router: useRouter(),
            // Page mode
            pageMode: 'grades', // "details", 'grades', 'enroll, 'history'
            // Popups
            showRequestPopup: false,
            showSuccessPopup: false,
            showErrorPopup: false,
            //Sidebar
            showSidebar: false,
        };
    },
    methods: {
        gotoStudentDetails() {
            this.pageMode = "details";
        },
        gotoGrades() {
            this.pageMode = "grades";
        },
        gotoEnroll() {
            this.pageMode = "enroll";
        },
        gotoEnrollmentHistory() {
            this.pageMode = "history";
        },
        async requestTOR() {
            // Call request TOR api endpoint
            await this.$axios
                .post(`/tor_requests/`, {
                    student_id: this.store.user_id,
                    status: "PENDING",
                })
                // If successful
                .then(() => {
                    // Show success popup and close request TOR popup
                    this.showSuccessPopup = true;
                    this.showRequestPopup = false;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    // Show error popup and close request TOR popup
                    this.showErrorPopup = true;
                    this.showRequestPopup = false;
                });
        },
    },
    beforeCreate() {
        // On component mount
        const store = useCredentialsStore();
        // If user is not an student
        if (store.account_type !== "student") {
            // Redirect to home page
            this.router.push("/");
        }
    },
    mounted() {
        this.gotoGrades();
    },
};
</script>
