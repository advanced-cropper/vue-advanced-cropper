<template>
	<div :class="b({open:open, sticky: sticky})" @click="$emit('click', $event)">
		<div :class="b('icon')">
			<span :class="b('bar')"></span>
			<span :class="b('bar')"></span>
			<span :class="b('bar')"></span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'menu-button',
	methods: {
		onScroll() {
			if (window.scrollY > 75 && !this.sticky) {
				this.sticky = true
			} else if (window.scrollY <= 75 && this.sticky) {
				this.sticky = false
			}
		}
	},
	beforeMount() {
		window.addEventListener('scroll', this.onScroll)
		window.addEventListener('orientationchange', this.onScroll)
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.onScroll)
		window.removeEventListener('orientationchange', this.onScroll)
	},
	data() {
		return {
			sticky: false
		}
	},
	props: {
		open: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

@import "../../../styles/constants";

.menu-button {
	$root: &;
	cursor: pointer;
	display: none;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	background-color: rgba($vue-color, 0.9);
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 999;

	@media (max-width: $screen-sm) {
		display: flex;
	}

	&--sticky {
		position: fixed;
		top: 20px;
	}




	&__icon {
		width: 25px;
		height: 19px;
		position: relative;
		transform: rotate(0deg);
		transition: 0.5s;
		cursor: pointer;
	}

	&__bar {
		display: block;
		position: absolute;
		height: 3px;
		width: 100%;
		background: white;
		border-radius: 1px;
		opacity: 1;
		left: 0;
		transform: rotate(0deg);
		transition: 0.15s;

		&:nth-child(1) {
			top: 0px;
			transform-origin: left center;
		}

		&:nth-child(2) {
			top: 8px;
			transform-origin: left center;
		}

		&:nth-child(3) {
			top: 16px;
			transform-origin: left center;
		}
	}

	&--open {
		#{$root}__bar {
			&:nth-child(1) {
				transform: rotate(45deg);
				top: -1px;
				left: 4px;
			}

			&:nth-child(2) {
				width: 0%;
				opacity: 0;
			}

			&:nth-child(3) {
				transform: rotate(-45deg);
				top: 17px;
				left: 4px;
			}
		}
	}

}
</style>
