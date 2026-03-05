/**
 * 统一管理侧边栏使用的常用图标
 */
export const ICONS = {
    // 基础图标
    STAR: "star",
    BASIC: "basic",
    CODE: "code",
    DESIGN: "design",

    // 技术领域
    JAVA: "java",
    DATABASE: "database",

    // 工具
    TOOL: "tool",

    // 类库
    LIBRARY: "codelibrary-fill",
} as const;
/**
 * 文本常量
 */
export const COMMON_SYNOPSIS = {
    IMPORTANT_CONTEXT: "重要内容",
    SOURCE_DEBUG_ANALYSIS: "源码调试与分析",
} as const;

/**
 * vuepress-theme-hope 将侧边栏的类型导出为 SidebarOptions，同时，提供了一个 sidebar 帮助函数。
 * 辅助函数解决将 多侧边栏配置 拆分成多个部分的情景
 */

/**
 * 辅助函数：创建重要内容分组
 */
export const createImportContextSection = (children: any[]) => ({
    text: COMMON_SYNOPSIS.IMPORTANT_CONTEXT,
    icon: ICONS.STAR,
    collapsible: true,
    children,
});

/**
 * 辅助函数：创建源码调试与分析分组
 */
export const createsSourceDebugAnalysisSection = (children: any[]) => ({
    text: COMMON_SYNOPSIS.SOURCE_DEBUG_ANALYSIS,
    icon: ICONS.STAR,
    collapsible: true,
    children,
})
