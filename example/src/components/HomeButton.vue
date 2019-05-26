<template>
  <div :class="b({action: this.action})">
    <div :class="b('icon-part')">
      <img
        :src="this.icon"
        :class="b('icon')"
      >
    </div>
    <div :class="b('text-part')">
      <div :class="b('text')">
        {{ this.text }}
      </div>
      <div :class="b('caption')">
        {{ this.caption }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'home-button',
	props: {
	  icon: {
		  type: String,
		  required: true
	  },
	  text: {
		  type: String,
		  required: true
	  },
	  caption: {
		  type: String
	  },
	  action: {
		  type: Boolean,
		  default: false
	  },
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../styles/constants";

.home-button {
  border-radius: 5px;
  box-shadow: 0px 3px 6px 0px rgba(2, 3, 3, 0.18);
  transition: box-shadow $transition-time;
  background: $vue-color;
  display: flex;
  text-align: left;
  align-items: center;
  padding: 9px 21px 9px 14px;
  color: white;
  &__icon-part {
	  margin-right: 15px;
	  display: flex;
	  align-items: center;
  }
  &__icon {
	  flex-shrink: 0;
  }
  &__text {
	  font-size: 18px;
	  font-weight: 600;
  }
  &__caption {
	  font-size: 10px;
	  font-weight: lighter;
  }
  &--action {
	  background: white;
	  color: $vue-color;
  }
  &:hover {
	  box-shadow: 0px 4px 7px 0px rgba(2, 3, 3, 0.25);
	  cursor: pointer;
  }
}
</style>
