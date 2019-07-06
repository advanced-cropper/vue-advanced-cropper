module.exports = {
    title: 'Advanced Cropper',
		description: "The documentation for Vue Advanced Cropper library",
		base: '/vue-advanced-cropper/',
    head: [
			['link', { rel: 'icon', href: '/favicon.png' }],
		],
    themeConfig:{
				search: false,
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
								'/introduction/getting-started',
								'/introduction/concepts',
              ]
            },
            {
              title: 'Tutorials',
              collapsable: false,
              children: [
                  '/tutorials/recipes',
                  '/tutorials/customize-appearance',
                  '/tutorials/custom-stencil',
              ]
						},
            {
              title: 'Events',
              collapsable: false,
              children: [
								'/events/move-event',
								'/events/resize-event',
                '/events/drag-event',
              ]
						},
            {
              title: 'Components',
              collapsable: false,
              children: [
                  '/components/cropper',
                  '/components/rectangle-stencil',
                  '/components/circle-stencil',
                  '/components/bounding-box',
              ]
						},
            // {
            //   title: 'Playground',
            //   collapsable: true,
            //   children: [
            //       '/playground/playground',
            //   ]
						// },

          ]
    }
}
