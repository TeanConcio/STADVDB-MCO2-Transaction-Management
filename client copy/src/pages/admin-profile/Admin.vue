<script setup>
// Components
import DashboardTab from "../../components/admin-profile/dashboard-tab/DashboardTab.vue";
import EnrollmentRecordsTab from "../../components/admin-profile/enrollment-records-tab/EnrollmentRecordsTab.vue";
import StudentRecordsTab from "../../components/admin-profile/student-records-tab/StudentRecordsTab.vue";
import ModuleStudentRecordsTab from "../../components/admin-profile/student-records-tab/ModuleStudentRecordsTab.vue";
import ModulesTab from "../../components/admin-profile/modules-tab/ModulesTab.vue";
import TicketsTab from "../../components/admin-profile/tickets-tab/TicketsTab.vue";
import StudentCard from "../../components/admin-profile/student-card/StudentCard.vue";
// Store
import { useCredentialsStore } from "../../store/store";
// Router
import { useRouter } from 'vue-router';
</script>

<template>
    <div class="flex flex-row min-h-screen">
        <aside
            class="z-10 w-64 bg-background_pastel py-4 px-2 pt-28 fixed inset-y-0 left-0 md:pt-20 md:block md:-translate-x-0 transform -translate-x-full transition duration-200 ease-in-out"
            :class="{ 'translate-x-0': showSidebar }"
        >
            <div id="student-info" class="flex flex-col items-center justify-center mb-4">
                <h2>{{ store.user_id || "Invalid ID" }}</h2>
                <h2>{{ store.user?.email || "Invalid Email" }}</h2>
            </div>
            <!-- drop down -->
            <div class="space-y-2">
                <button
                    @click="gotoDashboard()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'dashboard',
                        'bg-white text-black': pageMode !== 'dashboard',
                    }"
                    class="w-full text-left py-2 px-4 border border-gray-300 rounded hover:text-white hover:bg-highlight_hover"
                >
                    Dashboard
                </button>
                <button
                    @click="gotoEnrollmentRecords()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'enrollment-records',
                        'bg-white text-black': pageMode !== 'enrollment-records',
                    }"
                    class="w-full text-left py-2 px-4 border border-gray-300 rounded hover:text-white hover:bg-highlight_hover"
                >
                    Enrollment Records
                </button>
                <button
                    @click="gotoStudentRecords()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'student-records',
                        'bg-white text-black': pageMode !== 'student-records',
                    }"
                    class="w-full text-left py-2 px-4 border border-gray-300 rounded hover:text-white hover:bg-highlight_hover"
                >
                    Student Records
                </button>
                <button
                    @click="gotoModulesTab()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'modules-tab',
                        'bg-white text-black': pageMode !== 'modules-tab',
                    }"
                    class="w-full text-left py-2 px-4 border border-gray-300 rounded hover:text-white hover:bg-highlight_hover"
                >
                    Modules
                </button>

                <button
                    @click="gotoTicketsTab()"
                    :class="{
                        'bg-highlight text-white': pageMode === 'tickets-tab',
                        'bg-white text-black': pageMode !== 'tickets-tab',
                    }"
                    class="w-full text-left py-2 px-4 border border-gray-300 rounded hover:text-white hover:bg-highlight_hover"
                >
                    Tickets
                </button>
            </div>
        </aside>
        <button
            @click="showSidebar = !showSidebar"
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
            <DashboardTab v-if="pageMode === 'dashboard'" />

            <EnrollmentRecordsTab
                v-if="pageMode === 'enrollment-records'"
                :default-filter="selectedEnrollmentFilter"
                :default-module="selectedEnrollmentModule"
                @select-student="gotoStudentCard($event)"
            />

            <StudentCard
                v-if="pageMode === 'student-card'"
                :student-id="selectedStudentId"
                @on-back="gotoEnrollmentRecords()"
            />

            <StudentRecordsTab
                v-if="pageMode === 'student-records'"
                @select-module="gotoModuleStudentRecords($event)"
            />

            <ModuleStudentRecordsTab
                v-if="pageMode === 'module-student-records'"
                :module-name="selectedModuleName"
                :school-year="selectedSchoolYear"
                @on-back="gotoStudentRecords()"
            />

            <ModulesTab
                v-if="pageMode === 'modules-tab'"
                @on-back="gotoModulesTab()"
            />

            <TicketsTab v-if="pageMode === 'tickets-tab'" />
        </div>
    </div>
</template>

<script>
// Export component script
export default {
    data() {
        return {
            // Store
            store: useCredentialsStore(),
            // Router
            router: useRouter(),
            // Page mode
            pageMode: "dashboard", // 'dashboard', 'enrollment-records', 'student-records', 'module-student-records', 'modules-tab', 'student-card', 'tickets-tab'
            // Data
            selectedEnrollmentFilter: null,
            selectedEnrollmentModule: null,
            selectedStudentId: null,
            selectedModuleName: null,
            selectedSchoolYear: null,
            //Sidebar
            showSidebar: false,
        };
    },
    methods: {
        resetData() {
            this.selectedEnrollmentFilter = null;
            this.selectedEnrollmentModule = null;
            this.selectedStudentId = null;
            this.selectedModuleName = null;
            this.selectedSchoolYear = null;
        },
        // Go to Dashboard tab
        gotoDashboard() {
            this.resetData();
            this.pageMode = "dashboard";
        },
        // Go to Enrollment Records Tab
        gotoEnrollmentRecords() {
            this.selectedStudentId = null;
            this.selectedModuleName = null;
            this.selectedSchoolYear = null;
            this.pageMode = "enrollment-records";
        },
        // Go to student card
        gotoStudentCard(data) {
            this.resetData();
            this.selectedEnrollmentFilter = data.selectedFilter;
            this.selectedEnrollmentModule = data.selectedModule;
            this.selectedStudentId = data.student_id;
            this.pageMode = "student-card";
        },
        // Go to student records tab
        gotoStudentRecords() {
            this.resetData();
            this.pageMode = "student-records";
        },
        // Go to module student records tab
        gotoModuleStudentRecords(data) {
            this.resetData();
            this.selectedModuleName = data.module_name;
            this.selectedSchoolYear = data.school_year;
            this.pageMode = "module-student-records";
        },
        // Go to modules tab
        gotoModulesTab(data) {
            this.resetData();
            this.selectedStudentId = null;
            this.selectedModuleName = null;
            this.selectedSchoolYear = null;
            this.pageMode = "modules-tab";
        },
        // Go to tickets tab
        gotoTicketsTab() {
            this.resetData();
            this.pageMode = "tickets-tab";
        },
    },
    beforeCreate() {
        // On component mount
        const store = useCredentialsStore();
        // If user is not an admin
        if (store.account_type !== "admin") {
            // Redirect to home page
            this.router.push("/");
        }
    },
};
</script>
