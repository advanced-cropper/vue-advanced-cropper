<template>
  <div id="app">
    <div class="navigation">
      <div class="navigation__frameworks">
        <a class="navigation__link navigation__link--active" href="/">
          Vue
        </a>
        <a class="navigation__link" href="/">
          React
        </a>
      </div>
      <div class="navigation__sections">
        <router-link class="navigation__link" active-class="navigation__link--active" to="/" exact="true">
          Home
        </router-link>
        <router-link class="navigation__link" active-class="navigation__link--active" to="/docs">
          Docs
        </router-link>
      </div>
    </div>
		<div class="view">
    	<router-view/>
		</div>
		<div class="footer">
			<div class="footer__center-block">
			<img
				class="footer__logo"
				:src="require('./assets/footer/logo.svg')"
			>
			<div class="footer__contacts">
				<div class="footer__name">
					Norserium
				</div>
				<a href="mailto:norserium@gmail.com" class="footer__email">
					norserium@gmail.com
				</a>
			</div>
			</div>
		</div>
  </div>
</template>

<style lang="scss">
@import "./styles/grid";
@import "./styles/fonts";
@import "./styles/normalize";

.navigation {
  @include container;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  display: flex;
  height: 77px;
  align-items: center;
  z-index: 1;
  &__sections {
    margin-left: auto;
  }
  &__link {
    color: white;
    text-decoration: none;
    opacity: 0.5;
    &--active {
      opacity: 1;
    }
    &:not(:last-child) {
      margin-right: 40px;
    }
  }
}

.view {
	min-height: calc(100vh - #{$footer-margin + $footer-height});
}

.footer {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
	justify-content: center;
  height: $footer-height;
  margin-top: $footer-margin;
  &:before {
    content: url("./assets/footer/background.svg");
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


#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
