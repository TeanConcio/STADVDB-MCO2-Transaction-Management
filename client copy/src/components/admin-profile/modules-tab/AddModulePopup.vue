<script setup>
import { formatDate, formatName, formatEnum, addUnique } from "@/util/helpers";
// Props
defineProps({
    title: String,
    description: String,
    confirmText: String,
    exitText: String,
});
// Emits
defineEmits(["on-confirm", "on-exit"]);
</script>

<template>
    <teleport to="body">
        <div class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
        <div
            tabindex="-1"
            class="grid h-screen place-items-center fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full"
        >
            <div class="relative w-full max-w-md max-h-full">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                        @click="$emit('on-exit')"
                        type="button"
                        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="popup-modal"
                    >
                        <svg
                            class="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-6 text-center">
                        <svg
                            class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <h3
                            class="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400 whitespace-pre-line"
                        >
                            Add New Module
                        </h3>
                        <p
                            class="mb-5 text-base font-normal text-gray-500 dark:text-gray-400 whitespace-pre-line"
                        >
                            Enter details for the new module below.
                        </p>
                        <!--make a form that asks the user for the module name, dropdown with list of all teachers, program name, session1, session2-->
                        <div class="flex flex-col mb-4">
                            <label
                                for="teacher-name"
                                class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 dark:text-gray-400"
                            >
                                Module Name
                            </label>
                            <div class="relative">
                                <select
                                    id="module-name"
                                    v-model="selectedModule"
                                    name="module-program"
                                    class="text-sm sm:text-base relative text-black w-full border rounded placeholder-gray-400 focus:border-blue-400 focus:outline-none py-2 pr-2 pl-2"
                                >
                                    <option
                                        v-for="module in moduleArray"
                                        :key="module"
                                        :value="module"
                                    >
                                        {{ module.module_name }}
                                    </option>
                                </select>
                            </div>
                            <div class="input-errors" v-if="errors.selectedModule">
                                <div class="block mb-2 text-sm font-medium text-red-500">
                                    {{ errors.selectedModule }}
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between mb-5">
                            <div class="w-48">
                                <label
                                    class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 dark:text-gray-400"
                                >
                                    Program
                                </label>
                                <div class="relative">
                                    <p
                                        id="module-program"
                                        name="module-program"
                                        class="text-sm sm:text-base relative text-black w-full border rounded outline-none py-2 pr-2 pl-2"
                                    >
                                        {{ formatEnum(selectedModule?.program) || "Select a module" }}
                                    </p>
                                </div>
                            </div>
                            <div class="w-48">
                                <label
                                    for="teacher-name"
                                    class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 dark:text-gray-400"
                                >
                                    School Year
                                </label>
                                <div class="relative">
                                    <select
                                        id="school-year"
                                        v-model="school_year"
                                        name="school-year"
                                        class="text-sm sm:text-base relative text-black w-full border rounded placeholder-gray-400 focus:border-blue-400 focus:outline-none py-2 pr-2 pl-2"
                                    >
                                        <option
                                            :key="currentYear - 1"
                                            :value="currentYear - 1"
                                        >
                                            {{ formatSchoolYearAsInterval(currentYear - 1) }} ({{ currentYear - 1 }})
                                        </option>
                                        <option
                                            :key="currentYear"
                                            :value="currentYear"
                                        >
                                            {{ formatSchoolYearAsInterval(currentYear) }} ({{ currentYear }})
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col mb-4">
                            <label
                                for="teacher-name"
                                class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 dark:text-gray-400"
                            >
                                Teacher
                            </label>
                            <div class="relative">
                                <select
                                    id="teacher-name"
                                    v-model="teacher_id"
                                    name="teacher-name"
                                    class="text-sm sm:text-base relative text-black w-full border rounded placeholder-gray-400 focus:border-blue-400 focus:outline-none py-2 pr-2 pl-2"
                                >
                                    <option
                                        v-for="teacher in teacherArray"
                                        :key="teacher.teacher_id"
                                        :value="teacher.teacher_id"
                                    >
                                        {{ formatName(teacher.last_name, teacher.first_name) }} ({{
                                            teacher.teacher_id
                                        }})
                                    </option>
                                </select>
                            </div>
                            <div class="input-errors" v-if="errors.teacher_id">
                                <div class="block mb-2 text-sm font-medium text-red-500">
                                    {{ errors.teacher_id }}
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between mb-8">
                            <div class="w-48">
                                <label
                                    for="session1"
                                    class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 dark:text-gray-400"
                                >
                                    Session 1
                                </label>
                                <div class="relative">
                                    <input
                                        id="session1"
                                        v-model="session_1"
                                        type="date"
                                        name="session1"
                                        placeholder="Enter Session 1"
                                        class="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-blue-400 focus:outline-none py-2 pr-2 pl-2"
                                    />
                                </div>
                                <div class="input-errors" v-if="errors.session_1">
                                    <div class="block mb-2 text-sm font-medium text-red-500">
                                        {{ errors.session_1 }}
                                    </div>
                                </div>
                            </div>
                            <div class="w-48">
                                <label
                                    for="session2"
                                    class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 dark:text-gray-400"
                                >
                                    Session 2
                                </label>
                                <div class="relative">
                                    <input
                                        id="session2"
                                        v-model="session_2"
                                        type="date"
                                        name="session2"
                                        placeholder="Enter Session 2"
                                        class="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-blue-400 focus:outline-none py-2 pr-2 pl-2"
                                    />
                                </div>
                                <div class="input-errors" v-if="errors.session_2">
                                    <div class="block mb-2 text-sm font-medium text-red-500">
                                        {{ errors.session_2 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            @click="submitForm()"
                            type="button"
                            class="text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 whitespace-pre-line"
                        >
                            Add Module
                        </button>
                        <button
                            @click="$emit('on-exit')"
                            type="button"
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Retried Data
            moduleArray: null,
            teacherArray: null,
            currentYear: new Date().getFullYear(),
            // Input Data
            selectedModule: null,
            school_year: new Date().getFullYear(),
            teacher_id: null,
            session_1: null,
            session_2: null,
            // Error
            errors: {},
        };
    },
    methods: {
        // Get all modules teacher teaches
        async getAllModuleNames() {
            await this.$axios
                .get(`/module_details/all/details`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.moduleArray = data.map((module) => {
                        return {
                            module_name: module.module_name,
                            program: module.program,
                        };
                    });
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        async getAllTeachers() {
            await this.$axios
                .get("/teachers")
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.teacherArray = data.map((teacher) => {
                        return {
                            teacher_id: teacher.teacher_id,
                            first_name: teacher.first_name,
                            last_name: teacher.last_name,
                        };
                    });
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        formatSchoolYearAsInterval(school_year) {
            return `${school_year} - ${school_year + 1}`;
        },
        // Submit form
        submitForm() {
            // Validate form
            if (this.validateForm()) {
                const newModule = {
                    module_name: this.selectedModule.module_name,
                    school_year: this.school_year,
                    teacher_id: this.teacher_id,
                    program: this.selectedModule.program,
                    session_1: this.session_1,
                    session_2: this.session_2,
                };
                this.$emit("on-confirm", newModule);
            }
        },
        validateForm() {
            this.validateSelectedModule();
            this.validateTeacherId();
            this.validateSession1();
            this.validateSession2();

            if (Object.keys(this.errors).length === 0) {
                return true;
            } else {
                return false;
            }
        },
        // Check if selected module is valid
        validateSelectedModule() {
            // If selected module is null
            if (this.selectedModule === null || this.selectedModule === undefined) {
                this.errors["selectedModule"] = "Must select a module";
            } 
            // If selected module is valid
            else {
                delete this.errors["selectedModule"];
            }
        },
        // Check if teacher id is valid
        validateTeacherId() {
            // If teacher id is null
            if (this.teacher_id === null || this.teacher_id === undefined) {
                this.errors["teacher_id"] = "Must select a teacher";
            } 
            // If teacher id is valid
            else {
                delete this.errors["teacher_id"];
            }
        },
        // Check if session 1 is valid
        validateSession1() {
            // If session 1 is null or not a valid date
            if (this.session_1 === null || Date.parse(this.session_1) === NaN) {
                this.errors["session_1"] = "Must be a valid date";
            } 
            // If session 1 is in the past
            else if (Date.parse(this.session_1) < Date.now()) {
                this.errors["session_1"] = "Session 1 must be in the future";
            }
            // If session 1 is after or on the day of session 2
            else if (Date.parse(this.session_1) >= Date.parse(this.session_2)) {
                this.errors["session_1"] = "Session 1 must be before Session 2";
            }
            // If session 1 is after June 1 of the next school year
            else if (Date.parse(this.session_1) >= Date.parse(`June 1, ${this.school_year + 1}`)) {
                this.errors["session_1"] = `School year ${this.formatSchoolYearAsInterval(this.school_year)} must finish before June 1, ${this.school_year + 1}`;
            } 
            // If session 1 is valid
            else {
                delete this.errors["session_1"];
            }
        },
        // Check if session 2 is valid
        validateSession2() {
            // If session 2 is null or not a valid date
            if (this.session_2 === null || Date.parse(this.session_2) === NaN) {
                this.errors["session_2"] = "Must be a valid date";
            } 
            // If session 2 is in the past
            else if (Date.parse(this.session_2) < Date.now()) {
                this.errors["session_2"] = "Session 2 must be in the future";
            }
            // If session 2 is before or on the day of session 1
            else if (Date.parse(this.session_2) <= Date.parse(this.session_1)) {
                this.errors["session_2"] = "Session 2 must be after Session 1";
            } 
            // If session 2 is after June 1 of the next school year
            else if (Date.parse(this.session_2) >= Date.parse(`June 1, ${this.school_year + 1}`)) {
                this.errors["session_2"] = `School year ${this.formatSchoolYearAsInterval(this.school_year)} must finish before June 1, ${this.school_year + 1}`;
            } 
            // If session 2 is valid
            else {
                delete this.errors["session_2"];
            }
        },
    },
    // watch for changes in input data
    watch: {
        selectedModule() {
            this.validateSelectedModule();
        },
        teacher_id() {
            this.validateTeacherId();
        },
        session_1() {
            this.validateSession1();
        },
        session_2() {
            this.validateSession2();
        },
    },
    async created() {
        // Get all modules
        await this.getAllModuleNames();
        // Get all teachers
        await this.getAllTeachers();
    },
};
</script>
