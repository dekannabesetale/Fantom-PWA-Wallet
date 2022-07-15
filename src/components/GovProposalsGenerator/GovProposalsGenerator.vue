<template>
    <div>
        <gov-proposals-generator-form @submit="onSubmit" />
        <tx-confirmation-window
            ref="confirmationWindow"
            body-min-height="350px"
            :steps-count="1"
            :active-step="1"
            window-title="Create proposal"
            @cancel-button-click="onCancelButtonClick"
        />
    </div>
</template>

<script>
import GovProposalsGeneratorForm from '@/components/forms/GovProposalsGeneratorForm.vue';
import TxConfirmationWindow from '@/components/windows/TxConfirmationWindow/TxConfirmationWindow.vue';

export default {
    name: 'GovProposalsGenerator',

    components: { TxConfirmationWindow, GovProposalsGeneratorForm },

    methods: {
        onSubmit(values) {
            this.$refs.confirmationWindow.changeComponent('gov-proposal-creation-confirmation', {
                proposalsGeneratorFormValues: values,
            });
            this.$refs.confirmationWindow.show();
        },

        onCancelButtonClick(cancelClicked) {
            if (!cancelClicked) {
                this.$emit('reload-view');
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
