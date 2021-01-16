<script>
import bem from 'easy-bem';
import { Preview } from '../../components/helpers';

export default {
	components: {
		Preview,
	},
	inheritAttrs: false,
};
</script>

<template>
	<preview v-bind="$attrs" :fill="true" />
</template>
