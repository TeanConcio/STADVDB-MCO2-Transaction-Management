<script setup>
import { formatDate } from "../../util/helpers";
// Emits
defineEmits(["on-exit", "success", "fail", "delete"]);
//Props
defineProps({
    payments: Array,
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
                                    for="or_no"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    OR Number<span class="text-required_red">*</span>
                                </label>
                                <select id="or_no" v-model="or_no" required class="rounded-lg border-gray-200">
                                    <option v-for="payment in payments" :value="payment.or_no">
                                        {{ payment.or_no }}
                                    </option>
                                </select>
                                <div class="input-errors" v-if="errors?.or_no">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.or_no }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5">
                                <h1>Payment Information</h1>
                                <p>Bill Number: {{ bill_no }}</p>
                                <p>Payee: {{ payee }}</p>
                            </div>

                            <div class="mb-5">
                                <label
                                    for="payment"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Payment Amount<span class="text-required_red">*</span></label
                                >
                                <input
                                    type="number"
                                    id="payment"
                                    class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    min="0"
                                    max="999999999.99"
                                    required
                                    autocomplete="off"
                                    v-model="payment"
                                />
                                <div class="input-errors" v-if="errors?.payment">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.payment }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label
                                    for="paid_on"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Payment Date<span class="text-required_red">*</span></label
                                >
                                <input
                                    type="date"
                                    id="paid_on"
                                    class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    required
                                    autocomplete="off"
                                    v-model="paid_on"
                                />
                                <div class="input-errors" v-if="errors?.paid_on">
                                    <div class="block mb-2 text-sm font-medium text-highlight">
                                        {{ errors?.paid_on }}
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
                                    autocomplete="off"
                                    v-model="remarks"
                                />
                            </div>
                        </form>
                        <button
                            @click="$emit('on-exit')"
                            type="button"
                            class="mr-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                        >
                            Cancel
                        </button>

                        <button
                            @click="$emit('delete', or_no)"
                            type="button"
                            class="mr-3 mb-3 md:mb-0 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                        >
                            Delete
                        </button>

                        <button
                            @click="submit()"
                            type="button"
                            class="text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center whitespace-pre-line"
                        >
                            Confirm Edit
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
            or_no: null,
            bill_no: null,
            payment: null,
            payee: null,
            remarks: null,
            paid_on: null,
            errors: {},
        };
    },
    methods: {
        submit() {
            // Validate form
            if (this.validate()) {
                this.editPayment();
            }
        },
        async editPayment() {
            let paymentDetails = {
                bill_no: this.bill_no,
                payee: this.payee,
                payment: this.payment,
                paid_on: this.paid_on,
            };

            if (this.remarks !== null) {
                paymentDetails["remarks"] = this.remarks;
            }

            await this.$axios
                .patch(`/payments/${this.or_no}`, paymentDetails)
                .then(() => {
                    this.$emit("success");
                })
                .catch(() => {
                    this.$emit("fail");
                });
        },
        async retrievePaymentInfo() {
            await this.$axios.get(`/payments/${this.or_no}`).then(({ data }) => {
                this.bill_no = data.bill_no;
                this.payee = data.payee;
                this.payment = data.payment;
                this.paid_on = formatDate(data.paid_on);
                this.remarks = data.remarks;
            });
        },
        validate() {
            this.validateOrNo();
            this.validatePayment();
            this.validatePaidOn();

            if (Object.keys(this.errors).length === 0) {
                return true;
            } else {
                return false;
            }
        },
        validateOrNo() {
            const or_list = this.payments.map((element) => {
                return element.or_no;
            });

            if (!or_list.includes(this.or_no)) {
                this.errors["or_no"] = "Invalid OR number";
            } else {
                delete this.errors["or_no"];
            }
        },
        validatePayment() {
            if (this.payment < 1 || this.payment > 999999999.99 || this.payment == null) {
                this.errors["payment"] = "Invalid payment value";
            } else {
                delete this.errors["payment"];
            }
        },
        validatePaidOn() {
            if (Number.isNaN(Date.parse(this.paid_on))) {
                this.errors["paid_on"] = "Must be a valid date";
            } else {
                delete this.errors["paid_on"];
            }
        },
    },
    watch: {
        or_no() {
            this.validateOrNo();
            this.retrievePaymentInfo();
        },
        payment() {
            this.validatePayment();
        },
        paid_on() {
            this.validatePaidOn();
        },
    },
};
</script>
