module.exports = {
	title: 'Vue Advanced Cropper',
	description: 'The flexible vue cropper component that gives you the opportunity to create almost any cropper that you desire',
	base: '/vue-advanced-cropper/',
	head: [
		['link', { rel: 'icon', href: '/favicon.png', }]
	],
	themeConfig:{
		repo: 'Norserium/vue-advanced-cropper',
		docsDir: 'example/docs',
		editLinks: true,
		search: false,
		nav: [
			{ text: 'Home', link: '/', },
			{ text: 'Docs', link: '/introduction/getting-started.html', },
			{ text: 'Github', link: 'http://github.com/Norserium/vue-advanced-cropper/', }
		],
		sidebar: [
			{
				title: 'Introduction',
				collapsable: false,
				children: [
					'/introduction/getting-started',
					'/introduction/concepts',
					'/introduction/under-the-hood',
				],
			},
			{
				title: 'Tutorials',
				collapsable: false,
				children: [
					'/tutorials/recipes',
					'/tutorials/advanced-recipes',
					'/tutorials/customize-appearance',
					'/tutorials/custom-stencil',
					'/tutorials/showcase'
				],
			},
			{
				title: 'Events',
				collapsable: false,
				children: [
					'/events/move-event',
					'/events/resize-event',
					'/events/drag-event'
				],
			},
			{
				title: 'Components',
				collapsable: false,
				children: [
					'/components/cropper',
					'/components/rectangle-stencil',
					'/components/circle-stencil',
					'/components/bounding-box'
				],
			}
		],
	},
};
