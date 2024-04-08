<script setup>
import { formatDate, formatEnum, formatText, duplicate } from "../../util/helpers";
import MessagePopup from "../common/MessagePopup.vue";
defineProps({
    student_id: String,
    finance_info: Array,
});

defineEmits(["add-success", "delete-success"]);
</script>

<template>
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
                    <th scope="col" class="px-3 py-3">Bill Status</th>
                    <th scope="col" class="px-3 py-3 text-center w-[15%]">Remarks</th>
                    <th scope="col" class="px-3 py-3">OR Number</th>
                    <th scope="col" class="px-3 py-3">Payment</th>
                    <th scope="col" class="px-3 py-3">Paid On</th>
                    <th scope="col" class="px-3 py-3 w-[15%]">Payment Remarks</th>
                    <th scope="col" class="px-3 py-3 text-center">Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    v-for="(entry) of displayData"
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
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ entry.bill.fee }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ entry.bill.deductions }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ formatDate(entry.bill?.issued_on) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ formatEnum(entry.bill?.status) }}
                    </td>
                    <td scope="row" class="px-3 py-3" v-else>-</td>

                    <td scope="row" class="px-3 py-3" v-if="entry.bill !== null">
                        {{ formatText(entry.bill?.remarks) }}
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
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Data
            displayData: null,
        };
    },
    methods: {
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
