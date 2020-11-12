<template>
	<label class="group-input">
		<span class="group-input__label" v-if="label">
			{{ label }}
		</span>
		<input
			class="group-input__input"
			:type="type"
			v-model="internalValue"
			@blur="handleBlur"
			@focus="handleFocus"
		/>
	</label>
</template>

<script>
export default {
	model: {
		event: 'change',
		prop: 'value',
	},
	props: {
		label: {
			type: String,
		},
		type: {
			type: String,
			default: 'text',
		},
		value: {
			type: [String, Number],
		},
	},
	methods: {
		handleFocus() {
			this.$emit('focus');
		},
		handleBlur() {
			this.$emit('blur');
		},
	},
	computed: {
		internalValue: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('change', value);
			},
		},
	},
};
</script>

<style lang="scss">
@import '../../styles/constants.scss';

.group-input {
	display: flex;
	flex-direction: column;
	&:not(:last-child) {
		margin-bottom: 12px;
	}
	&__label {
		font-size: 12px;
		margin-bottom: 6px;
	}
	&__input {
		border: solid 1px #eee;
		display: block;
		padding: 4px;
	}
}
</style>
