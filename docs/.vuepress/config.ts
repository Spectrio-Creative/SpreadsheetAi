import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";
// import { containerPlugin } from '@vuepress/plugin-container'

const base = process.env.NODE_ENV === "production" ? "/creative/tools/sorcerers-apprentice/" : "/";

module.exports = {
  title: "Spreadsheet Ai (the docs)",
  // description: "For templating projects like telling brooms to fill buckets",
  base,
  head: [["link", { rel: "icon", href: `${base}favicon.ico` }]],
  theme: defaultTheme({
    home: "/",
    navbar: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/docs/" },
      { text: "Releases", link: "https://github.com/Spectrio-Creative/SpreadsheetAi/releases" },
    ],
    sidebarDepth: 1,
    sidebar: {
      "/": [
        "/README.md",
        {
          text: "Docs", // required
          // link: "/docs/", // optional
          children: ["/docs/README.md", "/docs/text/README.md"],
        },
        {
          text: "Downloads",
          link: "https://github.com/Spectrio-Creative/sorcerers-apprentice/releases",
        }
      ],
    },
  }),
  plugins: [
    '@vuepress/last-updated',
    searchPlugin({
      // options
    }),
    // containerPlugin({
    //   // options
    //   // before: (info) => `<div class="custom-container ${type}">${info ? `<p class="custom-container-title">${info}</p>` : ''}\n`,
    //   // before: (info) => `<div class="custom-container ${type}">\n`,
    //   // after: "</div>\n",
    //   // validate: (params) => true,

    //   // render: false,
    // }),
  ],
};
