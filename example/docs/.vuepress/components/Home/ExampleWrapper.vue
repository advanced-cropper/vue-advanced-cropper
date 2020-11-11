<template>
  <div class="home-example-wrapper">
    <a
      class="home-example-wrapper__code-link"
      :href="href"
    >
      <img :src="require('../../assets/components/source.svg')">
    </a>
    <slot />
  </div>
</template>

<script>
export default {
	name: 'ExampleWrapper',
	props: {
		href: {
			type: String,
		},
	},
};
</script>
<style lang="scss">
@import "../../styles/constants";

.home-example-wrapper {
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
