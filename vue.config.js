module.exports = {
  devServer: {
    proxy: 'https://biz.nanhuacapital.com/t_xqk/'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/t_xqk/' : '/'
}