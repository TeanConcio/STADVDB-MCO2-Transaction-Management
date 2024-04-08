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
                        <th scope="col" class="px-6 py-3">Request ID</th>
                        <th scope="col" class="px-6 py-3">Requester</th>
                        <th scope="col" class="px-6 py-3">Date Requested</th>
                        <th scope="col" class="px-6 py-3">
                            <label for="status">Status</label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="TORRequestArray === null || TORRequestArray.length === 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            No Transcript Requests Found
                        </th>
                    </tr>
                    <!-- display the TOR requests from the TORRrequestArray-->
                    <tr
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        v-for="(TORRequest, index) in TORRequestArray"
                    >
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{ TORRequest.req_id }}
                        </th>
                        <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {{
                                formatName(
                                    TORRequest.student.last_name,
                                    TORRequest.student.first_name
                                )
                            }}
                        </th>
                        <th
                            scope="row"
                            class="px-6 py-3 font-medium"
                            v-if="TORRequest.status === 'PENDING'"
                        >
                            {{ formatDate(TORRequest.request_date) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium" v-else>
                            {{ formatDate(TORRequest.request_date) }}
                        </th>
                        <th scope="row" class="px-6 py-3 font-medium">
                            <select
                                id="status"
                                v-model="statusArray[index]"
                                @change="addEditedIndex(index)"
                                :class="{
                                    'text-edited': statusArray[index] !== TORRequest.status,
                                }"
                            >
                                <option
                                    :selected="status === TORRequest.status"
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
</template>

<script>
export default {
    data() {
        return {
            // Render
            render: false,
            // Data
            TORRequestArray: null,
            baseTORRequestArray: null,
            statusArray: null,
            editArray: [],
            statuses: ["PENDING", "REJECTED", "UNPAID", "SENT"],
            //Popups
            showUpdatePopup: false,
            showErrorPopup: false,
            //Props
            title: "",
            description: "",
            acception: false,
        };
    },
    methods: {
        // Get TORs
        async getTORs() {
            // Call login api endpoint
            await this.$axios
                .get(`/tor_requests/`)
                // If get all teachers is successful
                .then(({ data }) => {
                    // Store teacher data in faculty
                    this.TORRequestArray = data;
                    this.statusArray = this.TORRequestArray.map((element) => {
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
                    .patch(`/tor_requests/${data.req_id}`, { status: data.status })
                    .catch((error) => {
                        console.log(error);
                        errorsID.push(data.req_id);
                    });
            }
            // if all updates failed, show error popup
            if (errorsID.length === this.editArray.length) {
                this.showErrorPopup = true;
            } else if (errorsID.length > 1) { // if some updates failed, show error popup with the failed request ID's
                this.title = "Error with some updates";
                this.description = "Error with Request ID's:  ";
                this.acception = false;
                errorsID.forEach((element) => { // add the failed request ID's to the description
                    this.description += `${element}, `;
                });
                // remove the last comma and space
                this.description = this.description.slice(0, this.description.length - 2);
                this.showUpdatePopup = true;
                await this.getTORs(); // refresh the table
            } else { // if all updates are successful, show success popup
                this.title = "All updates successful";
                this.description = "Request ID's:  ";
                this.acception = true;
                this.editArray.forEach((element) => { // add the successful request ID's to the description
                    this.description += `${element.req_id}, `;
                });
                // remove the last comma and space
                this.description = this.description.slice(0, this.description.length - 2);
                this.description += " have been successfully edited";
                // show success popup
                this.showUpdatePopup = true;
                this.editArray = [];
                await this.getTORs();
            }
        },
        // Add edited index
        addEditedIndex(index) {
            // if the status is changed, add the request ID and status to the editArray
            if (this.TORRequestArray[index].status !== this.statusArray[index]) {
                
                // Update the status of the request in editArray if it already exists, if not, then add it
                let found = this.editArray.find(
                    (element) => element.req_id === this.TORRequestArray[index].req_id
                );
                if (found) {
                    found.status = this.statusArray[index];
                } else {
                    this.editArray.push({
                        req_id: this.TORRequestArray[index].req_id,
                        status: this.statusArray[index],
                    });
                }

            } else { // if the status is changed back to the original, remove the request ID and status from the editArray
                this.editArray = this.editArray.filter(
                    (element) => element.req_id !== this.TORRequestArray[index].req_id
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
            await this.getTORs().then(() => {
                this.render = true;
            });
        },
    },
    async created() {
        // Get TORs
        await this.getTORs().then(() => {
            this.render = true;
        });
    },
};
</script>
