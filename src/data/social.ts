export interface SocialLink {
  id: 'xiaohongshu' | 'channels'
  label: string
  url: string
  icon: string
  tooltip: string
}

/** 首页右上角「一起聊」按钮，直接在此修改二维码图片 */
export const chatLink = {
  label: '一起聊',
  qrCode: '/images/social/wechat-qr.png',
  hint: '微信扫码',
}

/** 首页自媒体标签，直接在此修改链接与提示文案 */
export const socialLinks: SocialLink[] = [
  {
    id: 'xiaohongshu',
    label: '小红书',
    icon: '/images/social/xiaohongshu.png',
    url: 'https://xhslink.com/m/7NPgeOSpSLR',
    tooltip: '收获了111.4K次赞与收藏',
  },
  {
    id: 'channels',
    label: '视频号',
    icon: '/images/social/channels.png',
    url: 'https://weixin.qq.com/sph/AbIgD5MjBD',
    tooltip: '获得1.2万点赞与收藏',
  },
]
