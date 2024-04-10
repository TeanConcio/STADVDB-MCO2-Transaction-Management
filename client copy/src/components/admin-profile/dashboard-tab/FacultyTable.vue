<script setup>
import { formatDate, formatName, formatEnum, addUnique } from "@/util/helpers";
import MessagePopup from "../../common/MessagePopup.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import PromptPopup from "../../common/PromptPopup.vue";
import Dropdown from "../../common/Dropdown.vue";
import { duplicate } from "../../../util/helpers";
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div
        v-else
        class="overflow-x-auto shadow-md rounded-lg overflow-y-auto"
    >
        <!-- show dropdown with options-->
        <div class="flex mb-2">
            <Dropdown
                :optionsArray="['All', 'For Approval', 'Active / Inactive']"
                :disabledOptions="[]"
                :defaultOption="'All'"
                @on-select="
                    (selected) => {
                        filterMode = selected;
                        swapFilter();
                    }
                "
            />
            <button
                v-if="wasEdited"
                @click="update()"
                type="button"
                class="ml-auto w-15 h-13 px-5 py-2 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
            >
                Save
            </button>
        </div>
        <div class="overflow-x-auto shadow-md rounded-lg overflow-y-auto max-h-96">
            <table class="w-full text-gray-500 dark:text-gray-400 md:text-xl text-center">
                <thead
                    class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">ID Number</th>
                        <th scope="col" class="px-6 py-3">Name</th>
                        <th scope="col" class="px-6 py-3">Date Requested</th>
                        <th scope="col" class="px-6 py-3">
                            <label for="status">Status</label>
                        </th>
                        <th scope="col" class="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="displayArray === null || displayArray.length === 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Teachers Found
                        </th>
                    </tr>
                    <tr
                        v-for="(teacher, index) in displayArray"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ teacher.teacher_id }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ formatName(teacher.last_name, teacher.first_name) }}
                        </th>
                        <th
                            scope="row"
                            class="px-6 py-3 font-medium"
                            v-if="teacher.status === 'FOR_APPROVAL'"
                        >
                            {{ formatDate(teacher.created_at) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" v-else>
                            {{ formatDate(teacher.created_at) }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-3"
                            v-if="['ACTIVE', 'INACTIVE'].includes(teacher.status)"
                        >
                            <select
                                id="status"
                                :class="{
                                    'text-edited': teacher.status !== baseDataArray[index].status,
                                }"
                                @change="addEditedIndex(index)"
                                v-model="teacher.status"
                            >
                                <option
                                    :selected="status === teacher.status"
                                    v-for="status in ['ACTIVE', 'INACTIVE']"
                                    :value="status"
                                >
                                    {{ formatEnum(status) }}
                                </option>
                            </select>
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium text-lg" v-else>
                            {{ formatEnum(teacher.status) }}
                        </th>

                        <td class="px-6 py-4" v-if="teacher.status === 'FOR_APPROVAL'">
                            <button
                                @click="
                                    accept(
                                        teacher.teacher_id,
                                        formatName(teacher.last_name, teacher.first_name),
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
                                        teacher.teacher_id,
                                        formatName(teacher.last_name, teacher.first_name),
                                        index
                                    )
                                "
                                type="button"
                                class="xl:w-auto w-full mr-3 mb-3 md:mb-0 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                            >
                                Reject
                            </button>
                        </td>
                        <td class="px-6 py-4" v-else>
                            <button
                                @click="deleteTeacher(teacher.teacher_id, index)"
                                type="button"
                                class="xl:w-auto w-full mr-3 mb-3 md:mb-0 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

        <!-- popup that shows that faculty was accepted-->
    <MessagePopup
        v-if="showUpdatePopup"
        :title="title"
        :description="description"
        :accepted="acception"
        exit-text="Close"
        @on-exit="showUpdatePopup = false"
    />

    <!-- popup where showing the update failed-->
    <MessagePopup
        v-if="showErrorPopup"
        title="Update Failed"
        description="Something went wrong with executing the update"
        exit-text="Close"
        @on-exit="showErrorPopup = false"
    />

    <!-- show popup with error in updating teacher-->
    <MessagePopup
        v-if="editErrorPopup"
        title="Update Failed"
        :description="`Something went wrong with executing the update on the following teachers: ${erroredEdits}`"
        :accepted="false"
        exit-text="Close"
        @on-exit="showErrorPopup = false"
    />

    <!-- delete confirmation prompt-->
    <PromptPopup
        v-if="currentPopup === 'delete-confirmation'"
        title="Are You Sure You Want to Delete This Teacher?"
        description="Please make sure you want to delete this teacher. This action cannot be undone."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        :deleted="true"
        @on-confirm="runDelete()"
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
            facultyArray: null,
            displayArray: null,
            // Popups
            title: String,
            description: String,
            acception: Boolean,
            showErrorPopup: false,
            showUpdatePopup: false,
            editErrorPopup: false,
            currentPopup: null,
            //Constants
            statuses: ["ACTIVE", "INACTIVE", "REJECTED", "FOR_APPROVAL"],
            //Handlers
            editedIndices: [],
            erroredEdits: [],
            reflectionMap: {},
            //Copy of array
            baseDataArray: null,
            //Deletion data
            activeId: null,
            activeIndex: null,
            //Filter
            filterMode: "All", // 'All', 'Approval', 'Active / Inactive'
        };
    },
    methods: {
        // Get Faculty
        async getFaculty() {
            // Call get all teachers api endpoint
            await this.$axios
                .get(`/teachers/`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.facultyArray = data;
                    this.getFiltered();
                    this.baseDataArray = duplicate(this.displayArray);
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        //Get filtered
        getFiltered() {
            this.displayArray = [];
            this.reflectionMap = {};
            let count = 0;
            switch (this.filterMode) {
                case "All":
                    this.displayArray = duplicate(this.facultyArray);
                    break;
                case "For Approval":
                    this.facultyArray.forEach((element, index) => {
                        if (element.status === "FOR_APPROVAL") {
                            this.displayArray.push(duplicate(element));
                            this.reflectionMap[count] = index;
                            count++;
                        }
                    });
                    break;
                case "Active / Inactive":
                    this.facultyArray.forEach((element, index) => {
                        if (element.status !== "FOR_APPROVAL") {
                            this.displayArray.push(duplicate(element));
                            this.reflectionMap[count] = index;
                            count++;
                        }
                    });
                    break;
                default:
                    this.displayArray = duplicate(this.facultyArray);
            }
        },
        swapFilter() {
            //Swap filter
            this.getFiltered();
            //Reset edited indices
            this.baseDataArray = duplicate(this.displayArray);
            this.editedIndices = [];
            this.activeId = null;
            this.activeIndex = null;
        },
        update() {
            // Update all edited indices
            this.erroredEdits = [];

            this.editedIndices.forEach(async (index) => {
                // Update teacher status
                await this.$axios
                    .patch(`/teachers/status/${this.displayArray[index].teacher_id}`, {
                        status: this.displayArray[index].status,
                    })
                    // If successful
                    .then(async () => {
                        // Get updated teacher
                        await this.$axios
                            .get(`/teachers/${this.displayArray[index].teacher_id}`)
                            .then(({ data }) => {
                                this.displayArray[index] = data;
                                // Update faculty array
                                if (this.filterMode !== "All") {
                                    this.facultyArray[this.reflectionMap[index]] = data;
                                } else {
                                    this.facultyArray[index] = data;
                                }
                            });
                    })
                    // If unsuccessful
                    .catch((error) => {
                        console.log(error);
                        this.erroredEdits.push(this.displayArray[index].teacher_id);
                    });
            });
            // Reset edited indices
            this.editedIndices = [];
            // Show popup for errors
            if (this.erroredEdits.length > 0) {
                this.editErrorPopup = true;
            } else {  // Show popup for success
                this.title = "Successfully saved all changes.";
                this.description = "The statuses have been successfully changed.";
                this.acception = true;
                this.showUpdatePopup = true;
            }
            // Reset base data array

            this.baseDataArray = duplicate(this.displayArray);
        },
        // Delete teacher
        deleteTeacher(teacher_id, index) {
            this.currentPopup = "delete-confirmation";
            this.activeId = teacher_id;
            this.activeIndex = index;
        },
        async runDelete() {
            // Call delete teacher api endpoint
            await this.$axios
                .delete(`/teachers/${this.activeId}`)
                // If successful
                .then(() => {
                    // Close popup
                    this.currentPopup = null;
                    this.displayArray.splice(this.activeIndex, 1);
                    // Update faculty array
                    if (this.filterMode !== "All") {
                        this.facultyArray.splice(this.reflectionMap[this.activeIndex], 1);
                    } else {
                        this.facultyArray.splice(this.activeIndex, 1);
                    }
                    // Reset base data array
                    this.baseDataArray = duplicate(this.displayArray);
                    this.title = "Successfully deleted Faculty Member.";
                    this.description =
                        "Teacher with the ID number " + this.activeId + " has been deleted.";
                    this.acception = true;
                    this.showUpdatePopup = true;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    this.showErrorPopup = true;
                });
        },
        getID(teacher_id) {
            //  Get teacher id
            return teacher_id;
        },
        getTitle(accepted) {
            // If accepted, return Teacher successfully accepted
            if (accepted) {
                return "Teacher successfully accepted";
            } else { // Else, return Teacher successfully rejected
                return "Teacher successfully rejected";
            }
        },
        getDescription(accepted, teacher_id, name) {
            // get the teacher's description
            if (accepted) {
                return `Teacher ${name} with ID: ${teacher_id} has been successfully accepted`;
            } else {
                return `Teacher ${name} with ID: ${teacher_id} has been rejected`;
            }
        },
        accept(teacher_id, name, index) {
            // update status of teacher to active if accepted
            this.title = this.getTitle(true);
            this.description = this.getDescription(true, teacher_id, name);
            this.acception = true;
            this.updateTeacherStatus(teacher_id, "ACTIVE", index);
        },
        reject(teacher_id, name, index) {
            // update status of teacher to rejected if rejected
            this.title = this.getTitle(false);
            this.description = this.getDescription(false, teacher_id, name);
            this.acception = false;
            this.updateTeacherStatus(teacher_id, "REJECTED", index);
        },
        async updateTeacherStatus(teacher_id, status, index) {
            await this.$axios
                // Call update teacher status api endpoint
                .patch(`/teachers/status/${teacher_id}`, {
                    status: status,
                })
                // If successful
                .then(() => {
                    this.showUpdatePopup = true;
                    if (this.filterMode !== "All") {
                        this.displayArray.splice(index, 1);
                    }
                })
                .then(async () => {
                    // Get updated teacher
                    await this.$axios.get(`/teachers/${teacher_id}`).then(({ data }) => {
                        if (this.filterMode !== "All") {
                            this.facultyArray[this.reflectionMap[index]] = data;
                        } else {
                            this.facultyArray[index] = data;
                            this.displayArray[index] = data;
                        }
                    });
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    this.showErrorPopup = true;
                });
                // Reset base data array
            this.baseDataArray = duplicate(this.displayArray);
        },
        addEditedIndex(index) {
            // Add index to edited indices
            if (this.displayArray[index].status !== this.baseDataArray[index].status) {
                addUnique(this.editedIndices, index);
            } else { // Exclused index from edited indices
                this.editedIndices.splice(this.editedIndices.indexOf(index), 1);
            }
        },
    },
    computed: {
        // Check if there are any edited indices
        wasEdited() {
            return this.editedIndices.length > 0;
        },
    },
    async created() {
        await this.getFaculty().then(() => {
            this.render = true;
        });
    },
};
</script>
