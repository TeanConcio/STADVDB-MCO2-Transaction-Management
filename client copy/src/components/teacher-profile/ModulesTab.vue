<script setup>
// Store
import { useCredentialsStore } from "../../store/store";
// Components
import ModuleCard from "../common/ModuleCard.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";
// Emits
defineEmits(["select-module"]);
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else
    class="w-full">
        <h1 class="text-4xl font-bold mb-4">Modules</h1>
        <div class="grid grid-cols-1 mb-5 gap-4 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 align-center">
            <div v-if="teachingModulesArray === null || teachingModulesArray.length === 0">
                <ModuleCard module-name="No modules being taught" module-description="-" />
            </div>
            <div v-for="module in teachingModulesArray">
                <button class="w-full h-auto"
                    @click="
                        $emit('select-module', {
                            module_name: module.details.module_name,
                            school_year: module.school_year,
                        })
                    "
                >
                <!-- display the module card from the teachingModulesArray-->
                    <ModuleCard
                        :module-name="`${module.details.module_name} ${module.school_year}`"
                        :module-description="module.details.description"
                    />
                </button>
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
            // Store
            store: useCredentialsStore(),
            // Data
            teachingModulesArray: null,
            selectedModuleName: null,
            selectedModuleYear: null,
        };
    },
    methods: {
        // Get all modules teacher teaches
        async getTeachingModules() {
            await this.$axios
                .get(`/modules/teacher/${this.store.user_id}`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.teachingModulesArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    async created() {
        await this.getTeachingModules()
            .then(() => {
                this.render = true;
            });
    },
};
</script>