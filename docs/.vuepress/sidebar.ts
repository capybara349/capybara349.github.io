import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "Java",
      icon: "laptop-code",
      collapsible: true,
      prefix: "java/",
      children: [{
        text: "基础",
        icon: "book",
        prefix: "base/",
        children:[
          "java-bases",
          "java-value",
        ],
      }],
    },
  ],
});
