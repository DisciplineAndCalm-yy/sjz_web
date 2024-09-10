module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 96, // 设计稿元素尺寸/rootvalue，比如元素宽320px，最终页面会换算成20rem
      propList: ["*"], // 将被转换的属性列表，这里设置为['*']全部
      unitPrecision: 5, // 保留rem小数点多少位
      replace: true, // 是否替换原始px值
      mediaQuery: false, // 媒体查询中不生效
      minPixelValue: 12, // 小于12px的不会被转换
      // exclude: /^(?!.*\/src\/views\/businessScreen).*$/i,
      exclude: (file) => {
        if (/\/src\/views\/businessScreen\//i.test(file)) {
          return false 
        } else {
          return true
        }
      },
    },
  },
};
