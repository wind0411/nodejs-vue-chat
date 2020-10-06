module.exports = {
  pages: {
    index: {
      // 最初に実行されるファイル名
      entry: 'src/main.ts',
      // テンプレートファイル
      template: 'public/index.html',
      // 出力ファイル名
      filename: 'index.html',
      // タイトル
      // <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Vue-Chat Demo Site',
      // チャンク
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  transpileDependencies: ['vuetify', 'vuex-module-decorators'],
  productionSourceMap: false,
}