module.exports = {
	title: 'Vue Advanced Cropper',
	description:
		'The flexible vue cropper component that gives you the opportunity to create almost any cropper that you desire',
	base: '/vue-advanced-cropper/',
	head: [['link', { rel: 'icon', href: '/favicon.png' }]],
	themeConfig: {
		repo: 'Norserium/vue-advanced-cropper',
		docsDir: 'example/docs',
		editLinks: true,
		search: true,
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Docs', link: '/introduction/getting-started.html' },
			{ text: 'Github', link: 'http://github.com/Norserium/vue-advanced-cropper/' },
		],
		sidebar: [
			{
				title: 'Introduction',
				collapsable: false,
				children: [
					'/introduction/migration',
					'/introduction/getting-started',
					'/introduction/types',
					'/introduction/concepts',
				],
			},
			{
				title: 'Guides',
				collapsable: false,
				children: [
					'/guides/recipes',
					'/guides/advanced-recipes',
					'/guides/theming',
					'/guides/customize-appearance',
					'/guides/advanced-stencil',
					'/guides/showcase',
					'/guides/cross-origin',
				],
			},
			{
				title: 'Events',
				collapsable: false,
				children: ['/events/move-event', '/events/resize-event', '/events/drag-event'],
			},
			{
				title: 'Components',
				collapsable: false,
				children: [
					'/components/cropper',
					'/components/rectangle-stencil',
					'/components/circle-stencil',
					'/components/preview',
					'/components/bounding-box',
				],
			},
			{
				title: 'Algorithms',
				collapsable: true,
				children: ['/algorithms/resize', '/algorithms/init-stretcher', '/algorithms/default-boundaries'],
			},
		],
	},
	plugins: [
		[
			'vuepress-plugin-typescript',
			{
				tsLoaderOptions: {
					transpileOnly: true,
				},
			},
		],
	],
};
