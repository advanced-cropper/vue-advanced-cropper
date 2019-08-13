<template>
  <div class="footer">
    <div class="footer__center-block">
      <img
        class="footer__logo"
        :src="require('../../assets/footer/logo.svg')"
      >
      <div class="footer__contacts">
        <div class="footer__name">
          Norserium
        </div>
        <a
          href="mailto:norserium@gmail.com"
          class="footer__email"
        >
          norserium@gmail.com
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../styles/grid";
@import "../../styles/fonts";
@import "../../styles/normalize";

.footer {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: $footer-height;
  margin-top: $footer-margin;
  &:before {
    content: url("../../assets/footer/background.svg");
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
  &__logo {
    margin-right: 19px;
  }
  &__center-block {
    display: flex;
    align-items: center;
    margin-top: 30px;
  }
  &__code-link {
    cursor: pointer;
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    background: rgba($vue-color, 0.9);
    width: 50px;
    height: 47px;
    padding-bottom: 3px;
  }
  &__email {
    color: #9d9d9d;
  }
  &__name {
    font-weight: bold;
  }
}

</style>
