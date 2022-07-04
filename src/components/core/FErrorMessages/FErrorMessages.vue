<template>
    <div :id="errorsContId" class="ferrormessages" role="alert" aria-atomic="true">
        <div v-for="error in cErrors" :key="error.id" class="ferrormessages_message">
            {{ error.msg }}
        </div>
    </div>
</template>

<script>
import { getUniqueId } from '@/utils/index.js';

/**
 * Component for displaying form element's error messages
 */
export default {
    name: 'FErrorMessages',

    props: {
        /**
         * Id of element that wraps error messages. Used to inform assistive technology about errors.
         */
        errorsContId: {
            type: String,
            default: '',
            required: true,
        },
        /**
         * Array of error messages.
         */
        errors: {
            type: Array,
            default() {
                return [];
            },
        },
    },

    computed: {
        cErrors() {
            return this.errors.map((error) => {
                if (typeof error === 'string') {
                    return {
                        id: getUniqueId(),
                        msg: error,
                    };
                }

                return error;
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
