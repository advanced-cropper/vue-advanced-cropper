module.exports = {
    title: 'Advanced Cropper',
    description: "The documentation for Vue Advanced Cropper library",
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
              ]
            },
            {
              title: 'API Guide',
              collapsable: false,
              children: [
                  '/guide/guide',
                  '/guide/api'
              ]
            }
          ]
    }
}
