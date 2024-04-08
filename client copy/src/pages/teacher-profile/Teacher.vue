<script setup>
// Components
import ModulesTab from "../../components/teacher-profile/ModulesTab.vue";
import ModuleEnrollmentsTab from "../../components/teacher-profile/ModuleEnrollmentsTab.vue";
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
            <div id="teacher-info" class="flex flex-col items-center justify-center mb-4">
                <h2>{{ formatName(store.user?.last_name, store.user?.first_name) }}</h2>
                <h2>{{ store.user_id || "Invalid ID" }}</h2>
                <h2>{{ store.user?.email || "Invalid Email" }}</h2>
            </div>
            <!-- drop down -->
            <div class="space-y-2">
                <button
                    @click="gotoStudentRecords()"
                    :class="{
                        'bg-highlight text-white':
                            pageMode === 'modules' || pageMode === 'student-records',
                        'bg-white text-black':
                            pageMode !== 'modules' && pageMode !== 'student-records',
                    }"
                    class="w-full text-left py-2 px-4 border border-gray-300 rounded hover:text-white hover:bg-highlight_hover"
                >
                    Student Records
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
        <ModulesTab
            v-if="pageMode === 'modules'"
            @select-module="gotoModuleInfo($event)"
        />

        <ModuleEnrollmentsTab
            v-if="pageMode === 'student-records'"
            :module-name="selectedModuleName"
            :school-year="selectedSchoolYear"
            @on-back="gotoStudentRecords()"
        />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Store
            store: useCredentialsStore(),
            // Router
            router: useRouter(),
            // Page mode
            pageMode: 'modules', // 'modules', 'student-records'
            // Data
            selectedModuleName: null,
            selectedSchoolYear: null,
            //Sidebar
            showSidebar: false,
        };
    },
    methods: {
        // Go to student records page
        gotoStudentRecords() {
            this.pageMode = "modules";
        },
        // Go to module info page
        gotoModuleInfo(data) {
            this.selectedModuleName = data.module_name;
            this.selectedSchoolYear = data.school_year;
            this.pageMode = "student-records";
        },
    },
    beforeCreate() {
        // On component mount
        const store = useCredentialsStore();
        // If user is not a teacher
        if (store.account_type !== "teacher") {
            // Redirect to home page
            this.router.push("/");
        }
    },
};
</script>
