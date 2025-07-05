<template>
  <view class="share-tab">
    <!-- 推广链接分享 -->
    <wd-cell-group title="推广分享" border>
      <view class="share-section">
        <wd-button type="primary" block @click="savePromoLink" custom-style="margin-bottom: 20rpx;">
          点击保存
        </wd-button>
        
        <wd-cell title="推广链接" :value="promoLink" is-link @click="copyLink">
          <template #right-icon>
            <wd-icon name="copy" size="16px" color="#165DFF" />
          </template>
        </wd-cell>

        <!-- 社交媒体分享网格 -->
        <view class="social-share">
          <view class="share-title">分享到</view>
          <wd-grid :column="3" border class="share-grid">
            <wd-grid-item
              v-for="(social, index) in socialPlatforms.slice(0, 6)"
              :key="index"
              :text="social.name"
              clickable
              @itemclick="shareToSocial(social)"
            >
              <template #icon>
                <wd-img :src="social.icon" width="32rpx" height="32rpx" mode="aspectFit" />
              </template>
            </wd-grid-item>
          </wd-grid>
        </view>
      </view>
    </wd-cell-group>

    <!-- 推广教程 -->
    <wd-cell-group title="推广教程" border>
      <view class="tutorial-content">
        <!-- 佣金计算示例 -->
        <view class="example-section">
          <view class="example-title">佣金计算示例</view>
          <view class="example-diagram">
            <view class="level-row">
              <view class="user-node primary">
                <view class="user-avatar">A</view>
                <view class="user-info">
                  <text>直属业绩: 5500</text>
                  <text>直属佣金: <text class="highlight">550</text></text>
                  <text>其他佣金: <text class="highlight">690</text></text>
                  <text>本期佣金: <text class="highlight">1240</text></text>
                </view>
              </view>
            </view>
            
            <view class="level-row">
              <view class="user-node">
                <view class="user-avatar">B1</view>
                <text>有效投注: 500</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">B2</view>
                <text>有效投注: 3000</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">B3</view>
                <text>有效投注: 2000</text>
              </view>
            </view>
            
            <view class="level-row">
              <view class="user-node">
                <view class="user-avatar">C1</view>
                <text>有效投注: 1000</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">C2</view>
                <text>有效投注: 2000</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">C3</view>
                <text>有效投注: 20000</text>
              </view>
            </view>
          </view>

          <!-- 详细说明 -->
          <view class="tutorial-text">
            <view class="tutorial-section">
              <text class="section-title">举例说明如下：</text>
              <text class="section-content">
                假设当前有效投注的返佣比例为10%(即来自直属下级)，跨级部分额外佣金为比例中的比例(站长额外赠送)，赠送比例为30%。
              </text>
            </view>
            <view class="tutorial-section">
              <text class="section-title">全民代理补充说明：</text>
              <text class="section-content">
                因全民代理代理模式可以发展无限下级，即N代表无限级，即可横向发展同时也可以纵向发展。
              </text>
            </view>
          </view>
        </view>
      </view>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
// 接收父组件传递的数据
const props = defineProps<{
  promoLink: string
  socialPlatforms: Array<{
    name: string
    icon: string
    type: string
  }>
}>()

// 定义事件
const emit = defineEmits<{
  savePromoLink: []
  copyLink: []
  shareToSocial: [social: any]
}>()

/**
 * 保存推广链接
 */
const savePromoLink = () => {
  emit('savePromoLink')
}

/**
 * 复制推广链接
 */
const copyLink = () => {
  emit('copyLink')
}

/**
 * 分享到社交媒体
 */
const shareToSocial = (social: any) => {
  emit('shareToSocial', social)
}
</script>

<style lang="scss" scoped>
.share-tab {
  // 分享区域
  .share-section {
    padding: 20rpx 0;
    
    :deep(.wd-button) {
      min-height: 88rpx;
      font-size: 32rpx;
    }
  }

  .share-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1d2129;
    margin: 20rpx 0;
    text-align: center;
  }

  .social-share {
    margin-top: 20rpx;
    
    .share-grid {
      :deep(.wd-grid) {
        .wd-grid-item {
          .wd-grid-item__content {
            min-height: 100rpx;
            padding: 16rpx 8rpx;
            transition: all 0.3s ease;
            
            &:active {
              transform: scale(0.95);
              background-color: rgba(22, 93, 255, 0.1);
            }
          }
          
          .wd-grid-item__icon {
            margin-bottom: 8rpx;
          }
          
          .wd-grid-item__text {
            font-weight: 500;
            color: #4e5969;
            font-size: 24rpx;
          }
        }
      }
    }
  }

  // 推广教程
  .tutorial-content {
    padding: 20rpx;
  }

  .example-section {
    .example-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 20rpx;
      text-align: center;
    }

    .example-diagram {
      .level-row {
        display: flex;
        justify-content: center;
        margin-bottom: 24rpx;
        gap: 20rpx;
        flex-wrap: wrap;

        .user-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20rpx;
          background-color: #f7f8fa;
          border-radius: 12rpx;
          min-width: 140rpx;
          border: 1px solid #e5e6eb;

          &.primary {
            background: linear-gradient(to right, #165DFF, #3175ea);
            color: #ffffff;
            border-color: #165DFF;

            .user-avatar {
              background-color: rgba(255, 255, 255, 0.2);
              color: #ffffff;
            }

            .user-info text {
              color: #ffffff;

              .highlight {
                color: #ffeb3b;
                font-weight: 600;
              }
            }
          }

          .user-avatar {
            width: 48rpx;
            height: 48rpx;
            background: linear-gradient(to right, #165DFF, #3175ea);
            color: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-bottom: 12rpx;
            font-size: 28rpx;
          }

          .user-info {
            display: flex;
            flex-direction: column;
            gap: 8rpx;

            text {
              font-size: 24rpx;
              color: #4e5969;
              text-align: center;
              line-height: 1.4;

              .highlight {
                color: #165DFF;
                font-weight: 600;
              }
            }
          }

          text {
            font-size: 24rpx;
            color: #4e5969;
            text-align: center;
          }
        }
      }
    }
  }

  .tutorial-text {
    margin-top: 40rpx;

    .tutorial-section {
      margin-bottom: 32rpx;

      .section-title {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 16rpx;
      }

      .section-content {
        display: block;
        font-size: 28rpx;
        color: #4e5969;
        line-height: 1.6;
        margin-bottom: 12rpx;
      }
    }
  }
}
</style>
