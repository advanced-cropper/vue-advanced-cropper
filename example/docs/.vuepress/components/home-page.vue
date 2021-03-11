<template>
	<div class="home-page">
		<div class="navigation">
			<div class="navigation__frameworks">
				<a class="navigation__link navigation__link--active" href="/"> Vue </a>
				<span class="navigation__link navigation__link--blocked" href="/">
					React
					<span class="tooltip"> I plan to port this library after the end of beta testing Vue library </span>
				</span>
			</div>
			<div class="navigation__sections">
				<a class="navigation__link navigation__link--active" href="/#"> Home </a>
				<a class="navigation__link" href="/vue-advanced-cropper/introduction/getting-started.html"> Docs </a>
				<a class="navigation__link" href="http://github.com/Norserium/vue-advanced-cropper/" target="_blank">
					Github
				</a>
			</div>
		</div>
		<div class="presentation">
			<div class="container container--centered">
				<img class="presentation__logo" src="../assets/home/logo.svg" />
				<div class="presentation__title-wrapper">
					<h1 class="presentation__title">Advanced Cropper</h1>
				</div>
				<div class="presentation__subtitle">
					The flexible Vue cropper component that gives you the opportunity to create almost any cropper that
					you desire. Identically easy to use and customize.
				</div>

				<div class="presentation__install">
					{{
						manager === 'npm'
							? 'npm install -S vue-advanced-cropper'
							: 'yarn add vue-advanced-cropper'
					}}
					<div class="presentation__package-managers">
						<span
							:class="`presentation__package-manager ${
								manager === 'yarn' ? 'presentation__package-manager--active' : ''
							}`"
							@click="manager = 'yarn'"
						>
							yarn
						</span>
						/
						<span
							:class="`presentation__package-manager ${
								manager === 'npm' ? 'presentation__package-manager--active' : ''
							}`"
							@click="manager = 'npm'"
						>
							npm
						</span>
					</div>
				</div>
			</div>
			<div class="presentation__border">
				<img src="../assets/home/presentation-bottom-border.svg" alt="" />
			</div>
		</div>

		<div class="demo-section">
			<div class="container container--centered">
				<cropper
					:src="require('../assets/home/photo.jpeg')"
					class="demo-cropper"
					image-class="demo-cropper__image"
					:min-width="20"
					:min-height="20"
					:stencil-props="{
						maxAspectRatio: 16 / 9,
						minAspectRatio: 9 / 16,
						linesClasses: {
							default: 'demo-cropper__line',
							hover: 'demo-cropper__line--hover',
						},
						handlersClasses: {
							default: 'demo-cropper__handler',
							hover: 'demo-cropper__handler--hover',
						},
					}"
					default-boundaries="fit"
				/>
			</div>
			<div class="section-border section-border--hide-mobile">
				<img src="../assets/home/gray-bottom-border.svg" />
			</div>
		</div>

		<div class="feature-section">
			<div class="container container--narrow">
				<h1 class="title">Features</h1>
				<div class="row">
					<div class="feature">
						<div class="feature__title">Fully Customisable</div>
						<div class="feature__text">
							Customise almost any aspect of the cropper component, or use it right out of the box.
						</div>
					</div>
					<div class="feature">
						<div class="feature__title">Mobile Support</div>
						<div class="feature__text">
							Vue Advanced Cropper supports desktop and mobile devices alike. Built in support for touch
							events, cropper resizing, etc.
						</div>
					</div>
				</div>
				<div class="row">
					<div class="feature">
						<div class="feature__title">Canvas / Coordinates</div>
						<div class="feature__text">
							This Cropper can be used to create a canvas with a cropped area or just coordinates relative
							to the original image to crop it server-side in the future.
						</div>
					</div>
					<div class="feature">
						<div class="feature__title">Advanced Features</div>
						<div class="feature__text">
							Set minimum and maximum aspect ratios, customizie minimum and maximum height and width, etc.
						</div>
					</div>
				</div>
			</div>
			<div class="section-border">
				<img src="../assets/home/white-bottom-border.svg" alt="" />
			</div>
		</div>

		<div class="concept-section">
			<div class="container container--narrow">
				<h1 class="title">Minimum Example</h1>
				<div class="row">
					<p>
						After you
						<a href="/vue-advanced-cropper/introduction/getting-started.html#package-installation"
							>have installed</a
						>
						the cropper, it's very easy to integrate it in your website. The minimum working example of the
						cropper is presented below.
					</p>
				</div>
				<div>
					<Content slot-key="minimum-example" />
				</div>
			</div>
			<div class="container container--narrow">
				<h1 class="title">Concepts</h1>
				<div class="row">
					<p>
						The goal of this library to give developers an opportunity create any cropper component easily
						and effortless. To achieve this goal, the cropper is divided into two main parts: the broadly
						customizable <b>cropper</b> and the arbitrary component <b>stencil</b>.
					</p>
				</div>

				<h2 class="subtitle">What is the cropper?</h2>

				<div class="row">
					<div class="col">
						<div class="example-cropper">
							<img :src="require('../assets/home/example-cropper.svg')" />
						</div>
					</div>
					<div class="col">
						<p>
							<b>Cropper</b>
							is the root component of this library. It contains the coordinates of the currently cropped
							area (left, top, width, height) relative to the original image coordinates. These
							coordinates can be imagined like a box. That's responsible for:
						</p>
						<ul>
							<li>resizing and moving the box</li>
							<li>displaying the cropped image and fitting it to the container</li>
							<li>setting default coordinates</li>
							<li>cropping canvas area</li>
						</ul>
					</div>
				</div>

				<h2 class="subtitle">What is the stencil?</h2>

				<div class="row">
					<p>
						The Cropper operates the abstract box that represents the currently cropped area, but it only
						abstracts a couple of coordinates. Visualizing the cropped area and giving the user the ability
						to interact with the cropper is what the <b>stencil</b> component is used for.
					</p>
				</div>

				<div class="shift" />

				<div class="row">
					<div class="col">
						<div class="example-stencil">
							<img :src="require('../assets/home/example-stencil.svg')" />
						</div>
					</div>
					<div class="col">
						<p>
							The Stencil can literally be any arbitrary component, but in order for it to make sense
							there are some requirements:
						</p>
						<ul>
							<li>
								it should be inscibed to box is represented by coordinates (<b>width</b>, <b>height</b>,
								<b>left</b>, <b>top</b>)
							</li>
							<li>
								if the stencil has aspect ratios it should have an <b>aspectRatios</b> method to inform
								the cropper resize algorithm (this method should return an object with minimum and
								maximum aspect ratio values)
							</li>
							<li>it should emit <b>resize</b> and <b>move</b> events</li>
							<li>it should display the cropped part of a image</li>
						</ul>
					</div>
				</div>

				<div class="row">
					<p>
						Resize and move events are very flexible and allow you to create almost any moving and
						especially resizng logic (more details
						<a class="link" href="/vue-advanced-cropper/events/move-event.html">here</a>)
					</p>
				</div>

				<div class="row">
					<div class="col">
						<div class="example-event">
							<img :src="require('../assets/home/resize-event.svg')" />
						</div>
					</div>
					<div class="col">
						<div class="example-event">
							<img :src="require('../assets/home/move-event.svg')" />
						</div>
					</div>
				</div>

				<div class="row">
					<p>
						The typical stencil components are represented below. They include handlers that emit resize
						events, a movable area that emits move events, and a cropped image preview.
					</p>
				</div>

				<div class="row">
					<div class="example-stencil-elements">
						<img :src="require('../assets/home/example-stencil-elements.svg')" />
					</div>
				</div>

				<div class="row">
					<p>
						There are default customizable components out of the box that allow you to create your first
						cropper component within five minutes.
					</p>
				</div>

				<div>
					<Content slot-key="custom-stencil" />
				</div>

				<div class="row">
					<p>
						That’s pretty much all you need to know to get started. Below there are a couple different
						stencil examples to show what you can create.
					</p>
				</div>

				<div class="row">
					<div class="col">
						<ExampleWrapper>
							<CircleExample />
						</ExampleWrapper>
					</div>
					<div class="col">
						<ExampleWrapper>
							<CommonExample />
						</ExampleWrapper>
					</div>
				</div>
			</div>
		</div>
		<div class="footer">
			<div class="footer__center-block">
				<img class="footer__logo" :src="require('../assets/footer/logo.svg')" />
				<div class="footer__contacts">
					<div class="footer__name">Norserium</div>
					<a href="mailto:norserium@gmail.com" class="footer__email" rel="nofollow"> norserium@gmail.com </a>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import '../styles/constants';
@import '../styles/grid';
@import '../styles/fonts';
@import '../styles/normalize';

.home-page {
	position: relative;

	.navigation {
		position: absolute;
		width: 100%;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		display: flex;
		height: 77px;
		align-items: center;
		z-index: 1;
		padding: 0.7rem 1.5rem;

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

			&--blocked {
				cursor: not-allowed;
				position: relative;

				.tooltip {
					left: 50%;
					transform: translateX(-50%);
				}
			}

			&:hover,
			&:focus {
				.tooltip {
					opacity: 1;
				}
			}

			&:not(:last-child) {
				margin-right: 20px;
			}
		}
	}

	.presentation {
		background: url('../assets/home/background.png');
		background-size: auto 100%;
		background-color: $vue-color;
		background-size: cover;
		padding-top: 85px;
		padding-bottom: 0;
		color: white;
		position: relative;
		transition: padding 0.5s;

		@media (max-width: $screen-sm) {
			padding-top: 110px;
		}

		&:before {
			content: '';
			height: 100px;
			width: 100%;
			background: linear-gradient(180deg, rgba(54, 170, 118, 0) 0%, rgba(54, 170, 118, 1) 100%);
			bottom: 0;
			position: absolute;
		}

		&__package-managers {
			display: block;
			position: absolute;
			top: 3px;
			right: 25px;
			color: white;
			opacity: 0.25;
		}

		&__package-manager {
			font-size: 12px;
			cursor: pointer;

			&--active {
				font-weight: bold;
			}
		}

		&__github {
			display: flex;
			align-items: center;
		}

		&__install {
			background: #117448;
			padding: 25px;
			padding-left: 35px;
			box-shadow: inset 3px 3px 7px rgba(black, 0.1);
			position: relative;
			margin-top: 30px;
			margin-bottom: 30px;
			font-size: 15px;
			transition: margin 0.5s;

			&:before {
				content: '$';
				opacity: 0.5;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: 20px;
			}

			@media (max-width: $screen-sm) {
				margin-bottom: 50px;
			}
		}

		&__logo {
			min-height: 135px;
		}

		&__title {
			font-size: 44px;
			font-family: ArBerkley;
			position: relative;
			display: inline-block;
			margin-bottom: 27px;
			margin-top: 10px;
			font-weight: normal;
		}

		&__version {
			position: absolute;
			font-family: Open Sans;
			font-size: 10px;
			right: 22px;
			bottom: -2px;
		}

		&__subtitle {
			max-width: 467px;
			font-weight: lighter;
			font-size: 18px;
			line-height: 32px;
		}

		&__buttons {
			display: flex;
			justify-content: space-between;
			margin-top: 25px;
			margin-bottom: 0px;
			@media (max-width: $screen-xs) {
				width: 100%;
				display: block;
				padding-left: 30px;
				padding-right: 30px;
			}
		}

		&__button {
			width: 100%;
			text-decoration: none;
			margin-bottom: 20px;
			display: inline-block;

			&:not(:last-child) {
				margin-right: 25px;
			}

			@media (max-width: $screen-xs) {
				margin-right: 0;
			}
		}

		&__border {
			overflow: hidden;
			width: 100%;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			height: 94px;
			z-index: 1;
			display: flex;
			justify-content: center;
			transition: transform 0.5s;
			transform-origin: center top;
			@media (max-width: $screen-xs) {
				transform: translate(-50%) scaleY(0);
			}
		}
	}

	.demo-section {
		position: relative;
		background: url('../assets/home/demo-background.png');
		background-size: auto 100%;
		background-color: #0d0d0d;
		width: 100%;
		padding-top: 125px;
		padding-bottom: 125px;
		transition: padding 0.5s, border 0.5s;
		@media (max-width: $screen-xs) {
			transition: padding 0.5s, border 0.5s 0.1s;
			padding-top: 5%;
			padding-bottom: 5%;
		}
	}

	.demo-cropper {
		width: 100%;
		max-height: 400px;

		&__line {
			border-style: dashed;
			border-color: $vue-color;

			&--hover {
				border-color: #36cc89;
			}
		}

		&__handler {
			background: #36cc89;
			border: solid 1px $vue-color;
		}
	}

	.section-border {
		overflow: hidden;
		width: 100%;
		position: absolute;
		left: 50%;
		top: 100%;
		transform: translate(-50%, -100%);
		height: 51px;
		z-index: 1;
		display: flex;
		justify-content: center;
		transform-origin: center top;
		transition: transform 0.5s;

		&--hide-mobile {
			@media (max-width: $screen-xs) {
				transform: translateX(-50%) scaleY(0);
			}
		}
	}

	.feature-section {
		background: #f9f9f9;
		text-align: center;
		position: relative;
		padding-bottom: 50px;
	}

	.concept-section {
		text-align: center;
	}

	.row {
		display: flex;
		text-align: left;
		flex-wrap: wrap;
	}

	.col {
		width: 50%;

		&:not(:first-child) {
			padding-left: 25px;
		}

		&:not(:last-child) {
			padding-right: 25px;
		}

		@media (max-width: $screen-sm) {
			width: 100%;
			& + .col {
				margin-top: 30px;
			}
			&,
			&:not(:first-child),
			&:not(:last-child) {
				padding: 0px;
			}
		}
	}

	.example-cropper {
		margin-top: -15px;
		text-align: center;
	}

	.example-stencil {
		margin-top: -15px;
		text-align: center;
	}

	.example-event {
		text-align: center;
	}

	.example-stencil-elements {
		text-align: center;
		width: 100%;

		img {
			max-width: 100%;
		}
	}

	.link {
		color: $vue-color;
		text-decoration: underline;
		cursor: pointer;
	}

	p {
		line-height: 32px;
	}

	p + ul {
		margin-top: -1em;
	}

	ul {
		padding-left: 15px;
		line-height: 32px;
		font-weight: lighter;

		li {
			list-style: none;
			position: relative;

			&:before {
				content: '–';
				position: absolute;
				left: -15px;
			}
		}
	}

	.container {
		@include container();
		height: 100%;

		&--narrow {
			max-width: 780px;
			margin: 0 auto;
		}

		&--centered {
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			z-index: 2;
			position: relative;
		}
	}

	.feature {
		font-weight: lighter;
		text-align: left;
		width: 50%;
		padding-left: 37px;
		padding-right: 37px;
		margin-top: 35px;
		margin-bottom: 35px;

		&:last-child {
			padding-right: 0;
		}

		&:first-child {
			padding-left: 0;
		}

		&__title {
			font-size: 30px;
			line-height: 32px;
			margin-bottom: 15px;
		}

		&__text {
			font-size: 16px;
			line-height: 32px;
		}

		@media (max-width: $screen-sm) {
			width: 100%;
			padding-left: 0;
			padding-right: 0;
			margin-bottom: 50px;
			text-align: center;
		}
	}

	.shift {
		margin-top: 20px;
	}

	.title {
		font-size: 45px;
		font-family: ArBerkley;
		color: $gray-color;
		position: relative;
		display: inline-block;
		margin-bottom: 40px;
		margin-top: 40px;
		font-weight: normal;
		border-bottom: none;

		&:after {
			content: '';
			position: absolute;
			width: calc(100% + 20px);
			bottom: -15px;
			background: $vue-color;
			left: 50%;
			height: 2px;
			transform: translateX(-50%);
			font-family: normal;
		}
	}

	.subtitle {
		font-size: 30px;
		color: #8f8f8f;
		font-weight: 600;
		border-bottom: none;
	}

	.footer {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		height: $footer-height;
		margin-top: $footer-margin;

		&:after {
			content: url('../assets/footer/background.svg');
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}

		&__logo {
			margin-right: 19px;
		}

		&__center-block {
			display: flex;
			align-items: center;
			margin-top: 30px;
			z-index: 1;
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

	.tooltip {
		display: block;
		font-size: 13px;
		width: 140px;
		text-align: center;
		background: rgba(black, 0.7);
		position: absolute;
		transform: translate3d(5px, 54px, 0px);
		top: 30px;
		will-change: transform;
		margin-top: 5px;
		color: #fff;
		padding: 6px 10px;
		border-radius: 3px;
		z-index: 100;
		box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition: opacity 0.5s 0.25s;

		&:after {
			content: '';
			width: 0;
			height: 0;
			border-style: solid;
			position: absolute;
			margin: 5px;
			border-width: 0 5px 5px 5px;
			border-bottom-color: rgba(#000, 0.7);
			border-top-color: transparent;
			border-left-color: transparent;
			border-right-color: transparent;
			top: -4px;
			margin-top: 0;
			margin-bottom: 0;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}
</style>

<script>
import { Cropper } from 'vue-advanced-cropper';
import CircleExample from './Home/Examples/CircleExample/Example.vue';
import CommonExample from './Home/Examples/CommonExample/Example.vue';
import ExampleWrapper from './Home/ExampleWrapper.vue';
import HomeButton from './Home/HomeButton';

export default {
	name: 'Home',
	components: {
		HomeButton,
		ExampleWrapper,
		Cropper,
		CommonExample,
		CircleExample,
	},
	data() {
		return {
			manager: 'npm',
		};
	},
};
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
