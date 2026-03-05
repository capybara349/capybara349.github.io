import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";

export default hopeTheme({
    hostname: "https://capybara349.github.io/",

    logo: "/small-black.png",

    author: {
        name: "capybara349",
        url: "https://capybara349.github.io/",
    },

    repo: "https://github.com/capybara349/capybara349.github.io",
    docsDir: "docs",
    pure: true,
    focus: false,
    breadcrumb: false,
    // 导航栏
    navbar,
    // 侧边栏
    sidebar,
    // 页脚
    footer: "默认页脚",
    displayFooter: true,

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    markdown: {
        align: true,
        attrs: true,
        codeTabs: true,
        component: true,
        demo: true,
        figure: true,
        gfm: true,
        imgLazyload: true,
        imgSize: true,
        include: true,
        mark: true,
        plantuml: true,
        spoiler: true,
        stylize: [
            {
                matcher: "Recommended",
                replacer: ({tag}) => {
                    if (tag === "em") {
                        return {
                            tag: "Badge",
                            attrs: {type: "tip"},
                            content: "Recommended",
                        };
                    }
                },
            },
        ],
        sub: true,
        sup: true,
        tabs: true,
        tasklist: true,
        vPre: true,
    },

    // 在这里配置主题提供的插件
    plugins: {
        // 注意: 仅用于测试! 你必须自行生成并在生产环境中使用自己的评论服务
        comment: {
            provider: "Giscus",
            repo: "vuepress-theme-hope/giscus-discussions",
            repoId: "R_kgDOG_Pt2A",
            category: "Announcements",
            categoryId: "DIC_kwDOG_Pt2M4COD69",
        },

        components: {
            components: ["Badge", "VPCard"],
        },

        icon: {
            assets: "//at.alicdn.com/t/c/font_2922463_o9q9dxmps9.css",
        },

    },
});
