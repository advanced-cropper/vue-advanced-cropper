<script>
import classnames from 'classnames';
import bem from 'easy-bem';

const cn = bem('vue-preview-result')

export default {
	name: 'PreviewResult',
	props: {
		img: {
			type: String
		},
		classname: {
			type: String,
		},
		imageClassname: {
			type: String,
		},
		width: {
			type: Number,
		},
		height: {
			type: Number,
		},
		top: {
			type: Number,
		},
		left: {
			type: Number,
		},
		previewWidth: {
			type: Number,
			required: true
		},
		previewHeight: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			imageSize: {
				width: 0,
				height: 0
			}
		}
	},
	inject: ['getArea'],
	mounted() {
		this.onChangeImage();
	},
	methods: {
		onChangeImage() {
			const image = this.$refs.image;
			if (image.complete) {
				this.$forceUpdate();
			} else {
				image.addEventListener('load', () => {
					this.$forceUpdate();
				});
			}
		},
	},
	watch: {
		img() {
			this.onChangeImage();
		},
		'$props':{
			handler (val, oldVal) {
				this.$forceUpdate();
			},
			deep: true
		}
	},
	updated() {
		// Workaround to get the area element
		const area = this.getArea()

		const image = this.$refs.image
		const wrapper = this.$refs.wrapper

		const coefficient = this.previewHeight / this.height

		const height = image.naturalHeight * coefficient
		const width = image.naturalWidth * coefficient

		const areaCoordinates = area.getBoundingClientRect()
		const wrapperCoordinates = wrapper.getBoundingClientRect()

		const left = areaCoordinates.left - wrapperCoordinates.left
		const top = areaCoordinates.top - wrapperCoordinates.top

		image.style.width = `${width}px`
		image.style.height = `${height}px`
		image.style.left = `${left}px`
		image.style.top = `${top}px`
	},
	computed: {
		classnames() {
			return {
				default: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClassname)
			}
		},

	},
};
</script>

<template>
  <div
    :class="classnames.default"
  >
	<div ref="wrapper">
		<img
		ref="image"
		:src="img"
		:class="classnames.image"
		>
	</div>
  </div>
</template>

<style lang="scss">
  .vue-preview-result{
    overflow: hidden;
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
    &__image {
    	pointer-events: none;
      position: absolute;
			user-select: none;
			// Workaround to prevent bugs at the websites with max-width
			// rule applited to img (Vuepress for example)
			max-width: unset !important;
    }
  }
</style>
