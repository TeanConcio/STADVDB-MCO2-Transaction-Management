<script setup>
import { formatDate, formatName, formatEnum, duplicate } from "@/util/helpers";
import MessagePopup from "../../common/MessagePopup.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import PromptPopup from "../../common/PromptPopup.vue";
import Dropdown from "../../common/Dropdown.vue";
defineEmits(["delete"]);
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div
        v-else
        class="overflow-x-auto shadow-md rounded-lg overflow-y-auto"
    >
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
            <table class="w-full text-gray-500 dark:text-gray-400 text-xl text-center">
                <thead
                    class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">ID Number</th>
                        <th scope="col" class="px-6 py-3">Name</th>
                        <th scope="col" class="px-6 py-3">Date Enrolled</th>
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
                            No Students Found
                        </th>
                    </tr>
                    <tr
                        v-for="(student, index) in displayArray"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ student.student_id }}
                        </th>
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ formatName(student.last_name, student.first_name) }}
                        </th>
                        <th
                            scope="row"
                            class="px-6 py-3 font-medium"
                            v-if="student.status === 'FOR_APPROVAL'"
                        >
                            {{ formatDate(student.created_at) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" v-else>
                            {{ formatDate(student.created_at) }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-3"
                            v-if="
                                ['ACTIVE', 'GRADUATED', 'WITHDRAWN', 'REJECTED'].includes(
                                    student.status
                                )
                            "
                        >
                            <select
                                id="status"
                                :class="{
                                    'text-edited': student.status !== baseDataArray[index].status,
                                }"
                                @change="addEditedIndex(index)"
                                v-model="student.status"
                            >
                                <option
                                    :selected="status === student.status"
                                    v-for="status in [
                                        'ACTIVE',
                                        'GRADUATED',
                                        'WITHDRAWN',
                                        'REJECTED',
                                    ]"
                                    :value="status"
                                >
                                    {{ formatEnum(status) }}
                                </option>
                            </select>
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" v-else>
                            {{ formatEnum(student.status) }}
                        </th>

                        <td class="px-6 py-4" v-if="student.status === 'FOR_APPROVAL'">
                            <button
                                @click="
                                    accept(
                                        student.student_id,
                                        formatName(student.last_name, student.first_name),
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
                                        student.student_id,
                                        formatName(student.last_name, student.first_name),
                                        index
                                    )
                                "
                                type="button"
                                class="xl:w-auto w-full w-43.5 mr-3 mb-3 md:mb-0 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                            >
                                Reject
                            </button>
                        </td>
                        <td class="px-6 py-4" v-else>
                            <button
                                @click="deleteStudent(student.student_id, index)"
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

    <MessagePopup
        v-if="showUpdatePopup"
        :title="title"
        :description="description"
        :accepted="acception"
        exit-text="Close"
        @on-exit="showUpdatePopup = false"
    />

    <MessagePopup
        v-if="showErrorPopup"
        title="Update Failed"
        description="Something went wrong with executing the update"
        exit-text="Close"
        @on-exit="showErrorPopup = false"
    />

    <MessagePopup
        v-if="editErrorPopup"
        title="Update Failed"
        :description="`Something went wrong with executing the update on the following students: ${erroredEdits}`"
        :accepted="false"
        exit-text="Close"
        @on-exit="showErrorPopup = false"
    />

    <PromptPopup
        v-if="currentPopup === 'delete-confirmation'"
        title="Are You Sure You Want to Delete This Student?"
        description="Please make sure you want to delete this student. This action cannot be undone."
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
            studentArray: null,
            displayArray: null,
            // Popups
            title: String,
            description: String,
            acception: Boolean,
            showErrorPopup: false,
            showUpdatePopup: false,
            editErrorPopup: false,
            currentPopup: null,
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
        async getStudents() {
            // Call get all students api endpoint
            await this.$axios
                .get(`/students/`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.studentArray = data;
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
            //Array to display
            this.displayArray = [];
            //Map of index to studentArray index
            this.reflectionMap = {};
            let count = 0;
            //Filter
            switch (this.filterMode) {
                case "All":
                    // if all, display all students
                    this.displayArray = duplicate(this.studentArray);
                    break;
                case "For Approval":
                    // if for approval, only display students with status for approval
                    this.studentArray.forEach((element, index) => {
                        if (element.status === "FOR_APPROVAL") {
                            this.displayArray.push(duplicate(element));
                            this.reflectionMap[count] = index;
                            count++;
                        }
                    });
                    break;
                case "Active / Inactive":
                    // if management, only display students with status not for approval
                    this.studentArray.forEach((element, index) => {
                        if (element.status !== "FOR_APPROVAL") {
                            this.displayArray.push(duplicate(element));
                            this.reflectionMap[count] = index;
                            count++;
                        }
                    });
                    break;
                default:
                    this.displayArray = duplicate(this.studentArray);
            }
        },
        swapFilter() {
            //Get filtered
            this.getFiltered();
            //baseDataArray is the copy of the array
            this.baseDataArray = duplicate(this.displayArray);
            //Reset edited indices
            this.editedIndices = [];
            this.activeId = null;
            this.activeIndex = null;
        },
        update() {
            this.erroredEdits = [];
            //For each edited index, patch the status

            this.editedIndices.forEach(async (index) => {
                await this.$axios
                    .patch(`/students/status/${this.displayArray[index].student_id}`, {
                        status: this.displayArray[index].status,
                    })
                    //If successful, get the student
                    .then(async () => {
                        await this.$axios
                            .get(`/students/id/${this.studentArray[index].student_id}`)
                            //If successful, update the studentArray
                            .then(({ data }) => {
                                this.displayArray[index] = data;
                                //If filter is not all, update the studentArray
                                if (this.filterMode !== "All") {
                                    this.studentArray[this.reflectionMap[index]] = data;
                                } else {
                                    this.studentArray[index] = data;
                                }
                            });
                    })
                    //If unsuccessful, add to errored edits
                    .catch((error) => {
                        console.log(error);
                        this.erroredEdits.push(this.displayArray[index].student_id);
                    });
            });
            //Reset edited indices
            this.editedIndices = [];
            //If there are errored edits, show the error popup
            if (this.erroredEdits.length > 0) {
                this.editErrorPopup = true;
            } else { //Else, show the success popup
                this.title = "Successfully saved all changes.";
                this.description = "The statuses have been successfully changed.";
                this.acception = true;
                this.showUpdatePopup = true;
            }
            //duplicate displayArray to baseDataArray
            this.baseDataArray = duplicate(this.displayArray);
        },
        deleteStudent(student_id, index) {
            //Show delete confirmation popup
            this.currentPopup = "delete-confirmation";
            this.activeId = student_id;
            this.activeIndex = index;
        },
        async runDelete() {
            //Call delete student api endpoint
            await this.$axios
                .delete(`/students/${this.activeId}`)
                //If successful, delete the student
                .then(() => {
                    //Close popup
                    this.currentPopup = null;
                    //Delete the student
                    this.displayArray.splice(this.activeIndex, 1);
                    //If filter is not all, then reflect the deletion in the studentArray
                    if (this.filterMode !== "All") {
                        this.studentArray.splice(this.reflectionMap[this.activeIndex], 1);
                    } else { //Else, keep the studentArray the same
                        this.studentArray.splice(this.activeIndex, 1);
                    }
                    //duplicate displayArray to baseDataArray
                    this.baseDataArray = duplicate(this.displayArray);

                    this.$emit("delete");
                    this.title = "Successfully deleted Student.";
                    this.description =
                        "Student with the ID number " + this.activeId + " has been deleted.";
                    this.acception = true;
                    this.showUpdatePopup = true;
                })
                //If unsuccessful, show error popup
                .catch((error) => {
                    console.log(error);
                    this.showErrorPopup = true;
                });
        },
        // Get title for popup
        getTitle(accepted) {
            if (accepted) {
                return "Student successfully accepted";
            } else {
                return "Student successfully rejected";
            }
        },
        // Get description for popup
        getDescription(accepted, student_id, name) {
            if (accepted) {
                return `Student ${name} with ID: ${student_id} has been successfully accepted`;
            } else {
                return `Student ${name} with ID: ${student_id} has been rejected`;
            }
        },
        // Get color for popup
        getColor(accepted) {
            if (accepted) {
                return "green";
            } else {
                return "red";
            }
        },
        // Accept student
        accept(student_id, name, index) {
            this.title = this.getTitle(true);
            this.description = this.getDescription(true, student_id, name);
            this.acception = true;
            // Update student status to active
            this.updateStudentStatus(student_id, "ACTIVE", index);
        }, // Reject student
        reject(student_id, name, index) {
            this.title = this.getTitle(false);
            this.description = this.getDescription(false, student_id, name);
            this.color = this.getColor(false);
            // Update student status to rejected
            this.updateStudentStatus(student_id, "REJECTED", index);
        },
        // Update student status
        async updateStudentStatus(student_id, status, index) {
            // Call update student status api endpoint
            await this.$axios
                .patch(`/students/status/${student_id}`, {
                    status: status,
                })
                // If successfuls
                .then(({ data }) => {
                    this.showUpdatePopup = true;
                    if (this.filterMode !== "All") {
                        this.displayArray.splice(index, 1);
                    }
                })
                // If unsuccessful
                .then(async () => {
                    // Get student
                    await this.$axios.get(`/students/id/${student_id}`).then(({ data }) => { // Update studentArrays
                        if (this.filterMode !== "All") { //If filter is not all, update the studentArray
                            this.studentArray[this.reflectionMap[index]] = data;
                        } else { //Else, keep the studentArray the same
                            this.studentArray[index] = data;
                            this.displayArray[index] = data;
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.showErrorPopup = true;
                });
                //duplicate displayArray to baseDataArray
            this.baseDataArray = duplicate(this.displayArray);
        },
        // Add edited index
        addEditedIndex(index) {
            if (this.displayArray[index].status === this.baseDataArray[index].status) { //If the status is the same as the baseDataArray, remove from editedIndices
                this.editedIndices.splice(this.editedIndices.indexOf(index), 1);
                return;
            } else if (!this.editedIndices.includes(index)) { //Else, add to editedIndices
                this.editedIndices.push(index);
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
        // Get students
        await this.getStudents().then(() => {
            this.render = true;
        });
    },
};
</script>
