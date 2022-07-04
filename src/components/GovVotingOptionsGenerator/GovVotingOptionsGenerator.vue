<template>
    <div class="govvotingoptionsgenerator">
        <f-input
            v-for="(option, index) in options"
            :key="option.id"
            type="text"
            :name="`votingOption_${index}`"
            :label="option.label || null"
            :data-idx="index"
            maxlength="31"
            show-chars-counter
            field-size="large"
            @keydown.native="onInputKeydown"
            @keyup.native="onInputKeyup"
        >
            <template #suffix>
                <f-button
                    v-if="index > 0"
                    round
                    class="same-size secondary small"
                    title="Remove voting option"
                    @click.native="onRemoveOptionButtonClick"
                >
                    <icon data="@/assets/svg/times.svg" width="16" height="16" />
                </f-button>
            </template>
        </f-input>
        <f-error-messages errors-cont-id="votingOptions" :errors="votingOptionsErrors" />
        <div class="align-center">
            <f-button class="secondary" @click.native="onAddOptionButtonClick">
                <icon data="@/assets/svg/plus.svg" width="16" height="16" aria-hidden="true" /> Add one more option
            </f-button>
        </div>
    </div>
</template>

<script>
import FInput from '@/components/core/FInput/FInput.vue';
import FButton from '@/components/core/FButton/FButton.vue';
import { getUniqueId, throttle } from '@/utils/index.js';
import FErrorMessages from '@/components/core/FErrorMessages/FErrorMessages.vue';

export default {
    name: 'GovVotingOptionsGenerator',

    components: { FErrorMessages, FButton, FInput },

    data() {
        return {
            options: [
                {
                    label: 'Voting options',
                    id: getUniqueId(),
                },
            ],
            justRemoved: false,
            votingOptionsErrors: [],
            validateOptionsThrottled: throttle(() => this.validateOptions(), 300),
        };
    },

    methods: {
        addNewOption(afterInputIndex = -1) {
            let index = 0;
            const option = { id: getUniqueId() };

            if (afterInputIndex > -1) {
                index = afterInputIndex + 1;
                this.options.splice(index, 0, option);
            } else {
                this.options.push(option);
                index = this.options.length - 1;
            }

            this.$nextTick(() => {
                this.focusInputByIndex(index);
            });
        },

        removeOptionByIndex(index) {
            if (index > -1) {
                this.justRemoved = true;

                this.options.splice(index, 1);

                this.$nextTick(() => {
                    this.focusInputByIndex(index === this.options.length ? index - 1 : index);
                });
            }
        },

        removeEmptyOptions() {
            const inputs = this.getInputElements();
            const toBeRemoved = [];

            inputs.forEach((input, index) => {
                if (input.value.trim() === '' && index > 0) {
                    toBeRemoved.push(index);
                }
            });

            toBeRemoved.reverse().forEach((index) => {
                this.removeOptionByIndex(index);
            });
        },

        getOptions(dontRemoveEmptyOptions = false) {
            const options = [];

            if (!dontRemoveEmptyOptions) {
                this.removeEmptyOptions();
            }

            this.getInputElements().forEach((input) => {
                const value = input.value.trim();

                if (value !== '') {
                    options.push(value);
                }
            });

            return options;
        },

        validateOptions() {
            this.votingOptionsErrors = [];

            const values = this.getOptions(true);

            if (values.length === 0) {
                this.votingOptionsErrors.push('Please enter at least one voting option');
                return false;
            }

            return true;
        },

        focusInputByIndex(index) {
            const inputs = this.getInputElements();
            const input = inputs[index];

            if (input) {
                input.focus();
            }
        },

        getInputElements() {
            return this.$el.querySelectorAll('input[type="text"]');
        },

        getInputIndex(inputElem) {
            const index = inputElem ? parseInt(inputElem.getAttribute('data-idx')) : -1;

            return isNaN(index) ? -1 : index;
        },

        isEnterKeyOnInput(event) {
            return event.key === 'Enter' && event.target.tagName.toLowerCase() === 'input';
        },

        onAddOptionButtonClick() {
            this.addNewOption();
        },

        onRemoveOptionButtonClick(event) {
            this.removeOptionByIndex(this.getInputIndex(event.target.closest('[data-idx]')));
            this.validateOptionsThrottled();
        },

        onInputKeydown(event) {
            if (this.isEnterKeyOnInput(event)) {
                event.preventDefault();
            }
        },

        onInputKeyup(event) {
            if (this.isEnterKeyOnInput(event)) {
                event.preventDefault();
                event.stopPropagation();

                if (!this.justRemoved) {
                    this.addNewOption(this.getInputIndex(event.target.closest('[data-idx]')));
                }
            } else {
                this.validateOptionsThrottled();
            }

            this.justRemoved = false;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
