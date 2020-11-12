<template>
	<label class="group-select">
		<span class="group-select__label" v-if="label">
			{{ label }}
		</span>
		<select class="group-select__input" v-model="internalValue" @blur="handleBlur" @focus="handleFocus">
			<slot />
		</select>
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

.group-select {
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
		width: 100%;
	}
}
</style>
