import {sidebar} from "vuepress-theme-hope";

import {
    ICONS,
    createImportContextSection,
    createsSourceDebugAnalysisSection,
} from "./constants.js";
import {openSourceProject} from "./open-source-project.js";

export default sidebar({
    // 将更精确的路径放在前面，因为 VuePress 会遍历侧边栏配置的键名来寻找匹配的配置。
    "/open-source-project/": openSourceProject,
    // 回退侧边栏必须最后定义。
    "/":[{
        text: "Java",
        collapsible: true,
        icon: ICONS.JAVA,
        prefix: "java/",
        children: [
            {
                text: "基础",
                icon: ICONS.BASIC,
                prefix: "bases/",
                children: [
                    "java-bases",
                    createImportContextSection([
                        "java-value",
                    ]),
                ],
            },
            {
                text: "集合",
                icon: ICONS.BASIC,
                prefix: "collection/",
                children: [
                    "java-list",
                    createsSourceDebugAnalysisSection([
                        "arraylist-debug-analysis",
                    ]),
                ],
            },
            {
                text: "JVM",
                icon: ICONS.BASIC,
                prefix: "jvm/",
                children: [
                    "java-jvm-common-parameters",
                ],
            },
        ]
    }]
});
