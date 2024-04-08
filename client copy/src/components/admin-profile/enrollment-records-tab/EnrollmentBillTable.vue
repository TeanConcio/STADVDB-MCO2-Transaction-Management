<script setup>
// Components
import MessagePopup from "../../common/MessagePopup.vue";
import PromptPopup from "../../common/PromptPopup.vue";
// Helpers
import { formatName, addUnique, duplicate } from "../../../util/helpers";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
// Props
defineProps({
    filter: {
        type: String,
        required: true,
    },
});
// Emits
defineEmits(["select-student"]);
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="-mt-14">
        <div class="md:flex justify-between mb-1">
            <div></div>
            <div class="grid">
                <!-- if edit button is clicked, switch to edit mode-->
                <button
                    v-if="!editMode"
                    @click="switchToEditMode()"
                    type="button"
                    class="ml-auto mb-1 w-40 h-12 py-3 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Edit
                </button>
            </div>
            <div v-if="editMode" class="flex items-center justify-center">
                <button
                    @click="currentPopup = 'cancel'"
                    type="button"
                    class="mb-1 w-40 h-12 py-3 text-sm font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Cancel
                </button>
                <button
                    @click="saveChanges()"
                    type="button"
                    class="md:ml-10 mb-1 w-40 h-12 py-3 text-sm font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Save Changes
                </button>
            </div>
        </div>
        <div class="overflow-x-auto shadow-md rounded-lg overflow-y-auto max-h-96">
            <table class="w-full text-gray-500 dark:text-gray-400 text-xl text-center">
                <thead
                    class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">ID Number</th>
                        <th scope="col" class="px-6 py-3">Student Name</th>
                        <th scope="col" class="px-6 py-3">Tuition Fee</th>
                        <th scope="col" class="px-6 py-3">Payments</th>
                        <th scope="col" class="px-6 py-3">OR #</th>
                        <th scope="col" class="px-6 py-3">Balance</th>
                        <th scope="col" class="px-6 py-3">Grade</th>
                        <th v-if="editMode" scope="col" class="hasAction px-6 py-3 text-center">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="billArray?.length === 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Students Found
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium">-</th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">-</th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">-</th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">-</th>
                        <td scope="row" class="px-6 py-3 font-medium" contenteditable="true">-</td>
                        <td scope="row" class="px-6 py-3 font-medium" contenteditable="true">-</td>
                        <td
                            v-if="editMode"
                            scope="row"
                            class="px-6 py-3 font-medium"
                            contenteditable="true"
                        >
                            -
                        </td>
                    </tr>
                    <tr
                        v-for="(bill, index) in billArray"
                        @click="
                            $emit(editMode ? '' : 'select-student', bill.enrollments.student_id)
                        "
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ bill.enrollments.student_id }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium">
                            {{
                                formatName(
                                    bill.enrollments.student.last_name,
                                    bill.enrollments.student.first_name
                                )
                            }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">
                            {{ bill.fee - bill.deductions }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">
                            {{ getPayments(bill.payments) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">
                            {{ getORs(bill.payments) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" contenteditable="true">
                            {{ bill.fee - bill.deductions - getPayments(bill.payments) }}
                        </th>
                        <td class="px-6 py-4" contenteditable="true">
                            {{ bill.enrollments.grade }}
                        </td>
                        <td class="px-6 py-4" v-if="editMode">
                            <!-- if in edit mode, delete button appears-->
                            <button
                                type="button"
                                class="text-white h-fit bg-highlight hover:bg-highlight-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                @click="confirmDeleteStudent(bill)"
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
        v-if="currentPopup === 'invalid-inputs'"
        title="Invalid Inputs."
        description="Please follow the form guides."
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <PromptPopup
        v-if="currentPopup === 'confirmation'"
        title="Are You Sure You Want to Save Changes?"
        description="Please review your changes before saving."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        @on-confirm="updateEnrollments()"
        @on-exit="currentPopup = null"
    />

    <PromptPopup
        v-if="currentPopup === 'cancel'"
        title="Are You Sure You Want to Discard Changes?"
        description="This action cannot be undone."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        @on-confirm="cancelChanges()"
        @on-exit="currentPopup = null"
    />

    <PromptPopup
        v-if="currentPopup === 'delete'"
        title="Are you sure you want to delete this student?"
        description="This action cannot be undone."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        @on-confirm="deleteStudent(deletingBill)"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'success'"
        title="Updated Student Records!"
        description="Student records have been successfully updated."
        accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'error'"
        title="Something went wrong."
        description="Please try again."
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
            // Edit Mode
            editMode: false,
            changedIndices: [],
            backupBillArray: null,
            // Data
            billArray: null,
            deletingBill: null,
            // Popups
            currentPopup: null,
        };
    },
    methods: {
        async getModuleBills() {
            await this.$axios
                .get(`/bills/module/${this.filter}`)
                // If successful
                .then(({ data }) => {
                    // Store data
                    this.billArray = data;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        // Save changes
        getPayments(payments) {
            let total = 0;
            // Add all payments
            payments.forEach((element) => {
                total += parseFloat(element.payment);
            });

            return total;
        },
        getORs(payments) {
            let orString = "";
            // Add all paymentss
            for (let i = 0; i < payments.length; i++) {
                if (i !== payments.length - 1) {
                    orString += `${payments[i].or_no}, `;
                } else {
                    orString += `${payments[i].or_no}`;
                }
            }
            // Return string of OR
            return orString;
        },
        switchToEditMode() {
            // Switch to edit mode
            this.editMode = true;
            // Store backup
            this.backupEnrollmentsArray = duplicate(this.moduleEnrollmentArray);
        },
        confirmDeleteStudent(bill) {
            // Store deleting bill and set popup to deletes
            this.deletingBill = bill;
            this.currentPopup = "delete";
        },
        async deleteStudent(bill) {
            this.$axios
            // Call delete bill api endpoint
                .delete(
                    `/bills/delete/${bill.bill_no}/${bill.enrollments.module_name}/${bill.enrollments.school_year}/${bill.enrollments.student_id}`
                )
                // Assuming successful deletion
                .then(() => {
                    this.currentPopup = null;
                    return this.getModuleBills();
                })
                // Print error if not
                .catch((error) => {
                    console.error(error);
                });
        },
    },
    watch: {
        async filter() {
            if (!this.editMode) { // if not in edit mode, refresh
                await this.getModuleBills().then(() => {
                    this.render = true;
                });
            }
        },
    },
    async created() {
        await this.getModuleBills().then(() => {
            this.render = true;
        });
    },
};
</script>
