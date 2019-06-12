module.exports = {
    title: 'Advanced Cropper',
    description: "The documentation for Vue Advanced Cropper library",
    themeConfig:{
				search: false,
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Docs', link: '/guide/' },
        ],
        sidebar: [
            {
              title: 'Counter',
              collapsable: false,
              children: [
                '/counter/counter-app'
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
