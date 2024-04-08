<script setup>
// Props
defineProps({
    optionsArray: {
        type: Array,
        required: true,
    },
    disabledOptions: Array,
    defaultOption: [String, Number],
});
// Emits
defineEmits(["on-select"]);
</script>

<template>
    <div>
        <button
            @click="showDropdown = !showDropdown"
            class="text-white bg-highlight hover:bg-higlight_hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center inline-flex items-center"
            type="button"
        >
            {{ selectedOption }}
            <svg
                class="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div
            v-show="showDropdown"
            class="absolute w-44 max-h-60 z-10 border bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 overflow-x-auto scroll-snap-x scrollbar-hidden smooth-scroll"
        >
            <ul
                class="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
            >
                <li v-for="option in optionsArray">
                    <button
                        v-if="isDisabled(option)"
                        :disabled="isDisabled(option)"
                        class="relative w-full text-gray-400 block px-4 py-2 text-left"
                    >
                        {{ option }}
                    </button>
                    <button
                        v-else
                        @click="selectOption(option)"
                        :class="{
                            'font-bold bg-highlight text-white': option === selectedOption,
                        }"
                        class="relative w-full block px-4 py-2 text-left hover:bg-gray-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        {{ option }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showDropdown: false,
            selectedOption: null,
        };
    },
    methods: {
        getFirstOption() {
            if (this.defaultOption === undefined || this.defaultOption === null) {
                for (let i = 0; i < this.optionsArray.length; i++) {
                    if (!this.isDisabled(this.optionsArray[i])) {
                        this.selectedOption = this.optionsArray[i];
                        break;
                    }
                }
            } else if (this.optionsArray.includes(this.defaultOption)) {
                this.selectedOption = this.defaultOption;
            } else {
                this.selectedOption = "Select a filter";
            }
        },
        selectOption(option) {
            this.selectedOption = option;
            this.showDropdown = false;
            this.$emit("on-select", this.selectedOption);
        },
        isDisabled(option) {
            if (!this.disabledOptions) return false;
            return this.disabledOptions.includes(option);
        },
    },
    beforeMount() {
        this.getFirstOption();
    },
};
</script>
