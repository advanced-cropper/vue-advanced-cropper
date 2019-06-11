<template>
  <div :class="b()">
    <a
      :class="b('code-link')"
      :href="href"
    >
      <img
        :src="require('../assets/components/source.svg')"
        alt=""
      >
    </a>
    <slot />
  </div>
</template>

<script>
export default {
	name: 'example',
	props: {
		href: {
			type: String
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../styles/constants";

.example {
  border-top: solid 3px $vue-color;
  position: relative;
  overflow: hidden;
  &__code-link {
    cursor: pointer;
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    background: rgba($vue-color,0.9);
    width: 50px;
    height: 47px;
    padding-bottom: 3px;
  }
}
</style>
