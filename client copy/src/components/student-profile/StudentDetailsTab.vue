<script setup>
// Components
import StudentModulePaymentsTable from "./StudentModulePaymentsTable.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";
// Popups
import MessagePopup from "../common/MessagePopup.vue";
import PromptPopup from "../common/PromptPopup.vue";
// Helpers
import { formatEnum, downloadZIP, downloadPDF, duplicate } from "../../util/helpers";
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
} from "../../util/validators.js";
// Props
defineProps({
    studentId: String,
});
// Emits
defineEmits(["on-back"]);
</script>

<template>
    <LoadingSpinner v-if="!render" />
    <div v-else class="grid w-full">
        <button
            @click="$emit('on-back')"
            type="button"
            class="mr-auto mb-1 w-21 h-12 px-10 py-3 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
        >
            Back
        </button>
        <div class="md:flex justify-between">
            <h1 class="text-4xl font-bold mb-4">Student Information</h1>
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
        </div>
        <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-7 py-5 mb-5 overflow-x-auto"
        >
            <h2 class="text-2xl font-semibold mb-5">Personal Information</h2>
            <div class="w-full grid lg:grid-cols-2 lg:gap-10">
                <div class="grid md:grid-cols-3">
                    <div class="mb-6">
                        <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                            First Name
                        </div>
                        <input
                            type="text"
                            v-model="student.first_name"
                            :disabled="!editMode"
                            placeholder="First Name"
                            :class="{
                                '-m-2 border-0': !editMode,
                                'border-gray-200 shadow-sm': editMode,
                            }"
                            class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            autocomplete="off"
                        />
                        <div class="input-errors" v-if="errors.first_name">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors.first_name }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-6">
                        <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                            Middle Name
                        </div>
                        <input
                            type="text"
                            v-model="student.middle_name"
                            :disabled="!editMode"
                            placeholder="Middle Name"
                            :class="{
                                '-m-2 border-0': !editMode,
                                'border-gray-200 shadow-sm': editMode,
                            }"
                            class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            autocomplete="off"
                        />
                        <div class="input-errors" v-if="errors.middle_name">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors.middle_name }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-6">
                        <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                            Last Name
                        </div>
                        <input
                            type="text"
                            v-model="student.last_name"
                            :disabled="!editMode"
                            placeholder="Last Name"
                            :class="{
                                '-m-2 border-0': !editMode,
                                'border-gray-200 shadow-sm': editMode,
                            }"
                            class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            autocomplete="off"
                        />
                        <div class="input-errors" v-if="errors.last_name">
                            <div class="block mb-2 text-sm font-medium text-highlight">
                                {{ errors.last_name }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Address</div>
                    <input
                        type="text"
                        v-model="student.address"
                        :disabled="!editMode"
                        placeholder="Address"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.address">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.address }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid md:grid-cols-3">
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Date of Birth
                    </div>
                    <input
                        type="date"
                        :value="new Date(student.birthdate).toJSON().substring(0, 10)"
                        @input="student.birthdate = new Date($event.target.value)"
                        :disabled="!editMode"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    />
                    <div class="input-errors" v-if="errors.birthdate">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.birthdate }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Place of Birth
                    </div>
                    <input
                        type="text"
                        v-model="student.birthplace"
                        :disabled="!editMode"
                        placeholder="Birthplace"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.birthplace">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.birthplace }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Nationality
                    </div>
                    <input
                        type="text"
                        v-model="student.nationality"
                        :disabled="!editMode"
                        placeholder="Nationality"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.nationality">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.nationality }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid md:grid-cols-3">
                <div class="mb-6">
                    <label for="gender" class="block mb-1 font-medium text-gray-900 dark:text-white">Gender</label>
                    <p v-if="!editMode" class="block text-sm">{{ formatEnum(student.gender) }}</p>
                    <select
                        id="gender"
                        v-if="editMode"
                        v-model="student.gender"
                        :disabled="!editMode"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHERS">Others</option>
                    </select>
                    <div class="input-errors" v-if="errors.gender">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.gender }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <label for="civil_status" class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Civil Status
                    </label>
                    <p v-if="!editMode" class="block text-sm">
                        {{ formatEnum(student.civil_status) }}
                    </p>
                    <select
                        id="civil_status"
                        v-if="editMode"
                        v-model="student.civil_status"
                        :disabled="!editMode"
                        class="shadow-sm bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="ANNULLED">Annulled</option>
                    </select>
                    <div class="input-errors" v-if="errors.civil_status">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.civil_status }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        No. of Children
                    </div>
                    <input
                        type="number"
                        v-model="student.no_of_children"
                        :disabled="!editMode"
                        placeholder="Number of Children"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.no_of_children">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.no_of_children }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid md:grid-cols-3">
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">School</div>
                    <input
                        type="text"
                        v-model="student.school"
                        :disabled="!editMode"
                        placeholder="School"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.school">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.school }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Admin</div>
                    <input
                        type="text"
                        v-model="student.admin"
                        :disabled="!editMode"
                        placeholder="Admin"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.admin">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.admin }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="flex">
                        <input
                            type="checkbox"
                            v-model="student.is_partner_school"
                            :disabled="!editMode"
                            class="mr-2 mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                            Partner School or Organization of MMP
                        </div>
                    </div>
                    <div class="input-errors" v-if="errors.is_partner_school">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.is_partner_school }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="mb-6">
                <div class="block mb-1 font-medium text-gray-900 dark:text-white">Occupation</div>
                <input
                    type="text"
                    v-model="student.occupation"
                    :disabled="!editMode"
                    placeholder="Occupation"
                    :class="{
                        '-m-2 border-0': !editMode,
                        'border-gray-200 shadow-sm': editMode,
                    }"
                    class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    autocomplete="off"
                />
                <div class="input-errors" v-if="errors.occupation">
                    <div class="block mb-2 text-sm font-medium text-highlight">
                        {{ errors.occupation }}
                    </div>
                </div>
            </div>
            <div class="grid md:grid-cols-2">
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Church</div>
                    <input
                        type="text"
                        v-model="student.church"
                        :disabled="!editMode"
                        placeholder="Church"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.church">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.church }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Pastor</div>
                    <input
                        type="text"
                        v-model="student.pastor"
                        :disabled="!editMode"
                        placeholder="Pastor"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.pastor">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.pastor }}
                        </div>
                    </div>
                </div>
            </div>
            <h5 class="text-lg font-medium mb-1">Educational Attainment</h5>
            <div class="grid xl:grid-cols-4">
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        High School
                    </div>
                    <input
                        type="text"
                        v-model="student.highschool"
                        :disabled="!editMode"
                        placeholder="High School"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.highschool">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.highschool }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        College School
                    </div>
                    <input
                        type="text"
                        v-model="student.college"
                        :disabled="!editMode"
                        placeholder="College School"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.college">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.college }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        College Course
                    </div>
                    <input
                        type="text"
                        v-model="student.college_course"
                        :disabled="!editMode"
                        placeholder="College Course"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.college_course">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.college_course }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Graduate School
                    </div>
                    <input
                        type="text"
                        v-model="student.graduate"
                        :disabled="!editMode"
                        placeholder="Graduate School"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.graduate">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.graduate }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Graduate Course
                    </div>
                    <input
                        type="text"
                        v-model="student.graduate_course"
                        :disabled="!editMode"
                        placeholder="Graduate Course"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.graduate_course">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.graduate_course }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-7 py-5 mb-5"
        >
            <h2 class="text-2xl font-semibold mb-5">Contact Details</h2>
            <div class="grid xl:grid-cols-3">
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Mobile Number
                    </div>
                    <input
                        type="text"
                        v-model="student.mobile_number"
                        :disabled="!editMode"
                        placeholder="Mobile Number"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.mobile_number">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.mobile_number }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Landline</div>
                    <input
                        type="text"
                        v-model="student.landline"
                        :disabled="!editMode"
                        placeholder="Landline"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.landline">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.landline }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Email</div>
                    <input
                        type="text"
                        v-model="student.email"
                        :disabled="!editMode"
                        placeholder="Email"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.email">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.email }}
                        </div>
                    </div>
                </div>
            </div>
            <h4 class="text-lg font-medium mb-1">Emergency Contact</h4>
            <div class="grid xl:grid-cols-3">
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Name</div>
                    <input
                        type="text"
                        v-model="student.emergency_name"
                        :disabled="!editMode"
                        placeholder="Emergency Name"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.emergency_name">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.emergency_name }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">Address</div>
                    <input
                        type="text"
                        v-model="student.emergency_address"
                        :disabled="!editMode"
                        placeholder="Emergency Address"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.emergency_address">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.emergency_address }}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="block mb-1 font-medium text-gray-900 dark:text-white">
                        Mobile Number
                    </div>
                    <input
                        type="text"
                        v-model="student.emergency_mobile_number"
                        :disabled="!editMode"
                        placeholder="Emergency Mobile Number"
                        :class="{
                            '-m-2 border-0': !editMode,
                            'border-gray-200 shadow-sm': editMode,
                        }"
                        class="bg-gray-100 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        autocomplete="off"
                    />
                    <div class="input-errors" v-if="errors.emergency_mobile_number">
                        <div class="block mb-2 text-sm font-medium text-highlight">
                            {{ errors.emergency_mobile_number }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-7 py-5 mb-5"
        >
            <h2 class="text-2xl font-semibold mb-1">Reason for Enrollment</h2>
            <div class="mb-5 mt-5">
                <textarea
                    id="message"
                    rows="10"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write here..."
                    v-model="student.essay"
                    :disabled="!editMode"
                ></textarea>
                <div class="input-errors" v-if="errors.essay">
                    <div class="block mb-2 text-sm font-medium text-highlight">
                        {{ errors.essay }}
                    </div>
                </div>
            </div>
        </div>
        <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-7 py-5 mb-5"
        >
            <h2 class="text-2xl font-semibold mb-1">Module Payments</h2>
            <div class="mb-5 mt-5 grid">
                <StudentModulePaymentsTable
                    :finance_info="finance_info"
                    :student_id="studentId"
                    @add-success="getBills()"
                    @delete-success="getBills()"
                />
            </div>
        </div>
        <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-7 py-5 mb-5"
        >
            <h2 class="text-2xl font-semibold mb-1">Download</h2>
            <div class="mb-5">
                <button
                    type="button"
                    @click="downloadStudentData()"
                    class="w-full sm:w-auto ml-auto mr-10 md:px-10 px-3 py-3 mt-5 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Download All Student Data (.zip)
                </button>
                <button
                    type="button"
                    @click="printStudentData()"
                    class="w-full sm:w-auto ml-auto mr-10 md:px-10 px-3 py-3 mt-5 text-base font-medium text-center text-white bg-highlight rounded-lg hover:bg-highlight_hover"
                >
                    Print Student Registration Form (.pdf)
                </button>
            </div>
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
        @on-confirm="updateStudent()"
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

    <MessagePopup
        v-if="currentPopup === 'success'"
        title="Updated Student Records!"
        description="Student records have been successfully updated."
        :accepted="true"
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

    <MessagePopup
        v-if="currentPopup === 'editing-error'"
        title="You are still in edit mode."
        description="Please exit edit mode before trying again."
        exit-text="Close"
        @on-exit="currentPopup = null"
    />
</template>

<script>
// kayo na bahala i aint readin allat
export default {
    data() {
        return {
            // Render
            render: false,
            // Edit Mode
            editMode: false,
            // Student
            student: {},
            backupStudent: {},
            finance_info: {},
            // Errors
            errors: {},
            // Popups
            currentPopup: null,
            //Data
            bills: null,
            payments: null,
        };
    },
    computed: {
        first_name() {
            return this.student.first_name;
        },
        last_name() {
            return this.student.last_name;
        },
        middle_name() {
            return this.student.middle_name;
        },
        email() {
            return this.student.email;
        },
        address() {
            return this.student.address;
        },
        mobile_number() {
            return this.student.mobile_number;
        },
        landline() {
            return this.student.landline;
        },
        birthdate() {
            return this.student.birthdate;
        },
        birthplace() {
            return this.student.birthplace;
        },
        nationality() {
            return this.student.nationality;
        },
        gender() {
            return this.student.gender;
        },
        civil_status() {
            return this.student.civil_status;
        },
        no_of_children() {
            return this.student.no_of_children;
        },
        occupation() {
            return this.student.occupation;
        },
        school() {
            return this.student.school;
        },
        admin() {
            return this.student.admin;
        },
        is_partner_school() {
            return this.student.is_partner_school;
        },
        church() {
            return this.student.church;
        },
        pastor() {
            return this.student.pastor;
        },
        gradeschool() {
            return this.student.gradeschool;
        },
        highschool() {
            return this.student.highschool;
        },
        college() {
            return this.student.college;
        },
        college_course() {
            return this.student.college_course;
        },
        graduate() {
            return this.student.graduate;
        },
        graduate_course() {
            return this.student.graduate_course;
        },
        others() {
            return this.student.others;
        },
        essay() {
            return this.student.essay;
        },
        emergency_name() {
            return this.student.emergency_name;
        },
        emergency_address() {
            return this.student.emergency_address;
        },
        emergency_mobile_number() {
            return this.student.emergency_mobile_number;
        },
    },
    methods: {
        // Get student info
        async getStudentInfo() {
            await this.$axios
                .get(`/students/id/${this.studentId}`)
                .then(({ data }) => {
                    this.student = data;
                })
                .catch((error) => {
                    console.log(error);
                });

            await this.$axios
                .get(`/module_enrollments/balance/${this.studentId}`)
                .then(({ data }) => {
                    this.finance_info = data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // update student's finance info
        async updateFinanceInfo() {
            await this.$axios
                .get(`/module_enrollments/balance/${this.studentId}`)
                .then(({ data }) => {
                    this.finance_info = data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async addSuccess() {
            this.currentPopup = "add";
            await this.updateFinanceInfo();
        },
        async editSuccess() {
            this.currentPopup = "edit";
            await this.updateFinanceInfo();
        },
        switchToEditMode() {
            this.editMode = true;
            this.backupStudent = duplicate(this.student);
        },
        cancelChanges() {
            this.editMode = false;
            this.student = duplicate(this.backupStudent);
            this.errors = {};
            this.currentPopup = null;
        },
        saveChanges() {
            if (this.validate()) {
                this.currentPopup = "confirmation";
            } else {
                this.currentPopup = "invalid-inputs";
            }
        },
        async updateStudent() {
            this.student.password = "password";     // Bypass password validation, does not actually change
            await this.$axios
                .patch(`/students/${this.studentId}`, this.student)
                // If successful
                .then(() => {
                    this.getStudentInfo();
                })
                .then(() => {
                    this.currentPopup = "success";
                    this.editMode = false;
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                    this.currentPopup = "error";
                    return;
                });
        },
        async getBills() {
            this.bills = [];

            await this.updateFinanceInfo();

            this.finance_info.forEach((element) => {
                if (element.bill !== null) {
                    this.bills.push(element.bill);
                }
            });
        },
        async getPayments() {
            this.payments = [];

            await this.getBills();

            this.bills.forEach((element) => {
                if (element.payments.length > 0) {
                    element.payments.forEach((payment) => {
                        this.payments.push(payment);
                    });
                }
            });

            return this.payments;
        },
        // Download
        async downloadStudentData() {
            if (this.editMode) {
                this.currentPopup = "editing-error";
                return;
            }

            await this.$axios
                .get(`/download/student/${this.studentId}`)
                // If successful
                .then(({ data }) => {
                    downloadZIP(
                        data,
                        `${this.student.student_id} ${this.student.first_name} ${this.student.last_name} - Student Data.zip`
                    );
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        // Print
        async printStudentData() {
            if (this.editMode) {
                this.currentPopup = "editing-error";
                return;
            }

            await this.$axios
                .get(`/download/student/pdf/${this.studentId}`)
                // If successful
                .then(({ data }) => {
                    downloadPDF(
                        data,
                        `${this.student.student_id} ${this.student.first_name} ${this.student.last_name} - Registration Form.pdf`
                    );
                })
                // If unsuccessful
                .catch((error) => {
                    console.log(error);
                });
        },
        // BELOW ARE THE VALIDATORS TO CHECK IF THE DATA ARE VALID FOR UPDATING
        validate() {
            // Validate all fields
            this.validateFirstName();
            this.validateLastName();
            this.validateMiddleName();
            this.validateEmail();
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

            if (Object.keys(this.errors).length === 0) { // If no errors, return true
                return true;
            } else {
                return false;
            }
        },
        validateFirstName() {
            validateNameField(this.student.first_name, "first_name", this.errors);
        },
        validateLastName() {
            validateNameField(this.student.last_name, "last_name", this.errors);
        },
        validateMiddleName() {
            if (this.student.middle_name.length === 0) {
                delete this.errors["middle_name"];
                return;
            }

            validateNameField(this.student.middle_name, "middle_name", this.errors);
        },
        validateEmail() {
            validateEmailField(this.student.email, this.errors);
        },
        validateAddress() {
            validate150StringField(this.student.address, "address", this.errors);
        },
        validateMobileNumber() {
            validateMobileNumberField(this.student.mobile_number, "mobile_number", this.errors);
        },
        validateLandline() {
            validateLandlineField(this.student.landline, this.errors);
        },
        validateBirthdate() {
            validateBirthdateField(this.student.birthdate, this.errors);
        },
        validateBirthplace() {
            validate150StringField(this.student.birthplace, "birthplace", this.errors);
        },
        validateNationality() {
            validate150StringField(this.student.nationality, "nationality", this.errors);
        },
        validateGender() {
            validateEnumField(
                this.student.gender, 
                "gender", 
                ["MALE", "FEMALE", "OTHERS"], 
                this.errors
            );
        },
        validateCivilStatus() {
            validateEnumField(
                this.student.civil_status,
                "civil_status",
                ["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"],
                this.errors
            );
        },
        validateNoOfChildren() {
            validateNumberField(this.student.no_of_children, "no_of_children", this.errors);
        },
        validateOccupation() {
            validate30StringField(this.student.occupation, "occupation", this.errors);
        },
        validateSchool() {
            validate30StringField(this.student.school, "school", this.errors);
        },
        validateAdmin() {
            validate150StringField(this.student.admin, "admin", this.errors);
        },
        validateIsPartner() {
            validateBooleanField(this.student.is_partner_school, "is_partner_school", this.errors);
        },
        validateChurch() {
            validate150StringField(this.student.church, "church", this.errors);
        },
        validatePastor() {
            validate150StringField(this.student.pastor, "pastor", this.errors);
        },
        validateGradeschool() {
            if (this.student.gradeschool.length > 50) {
                this.errors["gradeschool"] =
                    "Gradeschool name should be less than 50 characters long";
                this.student.gradeschool_completed = false;
            } else {
                delete this.errors["gradeschool"];

                if (this.student.gradeschool.length > 0) {
                    this.student.gradeschool_completed = true;
                } else {
                    this.student.gradeschool_completed = false;
                }
            }
        },
        validateHighschool() {
            if (this.student.highschool.length === 0) {
                delete this.errors["highschool"];
                this.student.highschool_completed = false;
                return;
            }
            if (this.student.highschool.length > 50) {
                this.errors["highschool"] =
                    "Highschool name should be less than 50 characters long";
                this.student.highschool_completed = false;
            } else if (!this.student.gradeschool_completed) {
                this.errors["highschool"] = "Gradeschool name should be filled up";
                this.student.highschool_completed = false;
            } else {
                delete this.errors["highschool"];

                if (this.student.highschool.length > 0) {
                    this.student.highschool_completed = true;
                } else {
                    this.student.highschool_completed = false;
                }
            }
        },
        validateCollege() {
            if (this.student.college.length === 0) {
                delete this.errors["college"];
                this.student.college_completed = false;
                return;
            }
            if (this.student.college.length > 50) {
                this.errors["college"] = "College name should be less than 50 characters long";
                this.student.college_completed = false;
            } else if (!this.student.gradeschool_completed) {
                this.errors["college"] = "Gradeschool name should be filled up";
                this.student.college_completed = false;
            } else if (!this.student.highschool_completed) {
                this.errors["college"] = "Highschool name should be filled up";
                this.student.college_completed = false;
            } else if (this.student.college.length > 0 && this.student.college_course.length === 0) {
                this.errors["college_course"] = "Please put your college course";
                this.student.college_completed = false;
            } else {
                this.student.college_completed = true;
                delete this.errors["college"];
            }
        },
        validateCollegeCourse() {
            if (this.student.college.length === 0 && this.student.college_course.length === 0) {
                delete this.errors["college_course"];
                return;
            }
            if (this.student.college_course.length > 50) {
                this.errors["college_course"] =
                    "College course name should be less than 50 characters long";
            } else if (this.student.college_course.length > 0 && this.student.college.length === 0) {
                this.errors["college_course"] = "Please put your college name";
            } else {
                delete this.errors["college_course"];
            }
        },
        validateGraduate() {
            if (this.student.graduate.length === 0) {
                delete this.errors["graduate"];
                this.student.graduate_completed = false;
                return;
            }
            if (this.student.graduate.length > 50) {
                this.errors["graduate"] =
                    "Graduate school name should be less than 50 characters long";
                this.student.graduate_completed = false;
            } else if (!this.student.gradeschool_completed) {
                this.errors["graduate"] = "Gradeschool name should be filled up";
                this.student.graduate_completed = false;
            } else if (!this.student.highschool_completed) {
                this.errors["graduate"] = "Highschool name should be filled up";
                this.student.graduate_completed = false;
            } else if (!this.student.college_completed) {
                this.errors["graduate"] = "College name and course should be filled up";
                this.student.graduate_completed = false;
            } else if (this.student.graduate.length > 0 && this.student.graduate_course.length === 0) {
                this.errors["graduate_course"] = "Please put your graduate school course";
                this.student.graduate_completed = false;
            } else {
                delete this.errors["graduate"];
                this.student.graduate_completed = true;
            }
        },
        validateGraduateCourse() {
            if (this.student.graduate_course.length === 0 && this.student.graduate.length === 0) {
                delete this.errors["graduate_course"];
                return;
            }
            if (this.student.graduate_course.length > 50) {
                this.errors["graduate_course"] =
                    "Graduate course name should be less than 50 characters long";
            } else if (this.student.graduate.length > 0 && this.student.graduate_course.length === 0) {
                this.errors["graduate_course"] = "Please put your graduate school course";
            } else if (this.student.graduate_course.length > 0 && this.student.graduate.length === 0) {
                this.errors["graduate_course"] = "Please put your graduate school name";
            } else {
                delete this.errors["graduate_course"];
            }
        },
        validateOthers() {
            validate200StringField(this.student.others, "others", this.errors);
        },
        validateEssay() {
            validateTextAreaField(this.student.essay, "essay", this.errors);
        },
        validateEmergencyName() {
            validateLongNameField(this.student.emergency_name, "emergency_name", this.errors);
        },
        validateEmergencyAddress() {
            validate150StringField(this.student.emergency_address, "emergency_address", this.errors);
        },
        validateEmergencyNumber() {
            validateMobileNumberField(this.student.emergency_mobile_number, "emergency_mobile_number", this.errors);
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
    },
    async created() {
        await this.getStudentInfo().then(() => {
            this.render = true;
        });

        await this.getBills();
    },
};
</script>

<style scoped>
input {
    background-color: white;
}
</style>
