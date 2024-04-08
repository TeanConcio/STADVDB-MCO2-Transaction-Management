<script setup>
import MessagePopup from "../../components/common/MessagePopup.vue";
import ErrorMessagePopup from "../../components/common/ErrorMessagePopup.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";
</script>

<template>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner v-if="loading" />
    </div>
    <div
        class="w-full bg-white rounded-lg mx-auto p-4 shadow dark:border sm:max-w-xl xl:p-0 md:max-p-4 lg:p-8 mb-8"
    >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
                Contact Us!
            </h1>
            <h2
                class="text-base font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white"
            >
                Have any concerns? We'd love to hear from you!
            </h2>
            <form v-on:submit.prevent="onSubmit">
                
                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="first_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            First Name<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="first_name"
                            id="firstname"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="First Name"
                            required
                            autocomplete="off"
                            v-model="firstname"
                        />
                        <div class="input-errors" v-if="errors.firstname">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.firstname }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="last_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Last Name<span class="text-required_red">*</span></label
                        >
                        <input
                            type="last_name"
                            id="lastname"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="Last Name"
                            required
                            autocomplete="off"
                            v-model="lastname"
                        />
                        <div class="input-errors" v-if="errors.lastname">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.lastname }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-2 md:gap-3">

                    <div class="mb-5">
                        <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Email Address<span class="text-required_red">*</span></label
                        >
                        <input
                            type="email"
                            id="email"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="name1990@example.com"
                            required
                            autocomplete="off"
                            v-model="email"
                        />
                        <div class="input-errors" v-if="errors.email">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.email }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="mobile"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Mobile Number<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="string"
                            id="mobile"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="09XXXXXXXXX"
                            required
                            autocomplete="off"
                            v-model="mobile_no"
                        />
                        <div class="input-errors" v-if="errors.mobile_no">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.mobile_no }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                        <label
                            for="title"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            What can we help you with?<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="title"
                            id="firstname"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Title"
                            required
                            autocomplete="off"
                            v-model="title"
                        />
                        <div class="input-errors" v-if="errors.title">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.title }}
                            </div>
                        </div>
                    </div>

                <div class="mb-5">
                    <label
                        for="description"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Can you tell us more about it?<span
                            class="text-required_red"
                            >*</span
                        >
                    </label>
                    <textarea
                        id="description"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write here..."
                        v-model="description"
                        required
                    ></textarea>
                    <div class="input-errors" v-if="errors.description">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.description }}
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <button
                        type="submit"
                        class="text-white bg-highlight hover:bg-highlight_hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        @click="
                            loading = true;
                            submitForm();
                        "
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>

    <ErrorMessagePopup
        v-if="currentPopup === 'invalid'"
        title="Invalid Credentials."
        description="Please follow the form guides."
        exit-text="Close"
        @on-exit="
            currentPopup = 'null';
            loading = false;
        "
    />

    <MessagePopup
        v-if="currentPopup === 'success'"
        :title="`Thank you for contacting us.\nYour ticket number is ${ticketNumber}`"
        description="Please wait for Admin to resolve your concerns, and we'll get in touch as soon as possible."
        v-bind:accepted="true"
        exit-text="Close"
        @on-exit="
            currentPopup = 'null';
            //this.router.push('/contact');
            resetForm();
            loading = false;
        "
    />

    <ErrorMessagePopup
        v-if="currentPopup === 'error'"
        title="Something went wrong."
        description="Please try again later."
        exit-text="Close"
        @on-exit="
            currentPopup = 'null';
            loading = false;
        "
    />
</template>

<script>
export default {
    //  this is the data that will be used in the form
    data() {
        return {
            firstname: "",
            lastname: "",
            email: "",
            mobile_no: "",
            title: "",
            description: "",
            errors: {},
            ticketNumber: "",
            // Activate Watcher
            isWatcherActive: true,
            // Popups
            currentPopup: null, // null, invalid, success, error
            //Loading
            loading: false,
        };
    },
    methods: {
        // Submit form
        submitForm() {
            // Validate form
            if (this.validateForm()) {
                // Put your submit form code here
                this.sendTicket();
            } else {
                this.currentPopup = "invalid";
            }
        },
        // Send Ticket
        async sendTicket() {
            //Added ticket object
            let ticket = {
                first_name: this.firstname,
                last_name: this.lastname,
                email: this.email,
                mobile_number: this.mobile_no,
                title: this.title,
                description: this.description,
            };

            // Call ticket up api endpoint
            await this.$axios
                .post(`/tickets/`, ticket)
                // If successful
                .then(({ data }) => {
                    // Get ticket number
                    this.ticketNumber = data.ticket_id;
                    // Show success popup
                    this.currentPopup = "success";
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    // Show error popup
                    this.currentPopup = "error";
                });
        },
        // Reset form
        resetForm() {
            this.isWatcherActive = false;
            this.firstname = "";
            this.lastname = "";
            this.email = "";
            this.mobile_no = "";
            this.title = "";
            this.description = "";
            this.errors = {};
            this.$nextTick(() => {
                this.isWatcherActive = true;
            });
        },
        // BELOW ARE THE VALIDATORS TO CHECK IF THE DATA ARE VALID
        validateFirstName() {
            if (this.firstname.length < 2 || this.firstname.length > 50) {
                this.errors["firstname"] = "First name must be between 2 and 50 characters!";
            } else if (/\d/.test(this.firstname)) {
                this.errors["firstname"] = "First name must not have numbers!";
            } else {
                delete this.errors["firstname"];
            }
        },
        validateLastName() {
            if (this.lastname.length < 2 || this.lastname.length > 50) {
                this.errors["lastname"] = "Last name must be between 2 and 50 characters!";
            } else if (/\d/.test(this.lastname)) {
                this.errors["lastname"] = "Last name must not have numbers!";
            } else {
                delete this.errors["lastname"];
            }
        },
        validateEmail() {
            const emailPattern =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (emailPattern.test(this.email) === false) {
                this.errors["email"] = "Must be an email!";
            } else if (this.email.length > 50) {
                this.errors["email"] = "Email must be less than 50 characters!";
            } else {
                delete this.errors["email"];
            }
        },
        validateMobileNumber() {
            const mobilePattern = /^09[0-9]{9}$/;

            if (mobilePattern.test(this.mobile_no) === false) {
                this.errors["mobile_no"] = "Must be a valid Philippine mobile number";
            } else {
                delete this.errors["mobile_no"];
            }
        },
        validateTitle() {
            if (this.title.length < 1 || this.title.length > 100) {
                this.errors["title"] = "Title must not be empty and must be less than 100 characters!";
            } else {
                delete this.errors["title"];
            }
        },
        validateMessage() {
            if (this.description.length < 1) {
                this.errors["description"] = "Message must not be empty!";
            } else {
                delete this.errors["description"];
            }
        },
        validateForm() {
            // Validate all fields
            this.validateFirstName();
            this.validateLastName();
            this.validateEmail();
            this.validateMobileNumber();
            this.validateTitle();
            this.validateMessage();

            if (Object.keys(this.errors).length === 0) { // If no errors, return true
                return true;
            } else {
                return false;
            }
        },
    },
    watch: {
        firstname() {
            if (this.isWatcherActive)
                this.validateFirstName();
        },
        lastname() {
            if (this.isWatcherActive)
                this.validateLastName();
        },
        email() {
            if (this.isWatcherActive)
                this.validateEmail();
        },
        mobile_no() {
            if (this.isWatcherActive)
                this.validateMobileNumber();
        },
        title() {
            if (this.isWatcherActive)
                this.validateTitle();
        },
        description() {
            if (this.isWatcherActive)
                this.validateMessage();
        },
    },
};
</script>
