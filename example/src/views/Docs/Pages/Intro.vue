<template>
  <div>
    <h2> Getting started</h2>
	<p>
		Install the package to use by webpack, rollup and etc
	</p>
	<pre v-highlightjs><code class="bash">npm install --save vue-advanced-cropper</code></pre>
	<pre v-highlightjs><code class="bash">yarn add vue-advanced-cropper</code></pre>
	<p>
		Then import it in your <tt>script</tt> block for single file components or your script file
		<pre v-highlightjs><code class="bash">
import Vue from 'vue';
import Cropper from 'vue-advanced-cropper';
		</code></pre>
	</p>

  </div>
</template>

<script>
export default {
	name: 'HelloWorld',
	props: {
		msg: String
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
