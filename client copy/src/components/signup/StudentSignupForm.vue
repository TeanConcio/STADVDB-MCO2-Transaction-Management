<script setup>
import MessagePopup from "../../components/common/MessagePopup.vue";
import ErrorMessagePopup from "../../components/common/ErrorMessagePopup.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";
// Router
import { useRouter } from 'vue-router';
// Validators
import {
    validateNameField,
    validateLongNameField,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
    validateMobileNumberField,
    validateLandlineField,
    validateBirthdateField,
    validate150StringField,
    validate30StringField,
    validate200StringField,
    validateEnumField,
    validateNumberField,
    validateBooleanField,
    validateTextAreaField
} from "../../util/validators";
</script>

<template>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner v-if="loading" />
    </div>
    <div
        class="w-full bg-white rounded-lg mx-auto p-4 shadow dark:border sm:max-w-md xl:p-0 md:max-p-4 lg:p-8 mb-8"
    >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
                Enrollment Form
            </h1>
            <form v-on:submit.prevent="onSubmit">
                <!-- PROFILE INFORMATION -->
                <h1 class="font-bold mb-5">Profile Information</h1>
                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="first_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            First Name<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="First Name"
                            required
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
                            type="text"
                            id="last_name"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="Last Name"
                            required
                            autocomplete="off"
                            v-model="last_name"
                        />
                        <div class="input-errors" v-if="errors.last_name">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.last_name }}
                            </div>
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
                        type="text"
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
                        for="track"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Track<span class="text-required_red">*</span>
                    </label>
                    <select
                        id="track"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        v-model="track"
                    >
                        <option selected disabled hidden>Select</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="BOTH">Both</option>
                    </select>
                    <div class="input-errors" v-if="errors.track">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.track }}
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
                        required
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
                        for="repeat-password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Repeat password<span class="text-required_red">*</span></label
                    >
                    <input
                        type="password"
                        id="repeat-password"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="••••••••"
                        required
                        v-model="confirmPassword"
                    />
                    <div class="input-errors" v-if="errors.confirmPassword">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.confirmPassword }}
                        </div>
                    </div>
                </div>

                <!-- PERSONAL INFORMATION -->
                <h1 class="font-bold mb-5">Personal Information</h1>
                <div class="mb-5">
                    <label
                        for="address"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Address<span class="text-required_red">*</span>
                    </label>
                    <input
                        type="text"
                        id="address"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Address"
                        required
                        autocomplete="off"
                        v-model="address"
                    />
                    <div class="input-errors" v-if="errors.address">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.address }}
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="mobile"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Mobile Number<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="mobile"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="09XXXXXXXXX"
                            required
                            autocomplete="off"
                            v-model="mobile_number"
                        />
                        <div class="input-errors" v-if="errors.mobile_number">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.mobile_number }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="landline"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Landline Number<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="landline"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="12345678"
                            required
                            autocomplete="off"
                            v-model="landline"
                        />
                        <div class="input-errors" v-if="errors.landline">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.landline }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-3 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="birthday"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Date of Birth<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="date"
                            id="birthday"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="12345678"
                            required
                            autocomplete="off"
                            v-model="birthdate"
                        />
                        <div class="input-errors" v-if="errors.birthdate">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.birthdate }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="birthplace"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Place of Birth<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="birthplace"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="City"
                            required
                            autocomplete="off"
                            v-model="birthplace"
                        />
                        <div class="input-errors" v-if="errors.birthplace">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.birthplace }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="nationality"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Nationality<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="nationality"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Nationality"
                            required
                            autocomplete="off"
                            v-model="nationality"
                        />
                        <div class="input-errors" v-if="errors.nationality">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.nationality }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-3 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="gender"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Gender<span class="text-required_red">*</span>
                        </label>
                        <select
                            id="gender"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            v-model="gender"
                        >
                            <option selected disabled hidden>Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHERS">Others</option>
                        </select>
                        <div class="input-errors" v-if="errors.gender">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.gender }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="civilstatus"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Civil Status<span class="text-required_red">*</span>
                        </label>
                        <select
                            id="civilstatus"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            v-model="civil_status"
                        >
                            <option selected disabled hidden>Select</option>
                            <option value="SINGLE">Single</option>
                            <option value="MARRIED">Married</option>
                            <option value="WIDOWED">Widowed</option>
                            <option value="ANNULLED">Annulled</option>
                        </select>
                        <div class="input-errors" v-if="errors.civil_status">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.civil_status }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="childcount"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            # of Children<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="number"
                            id="childcount"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="0"
                            min="0"
                            max="99"
                            required
                            autocomplete="off"
                            v-model="no_of_children"
                        />
                        <div class="input-errors" v-if="errors.no_of_children">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.no_of_children }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="occupation"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Occupation<span class="text-required_red">*</span>
                    </label>
                    <input
                        type="text"
                        id="occupation"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Job"
                        required
                        autocomplete="off"
                        v-model="occupation"
                    />
                    <div class="input-errors" v-if="errors.occupation">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.occupation }}
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="school"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            School<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="school"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="School Name"
                            required
                            autocomplete="off"
                            v-model="school"
                        />
                        <div class="input-errors" v-if="errors.school">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.school }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="schooladmin"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Admin<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="schooladmin"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Admin"
                            required
                            autocomplete="off"
                            v-model="admin"
                        />
                        <div class="input-errors" v-if="errors.admin">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.admin }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <div class="flex items-center mb-4">
                        <input
                            id="default-checkbox"
                            type="checkbox"
                            value=""
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            v-model="is_partner_school"
                        />

                        <div class="input-errors" v-if="errors.is_partner_school">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.is_partner_school }}
                            </div>
                        </div>

                        <label
                            for="default-checkbox"
                            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            School/Organization is a Partner of MMP
                        </label>
                    </div>
                </div>
                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="church"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Church<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="church"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Church"
                            required
                            autocomplete="off"
                            v-model="church"
                        />
                        <div class="input-errors" v-if="errors.church">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.church }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="pastor"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Pastor<span class="text-required_red">*</span>
                        </label>
                        <input
                            type="text"
                            id="pastor"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Pastor"
                            required
                            autocomplete="off"
                            v-model="pastor"
                        />
                        <div class="input-errors" v-if="errors.pastor">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.pastor }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="gradeschool"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Gradeschool Name
                    </label>
                    <input
                        type="text"
                        id="gradeschool"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Gradeschool Name"
                        autocomplete="off"
                        v-model="gradeschool"
                    />
                    <div class="input-errors" v-if="errors.gradeschool">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.gradeschool }}
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="highschool"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Highschool Name
                    </label>
                    <input
                        type="text"
                        id="highschool"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Highschool Name"
                        autocomplete="off"
                        v-model="highschool"
                    />
                    <div class="input-errors" v-if="errors.highschool">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.highschool }}
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="college"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            College Name
                        </label>
                        <input
                            type="text"
                            id="college"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="College Name"
                            autocomplete="off"
                            v-model="college"
                        />
                        <div class="input-errors" v-if="errors.college">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.college }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="collegecourse"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            College Course
                        </label>
                        <input
                            type="text"
                            id="collegecourse"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="College Course"
                            autocomplete="off"
                            v-model="college_course"
                        />
                        <div class="input-errors" v-if="errors.college_course">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.college_course }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:grid md:grid-cols-2 md:gap-3">
                    <div class="mb-5">
                        <label
                            for="graduate"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Graduate School Name
                        </label>
                        <input
                            type="text"
                            id="graduate"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Graduate School Name"
                            autocomplete="off"
                            v-model="graduate"
                        />
                        <div class="input-errors" v-if="errors.graduate">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.graduate }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="graduatecourse"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Graduate School Course
                        </label>
                        <input
                            type="text"
                            id="graduatecourse"
                            class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Graduate School Course"
                            autocomplete="off"
                            v-model="graduate_course"
                        />
                        <div class="input-errors" v-if="errors.graduate_course">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.graduate_course }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="others"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Others
                    </label>
                    <input
                        type="text"
                        id="others"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Other credentials"
                        autocomplete="off"
                        v-model="others"
                    />
                    <div class="input-errors" v-if="errors.others">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.others }}
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="reasonforenrollment"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Why am I enrolling with the Training Certificate in ECE Module?<span
                            class="text-required_red"
                            >*</span
                        >
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write here..."
                        v-model="essay"
                    ></textarea>
                    <div class="input-errors" v-if="errors.essay">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.essay }}
                        </div>
                    </div>
                </div>

                <!-- EMERGENCY CONTACT INFO -->
                <h1 class="font-bold mb-2">Emergency Contact Information</h1>
                <div class="mb-5">
                    <label
                        for="emergencyname"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Full Name<span class="text-required_red">*</span>
                    </label>
                    <input
                        type="text"
                        id="emergencyname"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Emergency Contact Name"
                        required
                        autocomplete="off"
                        v-model="emergency_name"
                    />
                    <div class="input-errors" v-if="errors.emergency_name">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.emergency_name }}
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="emergencyaddress"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Emergency Address<span class="text-required_red">*</span>
                    </label>
                    <input
                        type="text"
                        id="emergencyaddress"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Address"
                        required
                        autocomplete="off"
                        v-model="emergency_address"
                    />
                    <div class="input-errors" v-if="errors.emergency_address">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.emergency_address }}
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        for="emergencymobile"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Emergency Number<span class="text-required_red">*</span>
                    </label>
                    <input
                        type="text"
                        id="emergencymobile"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="09XXXXXXXXX"
                        required
                        autocomplete="off"
                        v-model="emergency_mobile_number"
                    />
                    <div class="input-errors" v-if="errors.emergency_mobile_number">
                        <div class="block mb-2 text-sm font-medium text-red-500">
                            {{ errors.emergency_mobile_number }}
                        </div>
                    </div>
                </div>

                <div class="flex items-start mb-5">
                    <div class="block items-center">
                        <div class="flex align-top mb-2">
                            <input
                                id="terms"
                                type="checkbox"
                                value=""
                                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                required
                                v-model="agreeTerms"
                            />
                            <label
                                for="terms"
                                class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                I have double checked that all the information I have placed is
                                correct
                            </label>
                        </div>
                        <div class="input-errors" v-if="errors.agreeTerms">
                            <div class="block mb-2 text-sm font-medium text-red-500">
                                {{ errors.agreeTerms }}
                            </div>
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
                        Enroll Now
                    </button>

                    <router-link
                        to="/login"
                        class="text-md font-semibold hover:underline hover:decoration-2 cursor-pointer"
                    >
                        Login
                    </router-link>
                </div>

                <div class="mt-2 h-full flex items-center justify-center">
                    <p
                        class="text-md font-semibold hover:underline hover:decoration-2 cursor-pointer"
                        @click="swapForm()"
                    >
                        Sign Up as Faculty
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
        title="You have successfully signed up as a student!"
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
    //  this is the data that will be used in the form
    data() {
        return {
            first_name: "",
            last_name: "",
            middle_name: "",
            email: "",
            track: "",
            password: "",
            confirmPassword: "",
            address: "",
            mobile_number: "",
            landline: "",
            birthdate: "",
            birthplace: "",
            nationality: "",
            gender: "",
            civil_status: "",
            no_of_children: 0,
            occupation: "",
            school: "",
            admin: "",
            is_partner_school: false,
            church: "",
            pastor: "",
            gradeschool: "",
            highschool: "",
            college: "",
            college_course: "",
            graduate: "",
            graduate_course: "",
            others: "",
            gradeschool_completed: false,
            highschool_completed: false,
            college_completed: false,
            graduate_completed: false,
            essay: "",
            emergency_name: "",
            emergency_address: "",
            emergency_mobile_number: "",
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
        // change signup form type to teachers
        swapForm() {
            this.router.push("/teacher/signup");
        },

        // Trim inputs
        trimInputs() {
            this.first_name = this.first_name.trim();
            this.last_name = this.last_name.trim();
            this.middle_name = this.middle_name.trim();
            this.email = this.email.trim();
            this.password = this.password.trim();;
            this.confirmPassword = this.confirmPassword.trim();
            this.address = this.address.trim();
            this.birthplace = this.birthplace.trim();
            this.nationality = this.nationality.trim();
            this.occupation = this.occupation.trim();
            this.school = this.school.trim();
            this.admin = this.admin.trim();
            this.church = this.church.trim();
            this.pastor = this.pastor.trim();
            this.gradeschool = this.gradeschool.trim();
            this.highschool = this.highschool.trim();
            this.college = this.college.trim();
            this.college_course = this.college_course.trim();
            this.graduate = this.graduate.trim();
            this.graduate_course = this.graduate_course.trim();
            this.others = this.others.trim();
            this.essay = this.essay.trim();
            this.emergency_name = this.emergency_name.trim();
            this.emergency_address = this.emergency_address.trim();
        },
        // Submit form
        submitForm() {
            this.trimInputs();

            // Validate form
            if (this.validateForm()) {
                this.signup();
            } else {
                this.showInvalidPopup = true;
            }
        },
        // Sign up Teacher
        async signup() {
            //Get the student info object
            let student = {
                first_name: this.first_name,
                last_name: this.last_name,
                address: this.address,
                mobile_number: this.mobile_number,
                landline: this.landline,
                email: this.email,
                birthdate: this.birthdate,
                birthplace: this.birthplace,
                nationality: this.nationality,
                gender: this.gender,
                civil_status: this.civil_status,
                no_of_children: this.no_of_children,
                school: this.school,
                occupation: this.occupation,
                admin: this.admin,
                church: this.church,
                pastor: this.pastor,
                is_partner_school: this.is_partner_school,
                others: this.others,
                gradeschool_completed: this.gradeschool_completed,
                highschool_completed: this.highschool_completed,
                college_completed: this.college_completed,
                graduate_completed: this.graduate_completed,
                essay: this.essay,
                emergency_name: this.emergency_name,
                emergency_address: this.emergency_address,
                emergency_mobile_number: this.emergency_mobile_number,
                password: this.password,
                status: "FOR_APPROVAL",
                track: this.track,
            };

            // Add optional fields if they have a value
            if (this.middle_name.length > 0) {
                student["middle_name"] = this.middle_name;
            }

            if (this.gradeschool.length > 0) {
                student["gradeschool"] = this.gradeschool;
            }

            if (this.highschool.length > 0) {
                student["highschool"] = this.highschool;
            }

            if (this.college.length > 0) {
                student["college"] = this.college;
            }

            if (this.college_course.length > 0) {
                student["college_course"] = this.college_course;
            }

            if (this.graduate.length > 0) {
                student["graduate"] = this.graduate;
            }

            if (this.graduate_course.length > 0) {
                student["graduate_course"] = this.graduate_course;
            }

            // Call Sign up api endpoint
            await this.$axios
                .post("/students/", student)
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
        // BELOW ARE THE VALIDATORS TO CHECK IF THE DATA ARE VALID FOR SIGNING UP
        validateForm() {
            // Validate all fields
            this.validateFirstName();
            this.validateLastName();
            this.validateMiddleName();
            this.validateEmail();
            this.validateTrack();
            this.validatePassword();
            this.validateConfirmPassword();
            this.validateAddress();
            this.validateMobileNumber();
            this.validateLandline();
            this.validateBirthdate();
            this.validateBirthplace();
            this.validateNationality();
            this.validateGender();
            this.validateCivilStatus();
            this.validateNoOfChildren();
            this.validateOccupation();
            this.validateSchool();
            this.validateAdmin();
            this.validateIsPartner();
            this.validateChurch();
            this.validatePastor();
            this.validateGradeschool();
            this.validateHighschool();
            this.validateCollege();
            this.validateCollegeCourse();
            this.validateGraduate();
            this.validateGraduateCourse();
            this.validateOthers();
            this.validateEssay();
            this.validateEmergencyName();
            this.validateEmergencyAddress();
            this.validateEmergencyNumber();
            this.validateAgreeTerms();

            if (Object.keys(this.errors).length === 0) { // If no errors, return true
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
        validateTrack() {
            validateEnumField(
                this.track, 
                "track", 
                ["ADMIN", "TEACHER", "BOTH"], 
                this.errors
            );
        },
        validatePassword() {
            validatePasswordField(this.password, this.errors);
        },
        validateConfirmPassword() {
            validateConfirmPasswordField(this.confirmPassword, this.password, this.errors);
        },
        validateAddress() {
            validate150StringField(this.address, "address", this.errors);
        },
        validateMobileNumber() {
            validateMobileNumberField(this.mobile_number, "mobile_number", this.errors);
        },
        validateLandline() {
            validateLandlineField(this.landline, this.errors);
        },
        validateBirthdate() {
            validateBirthdateField(this.birthdate, this.errors);
        },
        validateBirthplace() {
            validate150StringField(this.birthplace, "birthplace", this.errors);
        },
        validateNationality() {
            validate150StringField(this.nationality, "nationality", this.errors);
        },
        validateGender() {
            validateEnumField(
                this.gender, 
                "gender", 
                ["MALE", "FEMALE", "OTHERS"], 
                this.errors
            );
        },
        validateCivilStatus() {
            validateEnumField(
                this.civil_status,
                "civil_status",
                ["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"],
                this.errors
            );
        },
        validateNoOfChildren() {
            validateNumberField(this.no_of_children, "no_of_children", this.errors);
        },
        validateOccupation() {
            validate30StringField(this.occupation, "occupation", this.errors);
        },
        validateSchool() {
            validate30StringField(this.school, "school", this.errors);
        },
        validateAdmin() {
            validate150StringField(this.admin, "admin", this.errors);
        },
        validateIsPartner() {
            validateBooleanField(this.is_partner_school, "is_partner_school", this.errors);
        },
        validateChurch() {
            validate150StringField(this.church, "church", this.errors);
        },
        validatePastor() {
            validate150StringField(this.pastor, "pastor", this.errors);
        },
        validateGradeschool() {
            if (this.gradeschool.length > 50) {
                this.errors["gradeschool"] =
                    "Gradeschool name should be less than 50 characters long";
                this.gradeschool_completed = false;
            } else {
                delete this.errors["gradeschool"];

                if (this.gradeschool.length > 0) {
                    this.gradeschool_completed = true;
                } else {
                    this.gradeschool_completed = false;
                }
            }
        },
        validateHighschool() {
            if (this.highschool.length === 0) {
                delete this.errors["highschool"];
                this.highschool_completed = false;
                return;
            }

            if (this.highschool.length > 50) {
                this.errors["highschool"] =
                    "Highschool name should be less than 50 characters long";
                this.highschool_completed = false;
            } else if (!this.gradeschool_completed) {
                this.errors["highschool"] = "Gradeschool name should be filled up";
                this.highschool_completed = false;
            } else {
                delete this.errors["highschool"];

                if (this.highschool.length > 0) {
                    this.highschool_completed = true;
                } else {
                    this.highschool_completed = false;
                }
            }
        },
        validateCollege() {
            if (this.college.length === 0) {
                delete this.errors["college"];
                this.college_completed = false;
                return;
            }

            if (this.college.length > 50) {
                this.errors["college"] = "College name should be less than 50 characters long";
                this.college_completed = false;
            } else if (!this.gradeschool_completed) {
                this.errors["college"] = "Gradeschool name should be filled up";
                this.college_completed = false;
            } else if (!this.highschool_completed) {
                this.errors["college"] = "Highschool name should be filled up";
                this.college_completed = false;
            } else if (this.college.length > 0 && this.college_course.length === 0) {
                this.errors["college_course"] = "Please put your college course";
                this.college_completed = false;
            } else {
                this.college_completed = true;
                delete this.errors["college"];
            }
        },
        validateCollegeCourse() {
            if (this.college.length === 0 && this.college_course.length === 0) {
                delete this.errors["college_course"];
                return;
            }

            if (this.college_course.length > 50) {
                this.errors["college_course"] =
                    "College course name should be less than 50 characters long";
            } else if (this.college_course.length > 0 && this.college.length === 0) {
                this.errors["college_course"] = "Please put your college name";
            } else {
                delete this.errors["college_course"];
            }
        },
        validateGraduate() {
            if (this.graduate.length === 0) {
                delete this.errors["graduate"];
                this.graduate_completed = false;
                return;
            }

            if (this.graduate.length > 50) {
                this.errors["graduate"] =
                    "Graduate school name should be less than 50 characters long";
                this.graduate_completed = false;
            } else if (!this.gradeschool_completed) {
                this.errors["graduate"] = "Gradeschool name should be filled up";
                this.graduate_completed = false;
            } else if (!this.highschool_completed) {
                this.errors["graduate"] = "Highschool name should be filled up";
                this.graduate_completed = false;
            } else if (!this.college_completed) {
                this.errors["graduate"] = "College name and course should be filled up";
                this.graduate_completed = false;
            } else if (this.graduate.length > 0 && this.graduate_course.length === 0) {
                this.errors["graduate_course"] = "Please put your graduate school course";
                this.graduate_completed = false;
            } else {
                delete this.errors["graduate"];
                this.graduate_completed = true;
            }
        },
        validateGraduateCourse() {
            if (this.graduate_course.length === 0 && this.graduate.length === 0) {
                delete this.errors["graduate_course"];
                return;
            }

            if (this.graduate_course.length > 50) {
                this.errors["graduate_course"] =
                    "Graduate course name should be less than 50 characters long";
            } else if (this.graduate.length > 0 && this.graduate_course.length === 0) {
                this.errors["graduate_course"] = "Please put your graduate school course";
            } else if (this.graduate_course.length > 0 && this.graduate.length === 0) {
                this.errors["graduate_course"] = "Please put your graduate school name";
            } else {
                delete this.errors["graduate_course"];
            }
        },
        validateOthers() {
            validate200StringField(this.others, "others", this.errors);
        },
        validateEssay() {
            validateTextAreaField(this.essay, "essay", this.errors);
        },
        validateEmergencyName() {
            validateLongNameField(this.emergency_name, "emergency_name", this.errors);
        },
        validateEmergencyAddress() {
            validate150StringField(this.emergency_address, "emergency_address", this.errors);
        },
        validateEmergencyNumber() {
            validateMobileNumberField(this.emergency_mobile_number, "emergency_mobile_number", this.errors);
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
        track() {
            this.validateTrack();
        },
        password() {
            this.validatePassword();
        },
        confirmPassword() {
            this.validateConfirmPassword();
        },
        address() {
            this.validateAddress();
        },
        mobile_number() {
            this.validateMobileNumber();
        },
        landline() {
            this.validateLandline();
        },
        birthdate() {
            this.validateBirthdate();
        },
        birthplace() {
            this.validateBirthplace();
        },
        nationality() {
            this.validateNationality();
        },
        gender() {
            this.validateGender();
        },
        civil_status() {
            this.validateCivilStatus();
        },
        no_of_children() {
            this.validateNoOfChildren();
        },
        occupation() {
            this.validateOccupation();
        },
        school() {
            this.validateSchool();
        },
        admin() {
            this.validateAdmin();
        },
        is_partner_school() {
            this.validateIsPartner();
        },
        church() {
            this.validateChurch();
        },
        pastor() {
            this.validatePastor();
        },
        gradeschool() {
            this.validateGradeschool();
            this.validateHighschool();
            this.validateCollege();
            this.validateGraduate();
            this.validateCollegeCourse();
            this.validateGraduateCourse();
        },
        highschool() {
            this.validateGradeschool();
            this.validateHighschool();
            this.validateCollege();
            this.validateGraduate();
            this.validateCollegeCourse();
            this.validateGraduateCourse();
        },
        college() {
            this.validateGradeschool();
            this.validateHighschool();
            this.validateCollege();
            this.validateGraduate();
            this.validateCollegeCourse();
            this.validateGraduateCourse();
        },
        college_course() {
            this.validateCollege();
            this.validateCollegeCourse();
            this.validateGraduate();
            this.validateGraduateCourse();
        },
        graduate() {
            this.validateGradeschool();
            this.validateHighschool();
            this.validateCollege();
            this.validateGraduate();
            this.validateCollegeCourse();
            this.validateGraduateCourse();
        },
        graduate_course() {
            this.validateGraduate();
            this.validateGraduateCourse();
        },
        others() {
            this.validateOthers();
        },
        essay() {
            this.validateEssay();
        },
        emergency_name() {
            this.validateEmergencyName();
        },
        emergency_address() {
            this.validateEmergencyAddress();
        },
        emergency_mobile_number() {
            this.validateEmergencyNumber();
        },
        agreeTerms() {
            this.validateAgreeTerms();
        },
    },
};
</script>
