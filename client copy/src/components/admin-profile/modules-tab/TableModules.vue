<script setup>
import { formatDate, formatName, formatEnum, addUnique, duplicate } from "@/util/helpers";
import MessagePopup from "../../common/MessagePopup.vue";
import ErrorMessagePopup from "../../common/ErrorMessagePopup.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import AddModulePopup from "./AddModulePopup.vue";
import axios from "axios";
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="overflow-x-auto shadow-md rounded-lg overflow-y-auto max-h-96">
        <table
            class="w-full text-gray-500 dark:text-gray-400 md:text-xl text-center min-w-[1400px]"
        >
            <thead
                class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
            >
                <tr>
                    <th scope="col" class="px-6 py-3">Module Name</th>
                    <th scope="col" class="px-6 py-3">
                        <label for="teacher_assigned">Teacher Assigned</label>
                    </th>
                    <th scope="col" class="px-6 py-3">Program</th>
                    <th scope="col" class="px-6 py-3">Session 1</th>
                    <th scope="col" class="px-6 py-3 text-center">Session 2</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="moduleArray === null || moduleArray.length === 0"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        No Modules Found
                    </th>
                </tr>
                <tr
                    v-for="(module, index) in moduleArray"
                    :key="index"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <td
                        class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        {{ module.details.module_name }} {{ module.school_year }}
                    </td>
                    <td
                        class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        <!-- Dropdown for Teachers -->
                        <select
                            id="teacher_assigned"
                            :class="{
                                'text-edited':
                                    `${formatName(
                                        baseModuleArray[index].teacher?.last_name,
                                        baseModuleArray[index].teacher?.first_name
                                    )} (${baseModuleArray[index].teacher?.teacher_id})` !==
                                    updateHandlerArray[index],
                            }"
                            @change="addUnique(editedIndices, index)"
                            v-model="updateHandlerArray[index]"
                        >
                            <option
                                v-for="teacher in Object.values(teacherMap)"
                                :value="`${formatName(teacher.last_name, teacher.first_name)} (${
                                    teacher.teacher_id
                                })`"
                                :selected="
                                    `${formatName(
                                        baseModuleArray[index].teacher?.last_name,
                                        baseModuleArray[index].teacher?.first_name
                                    )} (${baseModuleArray[index].teacher?.teacher_id})` ===
                                    updateHandlerArray[index]
                                "
                                :disabled="teacher.status !== 'ACTIVE'"
                            >
                                {{ formatName(teacher.last_name, teacher.first_name) }} ({{
                                    teacher.teacher_id
                                }})
                            </option>
                        </select>
                    </td>
                    <td class="px-6 py-3 font-medium">
                        {{ getProgram(module.details.program) }}
                    </td>
                    <td class="px-6 py-3 font-medium">
                        {{ formatDate(module.session_1) }}
                    </td>
                    <td class="px-6 py-3 font-medium">
                        {{ formatDate(module.session_2) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="flex items-center justify-center">
        <button
            @click="currentPopup = 'add-module'"
            class="w-40 py-3 mt-5 mr-2 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
        >
            Add New
        </button>
        <button
            @click="update()"
            class="w-40 py-3 mt-5 text-highlight font-medium text-center bg-white border-2 border-highlight rounded-lg hover:border-highlight_hover hover:bg-highlight_hover hover:text-white"
        >
            Save Changes
        </button>
    </div>

    <MessagePopup
        v-if="currentPopup === 'update-success'"
        title="Assignment Successful"
        description="Assigning of teachers was successfully executed"
        :accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <ErrorMessagePopup
        v-if="currentPopup === 'update-error'"
        title="Update Failed"
        :description="`Something went wrong with executing the update. Please try again.`"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <AddModulePopup
        v-if="currentPopup === 'add-module'"
        @on-confirm="addNewModule($event)"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'add-module-success'"
        title="Module Added"
        :description="`Module was successfully added.`"
        :accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <ErrorMessagePopup
        v-if="currentPopup === 'add-module-exists'"
        title="Module Already Exists"
        :description="`The Module already exists.`"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <ErrorMessagePopup
        v-if="currentPopup === 'add-module-error'"
        title="Add Module Failed"
        :description="`Something went wrong with adding the module. Please try again`"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Data
            moduleArray: null,
            baseModuleArray: null,
            updateHandlerArray: [],
            teacherMap: {},
            editedIndices: [],
            errorCount: 0,
            // Popups
            currentPopup: null, // update-success, update-error, add-module, add-module-success, add-module-exists, add-module-error
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
                    this.moduleArray = data;
                    // Store base data
                    this.baseModuleArray = duplicate(this.moduleArray);

                    this.moduleArray.forEach((element) => { // Store teacher names
                        if (element.teacher) { // If teacher exists
                            this.updateHandlerArray.push( // Push teacher name
                                `${formatName(
                                    element.teacher.last_name,
                                    element.teacher.first_name
                                )} (${element.teacher.teacher_id})`
                            );
                        } else { // If teacher does not exist
                            // Push empty string
                            this.updateHandlerArray.push("");
                        }
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
                    data.forEach((element) => {
                        this.teacherMap[element.teacher_id] = element;
                    });
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        async update() {
            this.errorCount = 0;

            for (const index of this.editedIndices) { // For each edited index
                await this.$axios
                // Update teacher
                    .patch(
                        `/modules/teacher/${this.moduleArray[index].details.module_name}/${this.moduleArray[index].school_year}`,
                        {
                            teacher_id:
                                this.teacherMap[this.parseVal(this.updateHandlerArray[index])]
                                    .teacher_id,
                        }
                    )
                    // If successful
                    .then(() => {
                        this.moduleArray[index].teacher =
                            this.teacherMap[this.parseVal(this.updateHandlerArray[index])];
                    })
                    .catch((error) => {
                        console.log(error);
                        this.errorCount++;
                    });
            }
            // if count of errors is greater than 0, show error popup, else show success popup
            if (this.errorCount > 0) {
                this.currentPopup = "update-error";
            } else {
                this.currentPopup = "update-success";
            }
            this.baseModuleArray = duplicate(this.moduleArray);
        },
        getProgram(program) {
            return formatEnum(program);
        },
        //Special parser returns the ID from a string (NOTE: The value must be in the form of "LASTNAME, FIRST NAME (ID)")
        parseVal(value) {
            const tokenized = value.split(/[()]/);
            return tokenized[1];
        },
        // Add new module
        async addNewModule(data) {
            await this.$axios
                .post("/modules/", data)
                .then(() => {
                    this.getAllModules();
                    this.currentPopup = "add-module-success";
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.data.error === "Module already exists") {
                        this.currentPopup = "add-module-exists";
                    } else {
                        this.currentPopup = "add-module-error";
                    }
                });
        },
    },
    async created() {
        // Get all modules
        await this.getAllModules();
        await this.getAllTeachers().then(() => { // Get all teachers
            this.render = true;
        });
    },
};
</script>
