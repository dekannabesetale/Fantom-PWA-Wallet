<template>
    <f-form class="govproposalsgeneratorform" @f-form-submit="onSubmit">
        <fieldset>
            <legend class="not-visible">Proposals generator</legend>
            <div class="form-body">
                <div>
                    <f-input
                        type="text"
                        name="proposalName"
                        label="Name of the proposal"
                        maxlength="120"
                        show-chars-counter
                        field-size="large"
                        :validator="proposalNameValidator"
                        validate-on-input
                    >
                        <template #bottom>
                            <f-error-messages errors-cont-id="proposalName" :errors="proposalNameErrors" />
                        </template>
                    </f-input>
                    <f-input
                        type="text"
                        name="proposalDescription"
                        label="Description"
                        is-textarea
                        rows="7"
                        maxlength="500"
                        show-chars-counter
                        field-size="large"
                        :validator="proposalDescriptionValidator"
                        validate-on-input
                    >
                        <template #bottom>
                            <f-error-messages
                                errors-cont-id="proposalDescription"
                                :errors="proposalDescriptionErrors"
                            />
                        </template>
                    </f-input>
                    <gov-voting-options-generator ref="optionsGenerator" />
                </div>
                <div>
                    <f-slider
                        name="minParticipation"
                        :value="55"
                        use-lower-fill-bar
                        label="Minimum participation"
                        min="55"
                        max="100"
                        :labels="['55%', '100%']"
                        clickable-labels
                        use-tooltip
                    >
                        <template #tooltip-value="{ value }">{{ value }}%</template>
                    </f-slider>
                    <f-slider
                        name="minAgreement"
                        :value="55"
                        use-lower-fill-bar
                        label="Minimum agreement"
                        min="55"
                        max="100"
                        :labels="['55%', '100%']"
                        clickable-labels
                        use-tooltip
                    >
                        <template #tooltip-value="{ value }">{{ value }}%</template>
                    </f-slider>
                    <div class="govproposalsgeneratorform_timeinputs">
                        <f-input
                            type="number"
                            name="startTime"
                            label="Start time"
                            min="1"
                            max="720"
                            value="1"
                            field-size="large"
                            :validator="startTimeValidator"
                            validate-on-input
                        >
                            <template #bottom><span class="infotext">min 1 - max 720</span></template>
                            <template #suffix><span class="inputsuffix">hours</span></template>
                        </f-input>
                        <f-input
                            ref="endingMinimumTimeInput"
                            type="number"
                            name="endingMinimumTime"
                            label="Ending in minimum"
                            min="7"
                            max="180"
                            value="7"
                            field-size="large"
                            :validator="endingMinimumTimeValidator"
                            validate-on-input
                        >
                            <template #bottom><span class="infotext">min 7 - max 180</span></template>
                            <template #suffix><span class="inputsuffix">days</span></template>
                        </f-input>
                        <f-input
                            ref="endingMaximumTimeInput"
                            type="number"
                            name="endingMaximumTime"
                            label="Ending in maximum"
                            min="7"
                            max="180"
                            value="7"
                            field-size="large"
                            :validator="endingMaximumTimeValidator"
                            validate-on-input
                        >
                            <template #bottom><span class="infotext">min 7 - max 180</span></template>
                            <template #suffix><span class="inputsuffix">days</span></template>
                        </f-input>
                    </div>
                    <div class="form-buttons align-center">
                        <f-error-messages :errors="timeInputErrors" errors-cont-id="sdf" />
                        <f-button type="sumbit" label="Create proposal" class="large" />
                    </div>
                    <div class="govproposalsgeneratorform_fee">Proposal fee: {{ proposalFee }} FTM</div>
                </div>
            </div>
        </fieldset>
    </f-form>
</template>

<script>
import FForm from '@/components/core/FForm/FForm.vue';
import FInput from '@/components/core/FInput/FInput.vue';
import FSlider from '@/components/core/FSlider/FSlider.vue';
import FButton from '@/components/core/FButton/FButton.vue';
import GovVotingOptionsGenerator from '@/components/GovVotingOptionsGenerator/GovVotingOptionsGenerator.vue';
import FErrorMessages from '@/components/core/FErrorMessages/FErrorMessages.vue';

export default {
    name: 'GovProposalsGeneratorForm',

    components: { FErrorMessages, GovVotingOptionsGenerator, FButton, FSlider, FInput, FForm },

    data() {
        return {
            proposalNameErrors: [],
            proposalDescriptionErrors: [],
            timeInputErrors: [],
            proposalFee: 100,
        };
    },

    methods: {
        proposalNameValidator(value) {
            this.proposalNameErrors = [];

            if (!value.trim()) {
                this.proposalNameErrors.push('Please enter a title');
                return false;
            }

            return true;
        },

        proposalDescriptionValidator(value) {
            this.proposalDescriptionErrors = [];

            if (!value.trim()) {
                this.proposalDescriptionErrors.push('Please enter a description');
                return false;
            }

            return true;
        },

        startTimeValidator(value) {
            return this.rangeValidator(value, 1, 720, 'Please enter start time between 1 and 720');
        },

        endingMinimumTimeValidator(value) {
            return (
                this.rangeValidator(value, 7, 180, 'Please enter minimum time between 7 and 180') &&
                this.endingMinMaxTimeValidator()
            );
        },

        endingMaximumTimeValidator(value) {
            return (
                this.rangeValidator(value, 7, 180, 'Please enter maximum time between 7 and 180') &&
                this.endingMinMaxTimeValidator()
            );
        },

        endingMinMaxTimeValidator() {
            const errorMessage = 'Minimum time should be equal or less than maximum time';
            const min = parseInt(this.$refs.endingMinimumTimeInput.$refs.input.value);
            const max = parseInt(this.$refs.endingMaximumTimeInput.$refs.input.value);

            this.removeErrorMessage(this.timeInputErrors, errorMessage);

            if (!isNaN(min) && !isNaN(max) && min > max) {
                this.timeInputErrors.push(errorMessage);
                return false;
            }

            return true;
        },

        rangeValidator(value, min = 0, max = 100, errorMessage = '') {
            const val = parseInt(value);

            this.removeErrorMessage(this.timeInputErrors, errorMessage);

            if (isNaN(val) || val < min || val > max) {
                this.timeInputErrors.push(errorMessage);
                return false;
            }

            return true;
        },

        removeErrorMessage(errors, errorMessage) {
            const index = errors.indexOf(errorMessage);

            if (index > -1) {
                errors.splice(index, 1);
            }
        },

        isFormValid(values) {
            return (
                this.$refs.optionsGenerator.validateOptions() &&
                this.proposalNameValidator(values.proposalName) &&
                this.proposalDescriptionValidator(values.proposalDescription) &&
                this.startTimeValidator(values.startTime) &&
                this.endingMinimumTimeValidator(values.endingMinimumTime) &&
                this.endingMaximumTimeValidator(values.endingMaximumTime)
            );
        },

        onSubmit(event) {
            const values = { ...event.detail.data, votingOptions: this.$refs.optionsGenerator.getOptions() };

            Object.keys(values).forEach((key) => {
                const value = values[key];

                if (typeof value === 'string') {
                    values[key] = value.trim();
                }
            });

            if (this.isFormValid(values)) {
                this.$emit('submit', values);
            }
        },
    },
};
</script>

<style lang="scss">
.govproposalsgeneratorform {
    .form-body {
        display: flex;
        gap: 32px;

        > *:first-child {
            flex: 1;
        }

        > *:last-child {
            flex: 1;
        }
    }

    .f-input {
        margin-bottom: 32px;
    }

    .f-slider {
        margin-bottom: 32px;

        .f-input {
            margin-bottom: 16px;
        }

        label {
            margin-bottom: 8px;
        }
    }

    .form-buttons {
        .ferrormessages {
            padding-bottom: 16px;
        }
    }

    &_timeinputs {
        display: flex;
        gap: 16px;
        align-items: flex-end;

        > *:nth-child(1) {
            flex: 1.4;
        }

        > *:nth-child(2) {
            flex: 2;
        }

        > *:nth-child(3) {
            flex: 2;
        }
    }

    &_fee {
        padding-top: 4px;
        text-align: center;
    }

    .infotext,
    &_fee {
        font-size: 0.9em;
        color: #9299a6;
    }

    .inputsuffix {
        color: #9299a6;
        padding-inline-end: 8px;
    }
}
</style>
