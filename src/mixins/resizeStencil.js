export default {
  mounted() {
    if (!this.$refs.stencil) {
      throw new Error('You should add ref "Stencil" to your root stencil component to use dragStencil mixin')
    }
  },
  methods: {
    onResize(resize) {
      this.$emit('change', {
        width: this.width + resize.right + resize.left,
        height: this.height + resize.top + resize.bottom,
        left: this.left - resize.left,
        top: this.top - resize.top
      })
    }
  }
}
