<script setup>
// Store
import { useCredentialsStore } from "../../../store/store";
// Components
import ModuleCard from "../../common/ModuleCard.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import Dropdown from "../../common/Dropdown.vue";
import ErrorMessagePopup from "../../../components/common/ErrorMessagePopup.vue";
// Helpers
import { downloadZIP } from "../../../util/helpers";
// Emits
defineEmits(["select-module"]);
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="w-full">
        <h1 class="text-4xl font-bold mb-4">
            Student Records <span class="font-medium">(per Module)</span>
        </h1>
        <Dropdown
            :options-array="yearRange"
            :default-option="filterYear"
            @on-select="
                (filter) => {
                    filterYear = filter;
                }
            "
        />
        <br />

        <LoadingSpinner v-if="!renderCards" />
        <div
            class="grid grid-cols-1 mb-5 gap-4 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 align-center"
            v-else
        >
            <div v-if="displayArray === null || displayArray.length === 0">
                <ModuleCard module-name="No modules being taught" module-description="-" />
            </div>
            <div v-for="module in displayArray">
                <button
                    class="w-full h-auto"
                    @click="
                        $emit('select-module', {
                            module_name: module.details.module_name,
                            school_year: module.school_year,
                        })
                    "
                >
                    <ModuleCard
                        :module-name="`${module.details.module_name} ${module.school_year}`"
                        :module-description="module.details.description"
                    />
                </button>
            </div>
        </div>
        <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-7 py-5 mb-5"
        >
            <h2 class="text-2xl font-semibold mb-1">Download</h2>
            <div class="mb-5">
                <button
                    @click="downloadYearModules"
                    type="button"
                    class="w-full sm:w-auto ml-auto mr-10 md:px-10 px-3 py-3 mt-5 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Download Year Module Student Records (.zip)
                </button>
                <button
                    @click="downloadAllModules"
                    type="button"
                    class="w-full sm:w-auto ml-auto mr-10 md:px-10 px-3 py-3 mt-5 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Download All Module Student Records (.zip)
                </button>
                <button
                    @click="downloadWholeDatabase"
                    type="button"
                    class="w-full sm:w-auto ml-auto mr-10 md:px-10 px-3 py-3 mt-5 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Download Whole Database (.zip)
                </button>
            </div>
        </div>
    </div>

    <ErrorMessagePopup
        v-if="currentPopup === 'error'"
        title="Cannot Download Files."
        description="Please try again later."
        exit-text="Close"
        @on-exit="
            currentPopup = 'null';
        "
    />

</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            renderCards: false,
            // Store
            store: useCredentialsStore(),
            // Data
            modulesArray: null,
            displayArray: null,
            selectedModuleName: null,
            selectedModuleYear: null,
            yearRange: [],
            filterYear: null,
            // Popup
            currentPopup: "null", // null, error
        };
    },
    methods: {
        // Get all modules teacher teaches
        async getAllModules() {
            await this.$axios
                .get(`/modules/`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.modulesArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        async downloadYearModules() {
            await this.$axios
                .get(`/download/modules/${this.filterYear}`)
                // If successful
                .then(({ data }) => {
                    // Download data
                    downloadZIP(data, `${this.filterYear} Module Student Records Data.zip`);
                })
                // If unsuccessful
                .catch((error) => {
                    this.currentPopup = "error";
                    console.log(error);
                });
        },
        async downloadAllModules() {
            await this.$axios
                .get(`/download/modules`)
                // If successful
                .then(({ data }) => {
                    // Download data
                    downloadZIP(data, "All Module Student Records Data.zip");
                })
                // If unsuccessful
                .catch((error) => {
                    this.currentPopup = "error";
                    console.log(error);
                });
        },
        async downloadWholeDatabase() {
            await this.$axios
                .get(`/download/all`)
                // If successful
                .then(({ data }) => {
                    // Download data
                    downloadZIP(data, "MMP Database.zip");
                })
                // If unsuccessful
                .catch((error) => {
                    this.currentPopup = "error";
                    console.log(error);
                });
        },
        getYearRange() {
            // Get all years from modules
            this.yearRange = this.modulesArray.map((element) => {
                return element.school_year;
            });
            // Remove duplicates
            this.yearRange = [...new Set(this.yearRange)];
            // Sort years in descending order
            this.yearRange.sort((a, b) => {
                return b - a;
            });
            // Set default filter year to the latest year
            this.filterYear = this.yearRange[0];
        },
        // Get the modules to display
        getDisplayData() {
            this.displayArray = [];
            this.modulesArray.forEach((element) => {
                if (element.school_year === parseInt(this.filterYear)) { // If module is in the selected year, add to display array
                    this.displayArray.push(element);
                }
            });
        },
    },
    async created() {
        // Get all modules
        await this.getAllModules().then(() => {
            this.render = true;
            this.getYearRange();
            this.getDisplayData();
            this.renderCards = true;
        });
    },
    watch: {
        // If filter year changes, update display data
        filterYear() {
            this.renderCards = false;
            this.getDisplayData();
            this.renderCards = true;
        },
    },
};
</script>
