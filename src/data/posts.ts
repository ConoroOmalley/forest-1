export type PostCardType = 'text' | 'image'

export interface BlogPost {
  id: string
  title: string
  date: string
  dateLabel: string
  excerpt: string
  content: string
  cardType: PostCardType
  coverImage?: string
  thumbnail: string
  thumbnailBg: string
  readCount?: number
}

export interface BlogConfig {
  label: string
  description: string
  avatar: string
  totalReads: string
}

export const blogConfig: BlogConfig = {
  label: 'UX · 交互设计',
  description:
    '专注交互设计与用户体验，记录用研方法、原型实践与产品思考。好的设计藏在细节里，让每一次点击都清晰、可信、有温度。',
  avatar: '/images/avatar.png',
  totalReads: '2.4万',
}

const paintings = {
  monaLisa: '/images/mona-lisa.jpg',
  pearlEarring: '/images/pearl-earring.jpg',
  birthOfVenus: '/images/birth-of-venus.svg',
  wanderer: '/images/wanderer.jpg',
  schoolOfAthens: '/images/school-of-athens.jpg',
}

export const posts: BlogPost[] = [
  {
    id: '1',
    title: '用户体验五要素 | 从战略到表现层的系统设计',
    date: '2026-06-01',
    dateLabel: '今天',
    excerpt: '用 Jesse James Garrett 的五层模型拆解产品，避免只改 UI 不治本。',
    cardType: 'image',
    coverImage: paintings.monaLisa,
    content: `## 为什么需要分层思考

很多产品问题表面是界面不好看，根因往往在战略或范围层。五要素模型帮助团队对齐：我们在解决谁的什么问题，以及界面如何服务这个目标。

## 五层概览

1. **战略层** — 用户需求与产品目标
2. **范围层** — 功能规格与内容需求
3. **结构层** — 交互设计与信息架构
4. **框架层** — 界面设计、导航与布局
5. **表现层** — 视觉设计、色彩与排版

## 实践建议

- 改版前先确认战略层是否变化
- 用用户故事连接范围层与结构层
- 表现层最后做，但需反馈到上层验证

> 体验设计不是美化，而是让正确的事情以正确的方式发生。`,
    thumbnail: '🎯',
    thumbnailBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: '2',
    title: '2026 UX 设计师书单与阅读笔记',
    date: '2026-05-28',
    dateLabel: '05/28',
    excerpt: '从认知心理到服务设计，整理今年反复翻阅的几本经典。',
    cardType: 'text',
    content: `## 基础必读

- 《设计心理学》— 唐纳德·诺曼：affordance 与反馈的源头
- 《点石成金》— Steve Krug：可用性第一原则
- 《About Face》— 交互设计流程与模式库

## 进阶拓展

- 《用户体验要素》— 五层模型体系化阅读
- 《服务设计》— 从单点到旅程的全链路
- 《思考，快与慢》— 理解用户决策偏见

## 阅读方法

每本书配一个真实项目案例做对照，把理论翻译成可评审的设计决策。`,
    thumbnail: '📚',
    thumbnailBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: '3',
    title: '交互原型中的状态设计 | 空态、加载与错误',
    date: '2026-05-20',
    dateLabel: '05/20',
    excerpt: '主流程之外的状态往往决定产品是否「靠谱」。',
    cardType: 'image',
    coverImage: paintings.pearlEarring,
    content: `## 为什么状态设计容易被忽略

评审时大家盯着 happy path，上线后用户最先遇到的却是加载、失败和空白。状态设计直接影响信任感与完成率。

## 四类关键状态

- **加载态** — 告知进度，避免「假死」
- **空态** — 引导下一步，而非冷冰冰的「无数据」
- **错误态** — 说明原因 + 可执行的恢复路径
- **成功态** — 确认结果，必要时引导后续行为

## 原型交付清单

在 Figma / ProtoPie 中为每个核心页面至少补齐上述四种状态，再进入视觉细化。

## 评审问题

- 用户等 3 秒会看到什么？
- 失败后能否一键重试？
- 空列表是否告诉用户「接下来做什么」？`,
    thumbnail: '⚡',
    thumbnailBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: '4',
    title: '用户访谈实战 | 如何问出真实需求而非愿望',
    date: '2026-04-23',
    dateLabel: '04/23',
    excerpt: '访谈不是问卷调查，重点是行为、场景与动机。',
    cardType: 'text',
    content: `## 常见误区

- 直接问「你想要什么功能？」
- 引导用户认同已有方案
- 把访谈当成 usability test

## 更好的问法

- 「上次你遇到这个问题时，具体做了什么？」
- 「当时最让你 frustration 的是哪一步？」
- 「如果没有这个工具，你会怎么 workaround？」

## 访谈结构

1. 暖场与背景（5 min）
2. 场景深挖（20 min）
3. 概念探测（10 min，可选）
4. 总结与补充（5 min）

## 产出

用 affinity mapping 归纳洞察，区分 **观察到的行为** 与 **推断的需求**，避免把个别意见当普遍真理。`,
    thumbnail: '💬',
    thumbnailBg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    id: '5',
    title: '设计系统中的间距与网格 | 一致性从 token 开始',
    date: '2026-04-10',
    dateLabel: '04/10',
    excerpt: '8pt 网格、间距 token 与组件库如何协作。',
    cardType: 'image',
    coverImage: paintings.birthOfVenus,
    content: `## 为什么需要 spacing token

没有 token 时，每个设计师凭感觉填 12、14、16，界面很快「差一点点就不对劲」。Token 让决策可复用、可审计。

## 推荐结构

- **基础单位** — 4px 或 8px 基准
- **间距尺度** — xs / sm / md / lg / xl
- **布局网格** — 移动端 4 列，桌面 12 列

## 与组件库的关系

Button、Card、Form 只引用 token，不写死数值。改版时改 token 即可全局生效。

## 验收标准

随机抽 5 个页面，间距是否只来自 token 列表？新组件 PR 是否包含 spacing 说明？`,
    thumbnail: '📐',
    thumbnailBg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: '6',
    title: '可用性测试 Checklist | 5 人就能发现 85% 的问题',
    date: '2026-03-15',
    dateLabel: '03/15',
    excerpt: '低成本可用性测试的任务设计、记录与优先级排序。',
    cardType: 'text',
    content: `## 测试前

- 明确 3–5 个核心任务（如「完成下单」「找回密码」）
- 准备原型或可测版本
- 招募 5 名目标用户（不必完美匹配）

## 测试中

- 鼓励 think aloud
- 只观察，不教用户操作
- 记录：任务完成率、耗时、错误点、主观满意度

## 测试后

按 **严重程度 × 频率** 排序问题，区分「必须改」与「可观察」。

## 常见陷阱

- 任务描述带答案（「请点击右上角设置」）
- 主持人话太多
- 只修 cosmetic 不修 task flow`,
    thumbnail: '✅',
    thumbnailBg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    id: '7',
    title: '从用户旅程图到服务蓝图 | 看见体验的全链路',
    date: '2026-02-06',
    dateLabel: '02/06',
    excerpt: '跨触点、跨角色的体验设计，不止于单个 App 界面。',
    cardType: 'image',
    coverImage: paintings.wanderer,
    content: `## 用户旅程图（User Journey Map）

横轴是阶段（认知 → 考虑 → 购买 → 使用 → 忠诚），纵轴是行为、想法、情绪曲线与机会点。

## 服务蓝图（Service Blueprint）

在旅程下方补充前台/后台行为、支持流程与系统依赖，适合 O2O、B 端复杂服务。

## 何时用哪个

- 旅程图：对齐团队对用户感受的共识
- 服务蓝图：找断点、优化运营与系统协作

## 协作建议

用研、产品、设计、客服同场绘制，避免设计独自「闭门造车」。`,
    thumbnail: '🗺️',
    thumbnailBg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  {
    id: '8',
    title: '微交互设计 | 反馈、动效与体验温度',
    date: '2026-01-20',
    dateLabel: '01/20',
    excerpt: '按钮按下、列表刷新、Toast 出现——小动效背后的大原则。',
    cardType: 'image',
    coverImage: paintings.schoolOfAthens,
    content: `## 微交互的作用

- **反馈** — 告诉用户「系统听到了」
- **引导** — 暗示可点击、可拖拽
- **情感** — 让产品有人味，而非冷冰冰的工具

## 设计原则

- 时长通常 150–300ms，避免拖沓
-  easing 符合物理直觉（ease-out 进入，ease-in 离开）
- 动效服务于功能，不为炫技

## 常见场景

- 按钮 hover / active / loading
- 表单校验与错误抖动
- 下拉刷新与 skeleton 加载

## 交付

在原型中标注 duration、easing 与 trigger，开发阶段用 Lottie 或 CSS transition 对齐 spec。`,
    thumbnail: '✨',
    thumbnailBg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
]

export function getPostById(id: string): BlogPost | undefined {
  return posts.find((p) => p.id === id)
}

export function formatReadCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return String(count)
}
