<template>
	<label class="group-checkbox">
		<input
			class="group-checkbox__input"
			type="checkbox"
			v-model="internalValue"
			@blur="handleBlur"
			@focus="handleFocus"
		/>
		<span class="group-checkbox__label" v-if="label">
			{{ label }}
		</span>
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
				type: [Boolean],
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

	.group-checkbox {
		display: flex;
		align-items: center;
		&:not(:last-child) {
			margin-bottom: 12px;
		}
		&__label {
			font-size: 12px;
			margin-left: 6px;
		}
		&__input {
			border: solid 1px #eee;
			display: block;
			padding: 4px;
		}
	}
</style>
