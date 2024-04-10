<script setup>
import MessagePopup from "../../components/common/MessagePopup.vue";
import ErrorMessagePopup from "../../components/common/ErrorMessagePopup.vue";
import LoadingSpinner from "../../components/common/LoadingSpinner.vue";
// Router
import { useRouter } from 'vue-router';
// Validators
import {
    validateNameField,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
} from "../../util/validators";
</script>

<template>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner v-if="loading" />
    </div>
    <div
        class="w-full bg-white rounded-lg mx-auto p-4 shadow dark:border sm:max-w-md xl:p-0 md:max-p-4 lg:p-8 mb-6"
    >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
                Sign Up
            </h1>
            <form v-on:submit.prevent="onSubmit">
                <div class="mb-5">
                    <label
                        for="first_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        First Name<span class="text-required_red">*</span>
                    </label>
                    <input
                        type="first_name"
                        id="first_name"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="First Name"
                        autocomplete="off"
                        v-model="first_name"
                    />
                    <div class="input-errors" v-if="errors.first_name">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.first_name }}
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
                        id="last_name"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Last Name"
                        autocomplete="off"
                        v-model="last_name"
                    />
                    <div class="input-errors" v-if="errors.last_name">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.last_name }}
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="middle_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Middle Name</label
                    >
                    <input
                        type="middle_name"
                        id="middle_name"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Middle Name"
                        autocomplete="off"
                        v-model="middle_name"
                    />
                    <div class="input-errors" v-if="errors.middle_name">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.middle_name }}
                        </div>
                    </div>
                </div>
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
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Password<span class="text-required_red">*</span></label
                    >
                    <input
                        type="password"
                        id="password"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="••••••••"
                        v-model="password"
                    />
                    <div class="input-errors" v-if="errors.password">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.password }}
                        </div>
                    </div>
                </div>
                <div class="mb-5">
                    <label
                        for="confirm-password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Confirm Password<span class="text-required_red">*</span></label
                    >
                    <input
                        type="password"
                        id="confirm-password"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="••••••••"
                        v-model="confirmPassword"
                    />
                    <div class="input-errors" v-if="errors.confirmPassword">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.confirmPassword }}
                        </div>
                    </div>
                </div>
                <div class="flex items-start mb-5">
                    <div class="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            value=""
                            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                            v-model="agreeTerms"
                            @click="agreeTerms = !agreeTerms"
                        />
                    </div>
                    <label
                        for="terms"
                        class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        I have double checked that all the information I have placed is correct
                    </label>
                </div>
                <div class="input-errors" v-if="errors.agreeTerms">
                    <div class="block mb-2 text-sm font-medium text-red-500">
                        {{ errors.agreeTerms }}
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
                        Sign Up
                    </button>

                    <router-link
                        to="/login"
                        class="text-md font-semibold hover:underline hover:decoration-2 cursor-pointer"
                    >
                        Log In
                    </router-link>
                </div>

                <div class="mt-2 h-full flex items-center justify-center">
                    <p
                        class="text-md font-semibold hover:underline hover:decoration-2 cursor-pointer"
                        @click="swapForm()"
                    >
                        Sign Up as Student Instead
                    </p>
                </div>
            </form>
        </div>
    </div>

    <ErrorMessagePopup
        v-if="showInvalidPopup"
        title="Invalid Signup Credentials."
        description="Please follow the form guides."
        exit-text="Close"
        @on-exit="
            showInvalidPopup = false;
            loading = false;
        "
    />

    <MessagePopup
        v-if="showSuccessPopup"
        title="You have successfully signed up as a teacher!"
        description="Please wait for Admin to verify your account before logging in."
        accepted="true"
        exit-text="Close"
        @on-exit="
            showSuccessPopup = false;
            router.push('/');
            loading = false;
        "
    />

    <ErrorMessagePopup
        v-if="showUsedEmailPopup"
        title="Email is already in use."
        description="Please use a different email or Login."
        exit-text="Close"
        @on-exit="
            showUsedEmailPopup = false;
            loading = false;
        "
    />

    <ErrorMessagePopup
        v-if="showErrorPopup"
        title="Something went wrong."
        description="Please try again."
        exit-text="Close"
        @on-exit="
            showErrorPopup = false;
            loading = false;
        "
    />
</template>

<script>
export default {
    data() {
        // Data of the component
        return {
            // Form data
            first_name: "",
            last_name: "",
            middle_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeTerms: false,
            errors: {},
            // Popups
            showInvalidPopup: false,
            showSuccessPopup: false,
            showUsedEmailPopup: false,
            showErrorPopup: false,
            //Loading
            loading: false,
            // Router
            router: useRouter(),
        };
    },
    methods: {
        // Methods of the component
        swapForm() {
            this.router.push("/student/signup");
        },
        // Submit form
        submitForm() {
            // Validate form
            if (this.validate()) {
                this.signup();
            } else {
                this.showInvalidPopup = true;
            }
        },
        // Sign up Teacher
        async signup() {
            //Added teacher object
            let teacher = {
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                password: this.password,
                status: "FOR_APPROVAL",
            };

            if (this.middle_name.length > 0) {
                teacher["middle_name"] = this.middle_name;
            }

            // Call Sign up api endpoint
            await this.$axios
                .post(`/teachers/`, teacher)
                // If successful
                .then(() => {
                    this.showSuccessPopup = true;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    if (error.response.data.error === "Email already exists") {
                        this.showUsedEmailPopup = true;
                    } else {
                        this.showErrorPopup = true;
                    }
                });
        },
        // Validators
        validate() {
            // Validate form
            this.validateFirstName();
            this.validateLastName();
            this.validateMiddleName();
            this.validateEmail();
            this.validatePassword();
            this.validateConfirmPassword();
            this.validateAgreeTerms();

            if (Object.keys(this.errors).length === 0) { // If no errors, return true, else return false
                return true;
            } else {
                return false;
            }
        },
        validateFirstName() {
            validateNameField(this.first_name, "first_name", this.errors);
        },
        validateLastName() {
            validateNameField(this.last_name, "last_name", this.errors);
        },
        validateMiddleName() {
            if (this.middle_name.length === 0) {
                delete this.errors["middle_name"];
                return;
            }

            validateNameField(this.middle_name, "middle_name", this.errors);
        },
        validateEmail() {
            validateEmailField(this.email, this.errors);
        },
        validatePassword() {
            validatePasswordField(this.password, this.errors);
        },
        validateConfirmPassword() {
            validateConfirmPasswordField(this.confirmPassword, this.password, this.errors);
        },
        validateAgreeTerms() {
            if (!this.agreeTerms) {
                this.errors["agreeTerms"] = "You must agree to the terms and conditions!";
            } else {
                delete this.errors["agreeTerms"];
            }
        },
    },
    watch: {
        // Watchers of the component
        first_name() {
            this.validateFirstName();
        },
        last_name() {
            this.validateLastName();
        },
        middle_name() {
            this.validateMiddleName();
        },
        email() {
            this.validateEmail();
        },
        password() {
            this.validatePassword();
        },
        confirmPassword() {
            this.validateConfirmPassword();
        },
        agreeTerms() {
            this.validateAgreeTerms();
        },
    },
};
</script>
