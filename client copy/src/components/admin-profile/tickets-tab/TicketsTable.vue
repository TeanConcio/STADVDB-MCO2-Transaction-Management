<script setup>
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import MessagePopup from "../../common/MessagePopup.vue";
import { formatDate, formatName, formatEnum, duplicate } from "@/util/helpers";
defineProps({
    refreshToggle: Boolean,
});
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div
        v-else
        :class="{
            '-mt-12': wasEdited,
        }"
        class="overflow-x-auto shadow-md rounded-lg overflow-y-auto"
    >
        <div class="grid ">
            <button
                v-if="wasEdited"
                @click="update()"
                type="button"
                class="ml-auto mb-2 w-15 h-13 px-5 py-2 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
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
                        <th scope="col" class="px-6 py-3">Ticket ID</th>
                        <th scope="col" class="px-6 py-3">Sender</th>
                        <th scope="col" class="px-6 py-3">Email</th>
                        <th scope="col" class="px-6 py-3">Mobile</th>
                        <th scope="col" class="px-6 py-3">Create Date</th>
                        <th scope="col" class="px-6 py-3">Ticket Info</th>
                        <th scope="col" class="px-6 py-3">
                            <label for="status">Status</label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="TicketArray === null || TicketArray.length === 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Tickets Found
                        </th>
                    </tr>
                    <!-- display the Ticket tickets from the TicketArray-->
                    <tr
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        v-for="(Ticket, index) in TicketArray"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ Ticket.ticket_id }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{
                                formatName(
                                    Ticket.last_name,
                                    Ticket.first_name
                                )
                            }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ Ticket.email }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ Ticket.mobile_number }}
                        </th>

                        <th
                            scope="row"
                            class="px-6 py-3 font-medium"
                            v-if="Ticket.status === 'PENDING'"
                        >
                            {{ formatDate(Ticket.create_date) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" v-else>
                            {{ formatDate(Ticket.create_date) }}
                        </th>

                        <td class="px-6 py-4">
                            <button
                                @click="
                                    popup_title = Ticket.title;
                                    popup_description = Ticket.description;
                                    acception = true;
                                    showMessagePopup = true;
                                "
                                type="button"
                                class="xl:w-auto w-full mr-3 mb-3 xl:mb-0 text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 whitespace-pre-line"
                            >
                                View
                            </button>
                        </td>

                        <th scope="row" class="px-6 py-3 font-medium">
                            <select
                                id="status"
                                v-model="statusArray[index]"
                                @change="addEditedIndex(index)"
                                :class="{
                                    'text-edited': statusArray[index] !== Ticket.status,
                                }"
                            >
                                <option
                                    :selected="status === Ticket.status"
                                    v-for="status in statuses"
                                    :value="status"
                                >
                                    {{ formatEnum(status) }}
                                </option>
                            </select>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <MessagePopup
        v-if="showMessagePopup"
        :title="popup_title"
        :description="popup_description"
        :accepted="acception"
        exit-text="Close"
        @on-exit="showMessagePopup = false"
    />

    <MessagePopup
        v-if="showErrorPopup"
        title="Update Failed"
        description="Something went wrong with executing the update"
        exit-text="Close"
        @on-exit="showErrorPopup = false"
    />
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Data
            TicketArray: null,
            baseTicketArray: null,
            statusArray: null,
            editArray: [],
            statuses: ["PENDING", "RESPONDED", "SPAM", "CLOSED"],
            //Popups
            showMessagePopup: false,
            showErrorPopup: false,
            //Props
            popup_title: "",
            popup_description: "",
            acception: false,
        };
    },
    methods: {
        // Get Tickets
        async getTickets() {
            // Call login api endpoint
            await this.$axios
                .get(`/tickets/`)
                // If get all tickets is successful
                .then(({ data }) => {
                    // Store ticket data in list
                    this.TicketArray = data;
                    this.statusArray = this.TicketArray.map((element) => {
                        return element.status;
                    });
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        //Update DB
        async update() {
            // create an array of errors
            let errorsID = [];

            // for each data in editArray, patch the status
            for (const data of this.editArray) {
                await this.$axios
                    .patch(`/tickets/${data.ticket_id}`, { status: data.status })
                    .catch((error) => {
                        console.log(error);
                        errorsID.push(data.ticket_id);
                    });
            }

            // if all updates failed, show error popup
            if (errorsID.length === this.editArray.length) {
                this.showErrorPopup = true;
            } else if (errorsID.length > 1) { // if some updates failed, show error popup with the failed ticket ID
                this.popup_title = "Error with some updates";
                this.popup_description = "Error with Ticket ID:  ";
                this.acception = false;
                errorsID.forEach((element) => { // add the failed ticket ID to the description
                    this.popup_description += `${element}, `;
                });
                // remove the last comma and space
                this.popup_description = this.popup_description.slice(0, this.popup_description.length - 2);
                this.showMessagePopup = true;
                await this.getTickets(); // refresh the table
            } else { // if all updates are successful, show success popup
                this.popup_title = "All updates successful";
                this.popup_description = "Ticket ID:  ";
                this.acception = true;
                this.editArray.forEach((element) => { // add the successful ticket ID to the description
                    this.popup_description += `${element.ticket_id}, `;
                });
                // remove the last comma and space
                this.popup_description = this.popup_description.slice(0, this.popup_description.length - 2);
                this.popup_description += " have been successfully edited";
                // show success popup
                this.showMessagePopup = true;
                this.editArray = [];
                await this.getTickets();
            }
        },
        // Add edited index
        addEditedIndex(index) {
            // if the status is changed, add the ticket ID and status to the editArray
            if (this.TicketArray[index].status !== this.statusArray[index]) {

                // Update the status of the ticket in editArray if it already exists, if not, then add it
                let found = this.editArray.find(
                    (element) => element.ticket_id === this.TicketArray[index].ticket_id
                );
                if (found) {
                    found.status = this.statusArray[index];
                } else {
                    this.editArray.push({
                        ticket_id: this.TicketArray[index].ticket_id,
                        status: this.statusArray[index],
                    });
                }
                
            } else { // if the status is changed back to the original, remove the ticket ID and status from the editArray
                this.editArray = this.editArray.filter(
                    (element) => element.ticket_id !== this.TicketArray[index].ticket_id
                );
            }
        },
    },
    computed: {
        wasEdited() { // check if the editArray is empty
            return this.editArray.length > 0;
        },
    },
    watch: {
        async refreshToggle() { // if refreshToggle is changed, refresh the table
            this.render = false;
            await this.getTickets().then(() => {
                this.render = true;
            });
        },
    },
    async created() {
        // Get Tickets
        await this.getTickets().then(() => {
            this.render = true;
        });
    },
};
</script>
