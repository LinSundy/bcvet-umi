export default {
  plugins: ['umi-plugin-dva',
    ['umi-plugin-routes', {
      exclude: [
        /model.js/,
        /service.js/,
        /components/,
      ],
    }]
  ],
  pages: {
    "/": { document: "./public/web.ejs" },
    "/wx": { document: "./public/wx.ejs" }
  }
}
