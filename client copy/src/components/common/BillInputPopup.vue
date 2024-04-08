<script setup>
import { formatEnum } from "../../util/helpers";

// Emits
defineEmits(["on-exit", "success", "fail"]);
//Props
defineProps({
    module: Object,
    student_id: String,
});
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
                        data-modal-hide="popup-modal-success"
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
                        <form v-on:submit.prevent="onSubmit">
                            <div class="mb-5">
                                <label
                                    for="status"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Bill Status<span class="text-required_red">*</span>
                                </label>
                                <select 
                                    id="status"
                                    v-model="status" 
                                    required>
                                    <option selected disabled hidden>Select</option>
                                    <option v-for="val in statuses" :value="val">
                                        {{ formatEnum(val) }}
                                    </option>
                                </select>
                                <div class="input-errors" v-if="errors?.status">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.status }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label
                                    for="fee"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Fee<span class="text-required_red">*</span></label
                                >
                                <input
                                    type="number"
                                    id="fee"
                                    class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder="0.00"
                                    min="0"
                                    max="999999999.99"
                                    required
                                    autocomplete="off"
                                    v-model="fee"
                                />
                                <div class="input-errors" v-if="errors?.fee">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.fee }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label
                                    for="deductions"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Deductions<span class="text-required_red">*</span></label
                                >
                                <input
                                    type="number"
                                    id="deductions"
                                    class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder="0.00"
                                    min="0"
                                    max="999999999.99"
                                    required
                                    autocomplete="off"
                                    v-model="deductions"
                                />
                                <div class="input-errors" v-if="errors?.deductions">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.deductions }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label
                                    for="issued_on"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Issued On<span class="text-required_red">*</span></label
                                >
                                <input
                                    type="date"
                                    id="issued_on"
                                    class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    required
                                    autocomplete="off"
                                    v-model="issued_on"
                                />
                                <div class="input-errors" v-if="errors?.issued_on">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.issued_on }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label
                                    for="remarks"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Remarks</label
                                >
                                <input
                                    type="text"
                                    id="remarks"
                                    class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder="Remarks"
                                    autocomplete="off"
                                    v-model="remarks"
                                />
                            </div>
                        </form>

                        <button
                            @click="submit()"
                            type="button"
                            class="text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 whitespace-pre-line"
                        >
                            Add Payment
                        </button>
                        <button
                            @click="$emit('on-exit')"
                            type="button"
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                        >
                            Exit
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
            //Fields
            fee: null,
            deductions: null,
            status: null,
            remarks: null,
            issued_on: null,
            //Errors
            errors: {},
            //Constants
            statuses: ["FULLY_PAID", "PARTIALLY_PAID", "UNPAID"],
        };
    },
    methods: {
        submit() {
            // Validate form
            if (this.validate()) {
                this.addBill();
            }
        },
        async addBill() {
            let bill = {
                fee: this.fee,
                deductions: this.deductions,
                issued_on: this.issued_on,
                status: this.status,
                billed_to: this.student_id,
            };

            if (this.remarks?.length > 0) {
                bill["remarks"] = this.remarks;
            }

            await this.$axios
                .post(
                    `/bills/bill/${this.module.module_name}/${this.module.school_year}/${this.student_id}`,
                    bill
                )
                .then(({ data }) => {
                    this.$emit("success", data.bill);
                })
                .catch(() => {
                    this.$emit("fail");
                });
        },
        validate() {
            this.validateFee();
            this.validateDeductions();
            this.validateIssuedOn();
            this.validateStatus();

            if (Object.keys(this.errors).length === 0) {
                return true;
            } else {
                return false;
            }
        },
        validateStatus() {
            if (!this.statuses.includes(this.status)) {
                this.errors["status"] = "Must be a valid status";
            } else {
                delete this.errors["status"];
            }
        },
        validateFee() {
            if (this.fee < 0 || this.fee > 999999999.99 || this.fee == null) {
                this.errors["fee"] = "Invalid fee value";
            } else {
                delete this.errors["fee"];
            }
        },
        validateDeductions() {
            if (this.deductions < 0 || this.deductions > 999999999.99 || this.deductions == null) {
                this.errors["deductions"] = "Invalid deductions value";
            } else {
                delete this.errors["deductions"];
            }
        },
        validateIssuedOn() {
            if (Number.isNaN(Date.parse(this.issued_on))) {
                this.errors["issued_on"] = "Must be a valid date";
            } else {
                delete this.errors["issued_on"];
            }
        },
    },
    watch: {
        fee() {
            this.validateFee();
        },
        deductions() {
            this.validateDeductions();
        },
        status() {
            this.validateStatus();
        },
        issued_on() {
            this.validateIssuedOn();
        },
    },
};
</script>
