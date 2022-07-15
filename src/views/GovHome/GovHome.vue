<template>
    <div class="view-gov-home">
        <h1 data-focus>Governance</h1>

        <f-tabs>
            <template #proposals>
                Proposals
                <span class="f-records-count">({{ proposalsRecordsCount }})</span>
            </template>

            <f-tab title-slot="proposals">
                <gov-proposal-list @records-count="proposalsRecordsCount = $event" />
            </f-tab>

            <f-tab title="Proposals generator">
                <f-card class="proposalgenerator_fcard">
                    <gov-proposals-generator @reload-view="$emit('reload-view')" />
                </f-card>
            </f-tab>
        </f-tabs>
    </div>
</template>

<script>
import GovProposalList from '@/components/data-tables/GovProposalList/GovProposalList.vue';
import { focusElem } from '@/utils/aria.js';
import FTabs from '@/components/core/FTabs/FTabs.vue';
import FTab from '@/components/core/FTabs/FTab.vue';
import GovProposalsGenerator from '@/components/GovProposalsGenerator/GovProposalsGenerator.vue';
import FCard from '@/components/core/FCard/FCard.vue';

export default {
    name: 'GovHome',

    components: { FCard, GovProposalsGenerator, FTab, FTabs, GovProposalList },

    data() {
        return {
            proposalsRecordsCount: 0,
        };
    },

    mounted() {
        focusElem(this.$el);
    },
};
</script>

<style lang="scss">
.proposalgenerator_fcard {
    overflow: hidden;
}
</style>
