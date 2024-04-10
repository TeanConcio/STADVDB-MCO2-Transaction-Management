<script setup>
import StudentIDNameTable from "./StudentIDNameTable.vue";
import Dropdown from "../../common/Dropdown.vue";
// Props
defineProps({
    defaultFilter: {
        type: String,
        required: false,
    },
    defaultModule: {
        type: String,
        required: false,
    },
});
// Emits
defineEmits(["select-student"]);
</script>
<template>
    <div class="w-full grid">
        <h1 class="text-4xl font-bold mb-4">Enrollment Records</h1>
        <div class="md:flex mb-8">
            <Dropdown
                :options-array="filterOptions"
                :default-option="selectedFilter"
                @on-select="onSelectFilter($event)"
                class="md:mb-0 mb-2"
            />
            <div class="md:ml-4">
                <Dropdown
                    v-if="selectedFilter === 'Module Specific'"
                    :options-array="moduleOptions"
                    :disabled-options="disabledModuleOptions"
                    :default-option="selectedModule"
                    @on-select="onSelectModule($event)"
                />
            </div>
        </div>

        <br /><br />
        <StudentIDNameTable
            :filter="selectedFilter"
            :selected-module="selectedModule"
            @select-student="
                $emit('select-student', {
                    selectedFilter: selectedFilter,
                    selectedModule: selectedModule,
                    student_id: $event,
                })
            "
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Dropdown Options
            filterOptions: [
                "All Students",
                "Currently Enrolled Students",
                "Incomplete Students",
                "Module Specific",
            ],
            // Module Options
            moduleOptions: [
                "FOUNDATIONAL COURSES",
                "Child and Development",
                "Philosophical Foundations in ECE",
                "Assessment of Learning and Development",
                "Practicum 1",
                "Curriculum in ECE",
                "TEACHER'S TRACK",
                "Developmental Reading",
                "Application of Teaching Principles in Classroom Management",
                "Practicum 1",
                "BIBLICAL FOUNDATION",
                "Bible Intro",
                "Spiritual Formation",
                "Holistic and Transformational Ministry",
                "ADMIN TRACK",
                "Operation & Management",
                "Strategic Planning",
                "Practicum 2",
            ],
            // Disabled Module Options
            disabledModuleOptions: [
                "FOUNDATIONAL COURSES",
                "TEACHER'S TRACK",
                "BIBLICAL FOUNDATION",
                "ADMIN TRACK",
            ],
            // Dropdown Selections
            selectedFilter: this.defaultFilter !== null ? this.defaultFilter : "All Students",
            selectedModule: null,
        };
    },
    methods: {
        async onSelectFilter(data) {
            // Set selected filter
            this.selectedFilter = data;
            // Reset selected module
            this.selectedModule = "Child and Development";
        },
        onSelectModule(data) {
            // Set selected module
            this.selectedModule = data;
        },
    },
};
</script>
