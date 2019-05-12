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
        <router-link class="navigation__link" active-class="navigation__link--active" to="/">
          Home
        </router-link>
        <router-link class="navigation__link" active-class="navigation__link--active" to="/docs">
          Docs
        </router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './styles/grid';
@import './styles/fonts';
@import './styles/normalize';


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

#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
