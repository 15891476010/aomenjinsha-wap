<template>
  <view class="share-page">
    <view class="content">
      <!-- 分享统计 -->
      <wd-card title="分享统计" class="share-stats-card">
        <wd-row :gutter="20">
          <wd-col :span="12" v-for="stat in shareStats" :key="stat.label">
            <view class="stat-item">
              <wd-icon :name="stat.icon" size="32rpx" :color="stat.color" />
              <text class="stat-value">{{ stat.value }}</text>
              <text class="stat-label">{{ stat.label }}</text>
            </view>
          </wd-col>
        </wd-row>
      </wd-card>

      <!-- 推广工具 -->
      <wd-card title="推广工具" class="promo-tools-card">
        <wd-cell-group border>
          <wd-cell title="推广链接" :value="promoLink" is-link @click="copyLink">
            <template #icon>
              <wd-icon name="link" />
            </template>
          </wd-cell>
          <wd-cell title="推广海报" value="生成海报" is-link @click="generatePoster">
            <template #icon>
              <wd-icon name="picture" />
            </template>
          </wd-cell>
          <wd-cell title="邀请码" :value="inviteCode" is-link @click="copyInviteCode">
            <template #icon>
              <wd-icon name="qrcode" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </wd-card>

      <!-- 社交分享 -->
      <wd-card title="快速分享" class="quick-share-card">
        <wd-grid :column="4" border>
          <wd-grid-item 
            v-for="platform in socialPlatforms" 
            :key="platform.type"
            @click="shareToSocial(platform)"
          >
            <wd-icon :name="platform.icon" size="40rpx" :color="platform.color" />
            <text class="platform-name">{{ platform.name }}</text>
          </wd-grid-item>
        </wd-grid>
      </wd-card>

      <!-- 分享记录 -->
      <wd-card title="分享记录" class="share-records-card">
        <wd-cell-group border>
          <wd-cell 
            v-for="record in shareRecords" 
            :key="record.id"
            :title="record.platform"
            :value="record.time"
            :label="`分享${record.count}次`"
          >
            <template #icon>
              <wd-icon :name="record.icon" :color="record.color" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </wd-card>

      <!-- 分享技巧 -->
      <wd-card title="分享技巧" class="share-tips-card">
        <view class="tips-content">
          <view class="tip-item" v-for="(tip, index) in shareTips" :key="index">
            <wd-icon name="lightbulb" color="#ff7d00" size="24rpx" />
            <text class="tip-text">{{ tip }}</text>
          </view>
        </view>
      </wd-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 推广链接
const promoLink = ref('https://e1.pg1513.vip/register?code=AG123456')

// 邀请码
const inviteCode = ref('AG123456')

// 分享统计数据
const shareStats = ref([
  { label: '今日分享', value: '12', icon: 'calendar', color: '#00b42a' },
  { label: '总分享次数', value: '286', icon: 'share', color: '#165dff' },
  { label: '分享转化', value: '68', icon: 'user', color: '#ff7d00' },
  { label: '转化率', value: '23.8%', icon: 'chart', color: '#f53f3f' }
])

// 社交媒体平台
const socialPlatforms = ref([
  { name: '微信', icon: 'wechat', type: 'wechat', color: '#07c160' },
  { name: 'QQ', icon: 'qq', type: 'qq', color: '#12b7f5' },
  { name: '微博', icon: 'weibo', type: 'weibo', color: '#ff8200' },
  { name: 'Facebook', icon: 'facebook', type: 'facebook', color: '#1877f2' },
  { name: 'Twitter', icon: 'twitter', type: 'twitter', color: '#1da1f2' },
  { name: 'Telegram', icon: 'telegram', type: 'telegram', color: '#0088cc' },
  { name: 'WhatsApp', icon: 'whatsapp', type: 'whatsapp', color: '#25d366' },
  { name: '更多', icon: 'more', type: 'more', color: '#86909c' }
])

// 分享记录
const shareRecords = ref([
  { id: 1, platform: '微信朋友圈', time: '2小时前', count: 5, icon: 'wechat', color: '#07c160' },
  { id: 2, platform: 'QQ空间', time: '5小时前', count: 3, icon: 'qq', color: '#12b7f5' },
  { id: 3, platform: '微博', time: '1天前', count: 8, icon: 'weibo', color: '#ff8200' },
  { id: 4, platform: 'Facebook', time: '2天前', count: 2, icon: 'facebook', color: '#1877f2' }
])

// 分享技巧
const shareTips = ref([
  '选择合适的时间分享，如晚上7-9点用户活跃度较高',
  '添加个人感受和推荐理由，提高转化率',
  '定期更新分享内容，保持新鲜感',
  '针对不同平台调整分享策略和内容',
  '关注分享数据，优化分享效果'
])



/**
 * 复制链接
 */
const copyLink = () => {
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('推广链接已复制')
    }
  })
}

/**
 * 复制邀请码
 */
const copyInviteCode = () => {
  uni.setClipboardData({
    data: inviteCode.value,
    success: () => {
      toast.success('邀请码已复制')
    }
  })
}

/**
 * 生成推广海报
 */
const generatePoster = () => {
  toast.loading('正在生成海报...')
  setTimeout(() => {
    toast.success('海报生成成功')
  }, 2000)
}

/**
 * 分享到社交媒体
 */
const shareToSocial = (platform: any) => {
  if (platform.type === 'more') {
    uni.showActionSheet({
      itemList: ['复制链接', '生成海报', '保存二维码'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            copyLink()
            break
          case 1:
            generatePoster()
            break
          case 2:
            toast.success('二维码已保存')
            break
        }
      }
    })
  } else {
    toast.success(`正在分享到${platform.name}`)
  }
}
</script>

<style lang="scss" scoped>
.share-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
}

.share-stats-card,
.promo-tools-card,
.quick-share-card,
.share-records-card,
.share-tips-card {
  margin-bottom: 24rpx;
}

.stat-item {
  text-align: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin: 8rpx 0;
  color: #1d2129;
}

.stat-label {
  font-size: 24rpx;
  color: #86909c;
}

.platform-name {
  font-size: 22rpx;
  color: #1d2129;
  margin-top: 8rpx;
  text-align: center;
}

.tips-content {
  padding: 20rpx 0;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.tip-text {
  flex: 1;
  font-size: 26rpx;
  color: #1d2129;
  line-height: 1.5;
  margin-left: 12rpx;
}
</style>
