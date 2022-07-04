<template>
    <gov-proposals-generator-form @submit="onSubmit" />
</template>

<script>
import GovProposalsGeneratorForm from '@/components/forms/GovProposalsGeneratorForm.vue';

export default {
    name: 'GovProposalsGenerator',

    components: { GovProposalsGeneratorForm },

    methods: {
        onSubmit(values) {
            console.log('GovProposalsGenerator', values);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
