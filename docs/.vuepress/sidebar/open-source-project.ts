import {arraySidebar} from "vuepress-theme-hope"
import {ICONS} from "./constants.js";


export const openSourceProject=arraySidebar([
    {
        text: "工具类库",
        link: "tool-library",
        icon: ICONS.LIBRARY,
    },
    {
        text: "开源实战项目",
        link: "practical-project",
        icon: ICONS.TOOL,
    }
]);