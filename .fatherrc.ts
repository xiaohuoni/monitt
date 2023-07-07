export default {
  cjs: {},
  esm: {},
  umd: {
    name: 'monitt',
    entry: 'src/browser.ts',
    chainWebpack: (memo) => {
      memo.output.libraryExport('default');
      return memo;
    },
  },
};
