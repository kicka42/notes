import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Notes",
  description: "Digital Garden",
  base: '/notes/',
  cleanUrls: true, // Enables clean URLs by removing the .html extension
  themeConfig: {
      search: {
        provider: 'local'
      },
    /*
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
     */

    sidebar: [
      {
        items: [
          {
            text: 'Travel',
            link: '/travel/', // Link for the "Travel" main page
            collapsible: true,
            items: [
              {
                text: 'Countries',
                link: '/travel/countries/', // Link for the "Countries" main page
                collapsible: true,
                items: [
                  { text: 'Italy', link: '/travel/countries/italy' },
                  { text: 'Poland', link: '/travel/countries/poland' }
                ]
              },
              {
                text: 'Events',
                link: '/travel/events', // Link for the "Events" main page
                collapsible: true,
                items: [
                  { text: 'Markdown Examples', link: '/travel/events/markdown-examples' },
                  { text: 'Runtime API Examples', link: '/travel/events/api-examples' }
                ]
              }
            ]
          }
        ]
      }
    ],

    /*socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
     */
  }
})
