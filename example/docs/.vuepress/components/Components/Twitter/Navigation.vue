<script>
	export default {
		props: {
			zoom: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				focus: false
			};
		},
		mounted() {
			window.addEventListener('mouseup', this.onStop, { passive: false, });
			window.addEventListener('mousemove', this.onDrag, { passive: false, });
			window.addEventListener('touchmove', this.onDrag, { passive: false, });
			window.addEventListener('touchend', this.onStop, { passive: false, });
		},
		destroyed() {
			window.removeEventListener('mouseup', this.onStop);
			window.removeEventListener('mousemove', this.onDrag);
			window.removeEventListener('touchmove', this.onDrag);
			window.removeEventListener('touchend', this.onStop);
		},
		methods: {
			onDrag(e) {
				if (this.focus) {
					const position = e.touches ? e.touches[0].clientX : e.clientX;
					const line = this.$refs.line;

					if (line) {
						const {left, width} = line.getBoundingClientRect();
						this.$emit('change', Math.min(1,  Math.max(0, position - left) / width))
					}
					if (e.preventDefault) {
						e.preventDefault();
					}
				}
			},
			onStop() {
				this.focus = false;
			},
			onStart(e) {
				this.focus = true;
				this.onDrag(e);
			},
		}
	};
</script>


<template>
	<div class="twitter-navigation">
		<div class="twitter-navigation__wrapper">
			<div class="twitter-navigation__zoom-icon twitter-navigation__zoom-icon--left">
				<svg viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path><path d="M14.46 11.75H7.54c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h6.92c.415 0 .75.336.75.75s-.335.75-.75.75z"></path></g></svg>
			</div>
			<div class="twitter-navigation__line-wrapper" ref="line" @mousedown="onStart" @touchstart="onStart">
				<div class="twitter-navigation__line" >
					<div
						class="twitter-navigation__fill"
						:style="{
							flexGrow: zoom
						}"
					></div>
					<div
						class="twitter-navigation__circle"
						:class="{'twitter-navigation__circle--focus': focus}"
						:style="{
							left: `${zoom * 100}%`
						}"
					>
						<div class="twitter-navigation__inner-circle"
						     :class="{'twitter-navigation__inner-circle--focus': focus}"
						></div>
					</div>
				</div>
			</div>

			<div class="twitter-navigation__zoom-icon twitter-navigation__zoom-icon--right">
				<svg viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path><path d="M15.21 11c0 .41-.34.75-.75.75h-2.71v2.71c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-2.71H7.54c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h2.71V7.54c0-.41.34-.75.75-.75s.75.34.75.75v2.71h2.71c.41 0 .75.34.75.75z"></path></g></svg>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	.twitter-navigation {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		height: 50px;
		&__wrapper {
			display: flex;
			align-items: center;
			max-width: 400px;
			width: 100%;
		}
		&__zoom-icon {
			height: 18.75px;
			width: 18.75px;
			fill: rgb(101, 119, 134);
			flex-shrink: 0;
			&--left {
				margin-right: 10px;
			}
			&--right {
				margin-left: 10px;
			}
		}
		&__line-wrapper {
			width: 100%;
			height: 20px;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			border-radius: 5px;
			cursor: pointer;
		}
		&__line {
			background: rgb(142, 208, 249);
			height: 5px;
			width: 100%;
			border-radius: 5px;
			display: flex;
			position: relative;
			align-items: center;
		}
		&__fill {
			background: rgb(29, 161, 242);
			align-self: stretch;
			flex-basis: auto;
			flex-direction: column;
			flex-shrink: 0;
		}
		&__circle {
			width: 30px;
			height: 30px;
			margin-left: -15px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			transition-duration: 0.2s;
			transition-property: background-color, box-shadow;
			background-color: transparent;
			&:hover {
				background-color: rgba(29, 161, 242, 0.1);
			}
			&--focus {
				background-color: rgba(29, 161, 242, 0.2);
			}
		}
		&__inner-circle {
			width: 15px;
			height: 15px;
			border-radius: 50%;
			background-color: rgb(29, 161, 242);
			transform: scale(1);
			transition-duration: 0.1s;
			transition-property: transform;
			box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 7px, rgba(101, 119, 134, 0.15) 0px 1px 3px 1px;
			&--focus {
				transform: scale(1.2);
			}
		}
	}
</style>
