<template>
    <div class="govproposalcreationconfirmation">
        <tx-confirmation
            :tx="tx"
            card-off
            send-button-label="Submit"
            password-label="Please enter your wallet password to create proposal"
            :on-send-transaction-success="onSendTransactionSuccess"
            :show-cancel-button="true"
            :window-mode="true"
            class="min-h-100"
            @cancel-button-click="$emit('cancel-button-click', $event)"
        >
            <div class="govproposalcreationconfirmation_body">
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Name of the proposal</div>
                    <div class="col break-word">
                        {{ proposalsGeneratorFormValues.proposalName }}
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Description</div>
                    <div class="col break-word">
                        {{ proposalsGeneratorFormValues.proposalDescription }}
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Voting options</div>
                    <div class="col break-word">
                        <div
                            v-for="(option, index) in proposalsGeneratorFormValues.votingOptions"
                            :key="`pgvo_${index}`"
                        >
                            {{ option }}
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Minimum participation</div>
                    <div class="col break-word">{{ proposalsGeneratorFormValues.minParticipation }}%</div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Minimum agreement</div>
                    <div class="col break-word">{{ proposalsGeneratorFormValues.minAgreement }}%</div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Start time</div>
                    <div class="col break-word">
                        {{ proposalsGeneratorFormValues.startTime }} hour{{
                            proposalsGeneratorFormValues.startTime > 1 ? 's' : ''
                        }}
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Ending in minimum</div>
                    <div class="col break-word">{{ proposalsGeneratorFormValues.endingMinimumTime }} days</div>
                </div>
                <div class="row no-collapse">
                    <div class="col-5 f-row-label">Ending in maximum</div>
                    <div class="col break-word">{{ proposalsGeneratorFormValues.endingMaximumTime }} days</div>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" :max-fee="tx._fee" />
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import web3Utils from 'web3-utils';
import { bToWei, toHex } from '@/utils/big-number.js';
import TxConfirmation from '@/components/TxConfirmation/TxConfirmation.vue';
import LedgerConfirmationContent from '@/components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import governanceUtils from 'fantom-ledgerjs/src/governance-utils.js';
import { mapGetters } from 'vuex';
import appConfig from '../../../app.config.js';
// import { viewHelpersMixin } from '@/mixins/view-helpers.js';

const HOUR = 60 * 60;
const DAY = 60 * 60 * 24;
const CONTRACT = appConfig.useTestnet
    ? '0xb4673f085ae472c2974febfed3a41bb73aeb172e'
    : '0xc9f5aa2c93ae9e89a77dc60e7e3cfff1234e4287';
const PROPOSAL_FEE = 100;

export default {
    name: 'GovProposalCreationConfirmation',
    components: { LedgerConfirmationContent, TxConfirmation },
    // mixins: [viewHelpersMixin],

    props: {
        proposalsGeneratorFormValues: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            tx: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.setTx();
    },

    methods: {
        async setTx() {
            this.tx = await this.$fWallet.getDefiTransactionToSign(
                governanceUtils.governanceCreateProposal({
                    contract: CONTRACT,
                    amount: toHex(bToWei(PROPOSAL_FEE)),
                    ...this.getContractValues(this.proposalsGeneratorFormValues),
                }),
                this.currentAccount.address
            );
        },

        getContractValues(values) {
            return {
                name: values.proposalName,
                description: values.proposalDescription,
                options: this.convertVotingOptions(values.votingOptions),
                minVotes: this.convertPercentage(values.minParticipation),
                minAgreement: this.convertPercentage(values.minAgreement),
                start: this.convertTimeToSeconds(values.startTime, 'hours'),
                minEnd: this.convertTimeToSeconds(values.endingMinimumTime, 'days'),
                maxEnd: this.convertTimeToSeconds(values.endingMaximumTime, 'days'),
            };
        },

        convertVotingOptions(options) {
            return options.map((option) => web3Utils.padRight(web3Utils.stringToHex(option), 64));
        },

        convertPercentage(percentage) {
            return `0x0${bToWei(percentage).dividedBy(100).toString(16)}`;
        },

        convertTimeToSeconds(value, timeUnit = 'hours') {
            const val = parseInt(value);

            return timeUnit === 'hours' ? val * HOUR : val * DAY;
        },

        onSendTransactionSuccess(_data) {
            const transactionSuccessComp = 'gov-proposal-creation-transaction-success-message';
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: 'hide-window',
                continueButtonLabel: 'Close',
                continueToParams: { isView: false },
            };

            this.$emit('change-component', {
                to: transactionSuccessComp,
                data: { ...params, cardOff: true, windowMode: true },
            });
        },
    },
};
</script>

<style lang="scss">
.govproposalcreationconfirmation {
    &_body {
        padding-bottom: 16px;
    }

    .row > * {
        padding-top: 0;
        padding-bottom: 4px;
    }

    .f-row-label {
        line-height: 1.2;
    }
}
</style>
