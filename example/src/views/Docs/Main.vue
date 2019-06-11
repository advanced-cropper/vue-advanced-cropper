<template>

	<div class="docs">
		<div class="header"></div>
		<div class="body">
			<div class="menu">
				<div class="menu__section" v-for="section in sections" :key="section.title">
					<h2 class="menu__section-title">
						{{ section.title }}
					</h2>
					<div class="menu__links">
						<router-link
							class="menu__link"
							active-class="menu__link--active"
							:to="subsection.to"
							:key="subsection.to"
							v-for="subsection in section.subsections"
						>
							{{ subsection.text }}
						</router-link>
					</div>
				</div>
			</div>
			<div class="content">

			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import "../../styles/constants";
@import "../../styles/grid";
.docs {
	.header {
		background: url("../../assets/home/background.png");
		background-size: auto 100%;
		background-color: $vue-color;
		background-size: cover;
		height: $header-height
	}
	.body {
		display: flex;
		@include container();
	}
	.menu {
		width: 171px;
		text-align: right;

		&__section-title {
			margin-bottom: 16px;
		}
		&__link {
			display: block;
			padding: 12px;
			margin-right: -12px;
			color: black;
			transition: color 0.5s, background 0.5s;
			&:hover {
				color: $vue-color;
			}
			&--active {
				background: #f0f9f5;
				color: black;
			}
		}
	}
}


</style>

<script>
export default {
	name: 'Docs',
	data() {
		return {
			sections: [
				{
					title: 'Introduction',
					subsections: [
						{
							to: '/docs/intro',
							text: 'Getting started'
						},
						{
							to: '/docs/concepts',
							text: 'Concepts'
						},
						{
							to: '/docs/algorithm',
							text: 'Algorithms'
						},
					]
				},
				{
					title: 'Tutorials',
					subsections: [
						{
							to: '/docs/tutorials/how-to-use',
							text: 'How to use'
						},
						{
							to: '/docs/tutorials/manipulating-result',
							text: 'Manipulating result'
						},
						{
							to: '/docs/tutorials/customize-stencil',
							text: 'Customize stencil'
						},
						{
							to: '/docs/tutorials/create-own-stencil',
							text: 'Create own stencil'
						},
					]
				},
			]
		}
	}
};
</script>
