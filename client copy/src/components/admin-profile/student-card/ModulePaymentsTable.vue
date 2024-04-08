<script setup>
import { formatDate, formatEnum, addUnique, formatText, duplicate } from "../../../util/helpers";
import MessagePopup from "../../common/MessagePopup.vue";
import BillInputPopup from "../../common/BillInputPopup.vue";
import PromptPopup from "../../common/PromptPopup.vue";
defineProps({
    student_id: String,
    finance_info: Array,
});

defineEmits(["add-success", "delete-success"]);
</script>

<template>
    <div class="grid">
        <button
            v-if="!editMode"
            @click="switchToEditMode()"
            type="button"
            class="ml-auto mb-1 w-21 h-12 px-10 py-3 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
        >
            Edit
        </button>
    </div>
    <div v-if="editMode" class="ml-auto grid grid-cols-2 gap-2">
        <button
            @click="currentPopup = 'cancel'"
            type="button"
            class="mb-1 w-21 h-12 px-4 md:px-10 py-3 text-sm font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
        >
            Cancel
        </button>
        <button
            @click="saveChanges()"
            type="button"
            class="md:ml-10 mb-1 w-30 h-12 px-4 md:px-10 py-3 text-sm font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
        >
            Save Changes
        </button>
    </div>
    <div class="overflow-x-auto shadow-md rounded-lg overflow-y-auto max-h-96">
        <table
            class="text-gray-500 dark:text-gray-400 text-center w-[2200px] table-fixed min-w-full"
        >
            <thead
                class="text-xs text-white uppercase bg-highlight dark:bg-gray-700 dark:text-gray-400 sticky top-0"
            >
                <tr>
                    <th scope="col" class="px-3 py-6 w-[15%]">Module</th>
                    <th scope="col" class="px-3 py-3">Bill Number</th>
                    <th scope="col" class="px-3 py-3">Tuition Fee</th>
                    <th scope="col" class="px-3 py-3">Deductions</th>
                    <th scope="col" class="px-3 py-3">Bill Issued On</th>
                    <th scope="col" class="px-3 py-3">
                        <label for="bill_status">Bill Status</label>
                    </th>
                    <th scope="col" class="px-3 py-3 text-center w-[15%]">Remarks</th>
                    <th scope="col" class="px-3 py-3">OR Number</th>
                    <th scope="col" class="px-3 py-3">Payment</th>
                    <th scope="col" class="px-3 py-3">Paid On</th>
                    <th scope="col" class="px-3 py-3 w-[15%]">Payment Remarks</th>
                    <th scope="col" class="px-3 py-3 text-center">Balance</th>
                    <th scope="col" class="px-3 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    v-for="(entry, index) of displayData"
                >
                    <th
                        scope="row"
                        class="px-3 py-4 font-medium text-gray-900 dark:text-white w-fit"
                    >
                        {{ entry.module_name + "-" + entry.school_year }}
                    </th>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ entry.bill.bill_no }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>
                        <span
                            @click="addBill(entry, index)"
                            class="font-medium text-highlight_hover dark:text-highlight_hover hover:underline"
                        >
                            Add Bill
                        </span>
                    </td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null && !editMode">
                        {{ entry.bill.fee }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else-if="entry.bill !== null && editMode">
                        <input
                            @change="editFee(entry.bill.fee, index)"
                            type="number"
                            id="fee"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="0.00"
                            min="0"
                            max="999999999.99"
                            required
                            autocomplete="off"
                            v-model="entry.bill.fee"
                        />
                        <div class="input-errors" v-if="errors?.index?.fee">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors?.index?.fee }}
                            </div>
                        </div>
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null && !editMode">
                        {{ entry.bill.deductions }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else-if="entry.bill !== null && editMode">
                        <input
                            @change="editDeduction(entry.bill.deductions, index)"
                            type="number"
                            id="fee"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="0.00"
                            min="0"
                            max="999999999.99"
                            required
                            autocomplete="off"
                            v-model="entry.bill.deductions"
                        />
                        <div class="input-errors" v-if="errors?.index?.deductions">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors?.index?.deductions }}
                            </div>
                        </div>
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null && !editMode">
                        {{ formatDate(entry.bill?.issued_on) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else-if="entry.bill !== null && editMode">
                        <input
                            @change="editIssuedOn(entry.bill.issued_on, index)"
                            type="date"
                            id="issued_on"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            required
                            autocomplete="off"
                            v-model="entry.bill.issued_on"
                        />
                        <div class="input-errors" v-if="errors?.index?.issued_on">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors?.index?.issued_on }}
                            </div>
                        </div>
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null && !editMode">
                        {{ formatEnum(entry.bill?.status) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else-if="entry.bill !== null && editMode">
                        <select
                            id="bill_status"
                            @change="editStatus(entry.bill.status, index)"
                            v-model="entry.bill.status"
                            required
                            class="w-full"
                        >
                            <option
                                v-for="val in statuses"
                                :selected="val === entry.bill.status"
                                :value="val"
                            >
                                {{ formatEnum(val) }}
                            </option>
                        </select>
                        <div class="input-errors" v-if="errors?.index?.status">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors?.index?.status }}
                            </div>
                        </div>
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null && !editMode">
                        {{ formatText(entry.bill?.remarks) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else-if="entry.bill !== null && editMode">
                        <input
                            type="text"
                            id="remarks"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="Remarks"
                            autocomplete="off"
                            v-model="entry.bill.remarks"
                        />
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill?.payments.length > 0">
                        {{ getOR(entry.bill.payments) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill?.payments.length > 0">
                        {{ getPayments(entry.bill.payments) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill?.payments.length > 0">
                        {{ getPaymentDates(entry.bill.payments) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill?.payments.length > 0">
                        {{ getRemarks(entry.bill.payments) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ getBalance(entry) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        <span
                            @click="deleteBill(entry.bill.bill_no, entry, index)"
                            class="font-medium text-highlight_hover dark:text-highlight_hover hover:underline"
                        >
                            Delete Bill
                        </span>
                    </td>
                    <td scope="row" class="px-3 py-3" v-else></td>
                </tr>
            </tbody>
        </table>
    </div>

    <BillInputPopup
        v-if="currentPopup === 'add-bill'"
        :module="activeModule"
        :student_id="student_id"
        @on-exit="currentPopup = null"
        @success="
            (bill) => {
                addSuccess(bill);
            }
        "
        @fail="currentPopup = 'error'"
    />

    <PromptPopup
        v-if="currentPopup === 'delete-bill-confirmation'"
        title="Are You Sure You Want to Delete This Bill?"
        description="WARNING: This action will delete the bill and its associated payments. This action CANNOT be undone."
        confirm-text="Proceed"
        exit-text="Cancel"
        @on-confirm="runDelete()"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'add'"
        title="Added Bill!"
        description="Bill has been successfully added."
        :accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'edit'"
        title="Edited Bill!"
        description="Bill has been successfully edited."
        :accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'delete'"
        title="Deleted Bill!"
        description="Bill has been successfully deleted."
        :accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'error'"
        title="Something went wrong."
        description="Please try again."
        :accepted="false"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'error-edit'"
        :title="`Something went wrong with editing bill numbers: ${this.errored_edits}`"
        description="Please try again."
        :accepted="false"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <MessagePopup
        v-if="currentPopup === 'success'"
        title="Edit Successful"
        description="Successfully applied all edits"
        :accepted="true"
        exit-text="Close"
        @on-exit="currentPopup = null"
    />

    <PromptPopup
        v-if="currentPopup === 'cancel'"
        title="Are You Sure You Want to Discard Changes?"
        description="This action cannot be undone."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        :accepted="false"
        @on-confirm="cancelChanges()"
        @on-exit="currentPopup = null"
    />

    <PromptPopup
        v-if="currentPopup === 'confirmation'"
        title="Are You Sure You Want to Save Changes?"
        description="Please review your changes before saving."
        confirm-text="Yes, I'm sure"
        exit-text="No, cancel"
        @on-confirm="updateData()"
        @on-exit="currentPopup = null"
    />
</template>

<script>
export default {
    data() {
        return {
            // Data
            currentPopup: null,
            activeModule: null,
            selectedBillNumber: null,
            editMode: false,
            displayData: null,
            unalteredCopy: null,
            editedIndex: null,
            editedIndices: [],
            errors: {}, // {index: {field: error}}
            statuses: ["FULLY_PAID", "PARTIALLY_PAID", "UNPAID"],
            errored_edits: [], // [bill_no]
        };
    },
    methods: {
        // Data
        async updateData() {
            // Update all edited bills
            this.errored_edits = [];
            for (const index of this.editedIndices) { // for each edited bill
                // Update bill
                const value = {
                    status: this.displayData[index].bill.status,
                    fee: this.displayData[index].bill.fee,
                    deductions: this.displayData[index].bill.deductions,
                    issued_on: formatDate(this.displayData[index].bill.issued_on),
                    billed_to: this.student_id,
                };

                // Send patch request
                await this.$axios
                    .patch(`/bills/${this.displayData[index].bill.bill_no}`, value)
                    .catch(() => {
                        this.errored_edits.push(this.displayData[index].bill.bill_no);
                    });
            }

            if (this.errored_edits.length > 1) { // if there are multiple errors, show error-edit popup
                this.currentPopup = "errored-edits";
            } else { // else show success popup
                this.currentPopup = "success";
            }

            this.editMode = false;
        },
        switchToEditMode() {
            // set edit mode to true and create a copy of the data
            this.editMode = true;
            this.unalteredCopy = duplicate(this.finance_info);
        },
        // save changes
        saveChanges() {
            if (this.validate()) { // if all inputs are valid, show confirmation popup
                this.currentPopup = "confirmation";
            } else { // else show invalid inputs popup
                this.currentPopup = "invalid-inputs";
            }
        },
        // Cancel changes
        cancelChanges() {
            // set edit mode to false and reset data
            this.editMode = false;
            this.displayData = duplicate(this.unalteredCopy);
            this.unalteredCopy = null;
            this.errors = {};
            this.edits = [];
            this.currentPopup = null;
        },
        async runDelete() {
            // Send delete request
            await this.$axios
                .delete(
                    `/bills/delete/${this.selectedBillNumber}/${this.activeModule.module_name}/${this.activeModule.school_year}/${this.student_id}`
                )
                .then(() => {
                    this.currentPopup = "delete";
                    this.displayData[this.editedIndex].bill = null;
                    this.$emit("delete-success");
                })
                .catch(() => {
                    this.currentPopup = "error";
                });
        },
        // method to delete bill
        deleteBill(selectedBill, activeModule, index) {
            // Show delete confirmation popup
            this.currentPopup = "delete-bill-confirmation";
            this.selectedBillNumber = selectedBill;
            this.activeModule = activeModule;
            this.editedIndex = index;
        },
        // method to add bill
        addBill(module, index) {
            this.currentPopup = "add-bill";
            this.activeModule = module;
            this.editedIndex = index;
        },
        async addSuccess(bill) {
            // show add success popup
            this.currentPopup = "add";
            await this.$axios.get(`/bills/${bill.bill_no}`).then(({ data }) => {
                this.displayData[this.editedIndex].bill = data;
            });
            this.$emit("add-success");
        },
        getBalance(entry) { // get balance of bill
            const total = entry.bill.fee - entry.bill.deductions;

            let paid = 0;
            for (const payment of entry.bill?.payments) { // for each payment
                paid += parseInt(payment.payment); // add to total paid
            }

            return total - paid; // return balance
        },
        getOR(payments) {
            // get ORs and return as string
            let orString = "";

            for (let i = 0; i < payments.length; i++) { //for each payment, add to string, add comma if not last
                if (i !== payments.length - 1) {
                    orString += `${payments[i].or_no}, `;
                } else {
                    orString += `${payments[i].or_no}`;
                }
            }

            return orString;
        },
        getPayments(payments) {
            // get payments and return as string
            let paymentString = "";

            for (let i = 0; i < payments.length; i++) { //for each payment, add to string, add comma if not last
                if (i !== payments.length - 1) {
                    paymentString += `${payments[i].payment}, `;
                } else {
                    paymentString += `${payments[i].payment}`;
                }
            }

            return paymentString;
        },
        getPaymentDates(payments) {
            // get payment dates and return as string
            let dateString = "";

            for (let i = 0; i < payments.length; i++) {
                if (i !== payments.length - 1) {
                    dateString += `${formatDate(payments[i].paid_on)}, `;
                } else {
                    dateString += `${formatDate(payments[i].paid_on)}`;
                }
            }

            return dateString;
        },
        getRemarks(payments) {
            // get remarks and return as string
            let remarksString = "";

            for (let i = 0; i < payments.length; i++) {
                if (i !== payments.length - 1) {
                    if (payments[i].remarks === null) { // if no remarks, add "No remarks", add comma if not last
                        remarksString += `No remarks, `;
                    } else {
                        remarksString += `${payments[i].remarks}, `;
                    }
                } else {
                    if (payments[i].remarks === null) {// if no remarks, add "No remarks"
                        remarksString += `No remarks `;
                    } else {
                        remarksString += `${payments[i].remarks} `;
                    }
                }
            }

            return remarksString;
        },
        editFee(fee, index) {
            // if fee is valid, set fee and add index to editedIndices
            // fee is formatted to 2 decimal places
            const formattedFee = parseFloat(fee).toFixed(2);
            if (this.validateFee(formattedFee, index)) {
                this.displayData[index].bill.fee = formattedFee;
                addUnique(this.editedIndices, index);
            }
        },
        editDeduction(deduction, index) {
            // if deduction is valid, set deduction and add index to editedIndices
            const formattedDeduction = parseFloat(deduction).toFixed(2);
            if (this.validateDeductions(formattedDeduction, index)) {
                this.displayData[index].bill.deductions = formattedDeduction;
                addUnique(this.editedIndices, index);
            }
        },
        editStatus(status, index) {
            // if status is valid, set status and add index to editedIndices
            if (this.validateStatus(status, index)) {
                this.displayData[index].bill.status = status;
                addUnique(this.editedIndices, index);
            }
        },
        editIssuedOn(issued_on, index) {
            // if issued_on is valid, set issued_on and add index to editedIndices
            if (this.validateIssuedOn(issued_on, index)) {
                this.displayData[index].bill.issued_on = issued_on;
                addUnique(this.editedIndices, index);
            }
        },
        //Validators
        validate() {
            this.editedIndices.forEach((index) => {
                this.validateStatus(this.displayData[index].status, index);
                this.validateFee(this.displayData[index].fee, index);
                this.validateDeductions(this.displayData[index].deductions, index);
                this.validateIssuedOn(this.displayData[index].issued_on, index);
            });

            if (
                // if every key in errors has no errors, return true
                Object.keys(this.errors).every((key) => Object.keys(this.errors[key]).length === 0)
            ) {
                return true;
            } else {
                return false;
            }
        },
        validateStatus(status, index) {
            // if status is valid, delete error and return true
            this.errors[index] = {};
            if (!this.statuses.includes(status)) { // if status is not in statuses, add error
                this.errors[index]["status"] = "Must be a valid status";
            } else { // else delete error
                delete this.errors[index]["status"];
                return true;
            }

            return false;
        },
        validateFee(fee, index) {
            // if fee is valid, delete error and return true
            this.errors[index] = {};
            if (fee < 0 || fee > 999999999.99) { // if fee is not in range, add error
                this.errors[index]["fee"] = "Invalid fee value";
            } else {
                delete this.errors[index]["fee"];
                return true;
            }

            return false;
        },
        validateDeductions(deductions, index) {
            // if deductions is valid, delete error and return true
            this.errors[index] = {};
            if (deductions < 0 || deductions > 999999999.99) { // if deductions is not in range, add error
                this.errors[index]["deductions"] = "Invalid deductions value";
            } else {
                delete this.errors[index]["deductions"];
                return true;
            }

            return false;
        },
        validateIssuedOn(issued_on, index) {
            // if issued_on is valid, delete error and return true
            this.errors[index] = {};
            if (Date.parse(issued_on) === NaN) { // if issued_on is not a valid date, add error
                this.errors[index]["issued_on"] = "Must be a valid date";
            } else {
                delete this.errors[index]["issued_on"];
                return true;
            }

            return false;
        },
    },
    created() {
        // set displayData to finance_info
        this.displayData = duplicate(this.finance_info);
    },
    watch: {
        finance_info() {
            this.displayData = this.finance_info;
        },
    },
};
</script>
