<template>
  	<div :class="b()">
      	<router-link :class="b('link')" :active-class="b('link', {active: true})" to="/">Home</router-link> |
      	<router-link :class="b('link', {right:true})" :active-class="b('link', {active: true})" to="/">Home</router-link> |
      	<router-link :class="b('link', {right:true})" :active-class="b('link', {active: true})" to="/docs">Docs</router-link>
	</div>
</template>

<script>
export default {
  name: 'navigation'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
