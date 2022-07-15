// import needed libs
import Web3 from 'web3';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

/**
 * governanceVote creates a contract call transaction to post a vote
 * to the governance contract.
 *
 * @param {Web3} web3
 * @param {string} govAddress
 * @param {string} delegatedTo For self-delegation use the sender address.
 * @param {string|{BN}} proposalId
 * @param {[string|{BN}]} choices
 * @returns {{data: string, to: *, value: string}}
 */
function governanceVote(web3, govAddress, delegatedTo, proposalId, choices) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        to: govAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall(
            {
                constant: false,
                inputs: [
                    {
                        internalType: 'address',
                        name: 'delegatedTo',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'proposalID',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'choices',
                        type: 'uint256[]',
                    },
                ],
                name: 'vote',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [delegatedTo, proposalId, choices]
        ),
    };
}

/**
 * governanceCancelVote creates a contract call transaction to cancel
 * a vote user previously posted towards a given proposal.
 *
 * @param {Web3} web3
 * @param {string} govAddress
 * @param {string} delegatedTo For self-delegation use the sender address.
 * @param {string|{BN}} proposalId
 * @returns {{data: string, to: *, value: string}}
 */
function governanceCancelVote(web3, govAddress, delegatedTo, proposalId) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        to: govAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall(
            {
                constant: false,
                inputs: [
                    {
                        internalType: 'address',
                        name: 'delegatedTo',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'proposalID',
                        type: 'uint256',
                    },
                ],
                name: 'cancelVote',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [delegatedTo, proposalId]
        ),
    };
}

function governanceCreateProposal({
    contract = '',
    amount = '',
    name,
    description,
    options,
    minVotes,
    minAgreement,
    start,
    minEnd,
    maxEnd,
}) {
    const web3 = new Web3();

    return {
        to: contract,
        value: amount,
        data: web3.eth.abi.encodeFunctionCall(
            {
                constant: false,
                inputs: [
                    { internalType: 'string', name: '__name', type: 'string' },
                    { internalType: 'string', name: '__description', type: 'string' },
                    { internalType: 'bytes32[]', name: '__options', type: 'bytes32[]' },
                    { internalType: 'uint256', name: '__minVotes', type: 'uint256' },
                    { internalType: 'uint256', name: '__minAgreement', type: 'uint256' },
                    { internalType: 'uint256', name: '__start', type: 'uint256' },
                    { internalType: 'uint256', name: '__minEnd', type: 'uint256' },
                    { internalType: 'uint256', name: '__maxEnd', type: 'uint256' },
                ],
                name: 'create',
                outputs: [],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            [name, description, options, minVotes, minAgreement, start, minEnd, maxEnd]
        ),
    };
}

// what we export here
export default {
    governanceVote,
    governanceCancelVote,
    governanceCreateProposal,
};
