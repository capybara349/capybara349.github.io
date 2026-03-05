import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base:"/",
  dest: "./dist",

  lang: "zh-CN",
  title: "Capybara349",
  description: "Capybara349 程序员学习记录",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
