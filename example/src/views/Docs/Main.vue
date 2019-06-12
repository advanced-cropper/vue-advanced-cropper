<template>
  <div class="docs">
    <div class="header"></div>
    <div class="body">
      <div class="menu-wrapper">
        <MenuButton :open="openedMenu" @click="toggleMenu"/>
        <div :class="`menu ${openedMenu ? 'menu--open' : ''}`">
          <div class="menu__section" v-for="section in sections" :key="section.title">
            <h2 class="menu__section-title">{{ section.title }}</h2>
            <div class="menu__links">
              <router-link
                class="menu__link"
                active-class="menu__link--active"
                :to="subsection.to"
                :key="subsection.to"
                v-for="subsection in section.subsections"
              >{{ subsection.text }}</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
		  <router-view></router-view>
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
    height: $header-height;
  }
  .body {
	display: flex;
	position: relative;
    @include container();
  }
  .content {
	  @media (max-width: $screen-sm) {
	  	padding-left: 80px;
	  }
  }

  .menu {
    width: 155px;
	text-align: right;
	margin-right: 24px;

	@media (max-width: $screen-sm) {
		display: none;
		&--open {
			z-index: 500;
			display: block;
			position: absolute;
			width: 100%;
			left: 0;
			text-align: center;
			background: white;
		}

	}

    &__section-title {
      margin-bottom: 16px;
    }
    &__link {
      display: block;
      padding: 12px;
      margin-right: -12px;
      color: black;
	  transition: color 0.5s, background 0.5s;
	  width: 100%;
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
import MenuButton from './Components/MenuButton';

export default {
	name: 'Docs',
	components: {
		MenuButton
	},
	methods: {
		toggleMenu() {
			this.openedMenu = !this.openedMenu;
		}
	},
	watch:{
		$route (to, from){
			this.openedMenu = false;
		}
	},
	data() {
		return {
			openedMenu: false,
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
						}
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
							text: 'Lifecycle'
						},
						{
							to: '/docs/tutorials/customize-stencil',
							text: 'Customize stencil'
						},
						{
							to: '/docs/tutorials/create-own-stencil',
							text: 'Create your own stencil'
						}
					]
				},
				{
					title: 'Components',
					subsections: [
						{
							to: '/docs/tutorials/components/cropper',
							text: 'Cropper'
						},
						{
							to: '/docs/tutorials/components/rectangle-stencil',
							text: 'RectangleStencil'
						},
						{
							to: '/docs/tutorials/components/round-stencil',
							text: 'RoundStencil'
						},
						{
							to: '/docs/tutorials/components/preview-image',
							text: 'PreviewImage'
						},
						{
							to: '/docs/tutorials/components/bounding-box',
							text: 'BoundingBox'
						},
						{
							to: '/docs/tutorials/components/simple-line',
							text: 'SimpleLine'
						},
						{
							to: '/docs/tutorials/components/simple-handler',
							text: 'SimpleHandler'
						},
						{
							to: '/docs/tutorials/components/draggable-area',
							text: 'DraggableArea'
						},
						{
							to: '/docs/tutorials/components/draggable-element',
							text: 'DraggableElement'
						},
						{
							to: '/docs/tutorials/components/handler-wrapper',
							text: 'HandlerWrapper'
						},
						{
							to: '/docs/tutorials/components/line-wrapper',
							text: 'LineWrapper'
						}
					]
				}
			]
		};
	}
};
</script>
