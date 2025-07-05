<template>
  <view class="commission-page">
    <view class="content">
      <!-- 佣金概览 -->
      <wd-card title="佣金概览" class="commission-overview-card">
        <wd-row :gutter="20">
          <wd-col :span="12" v-for="item in commissionItems" :key="item.label">
            <view class="commission-item">
              <wd-icon :name="item.icon" size="32rpx" color="#ff7d00" />
              <text class="commission-value">¥{{ item.value }}</text>
              <text class="commission-label">{{ item.label }}</text>
            </view>
          </wd-col>
        </wd-row>
      </wd-card>

      <!-- 佣金操作 -->
      <wd-card title="佣金操作" class="commission-action-card">
        <view class="action-buttons">
          <wd-button type="primary" block @click="withdrawCommission">
            <wd-icon name="money" />
            提取佣金
          </wd-button>
          <wd-button type="success" block @click="viewCommissionHistory" style="margin-top: 20rpx;">
            <wd-icon name="list" />
            佣金记录
          </wd-button>
        </view>
      </wd-card>

      <!-- 佣金规则 -->
      <wd-card title="佣金规则" class="commission-rules-card">
        <wd-steps :current="currentCommissionLevel" direction="vertical">
          <wd-step 
            v-for="(rule, index) in commissionRules" 
            :key="index"
            :title="rule.title"
            :description="rule.description"
            :status="index <= currentCommissionLevel ? 'finish' : 'wait'"
          />
        </wd-steps>
      </wd-card>

      <!-- 佣金统计 -->
      <wd-card title="佣金统计" class="commission-stats-card">
        <wd-tabs v-model="statsTab">
          <wd-tab title="本月" name="month">
            <wd-cell-group border>
              <wd-cell title="投注佣金" value="¥12,680.00" />
              <wd-cell title="推广佣金" value="¥3,850.00" />
              <wd-cell title="团队佣金" value="¥2,150.00" />
              <wd-cell title="奖励佣金" value="¥680.00" />
            </wd-cell-group>
          </wd-tab>
          <wd-tab title="上月" name="lastMonth">
            <wd-cell-group border>
              <wd-cell title="投注佣金" value="¥15,280.00" />
              <wd-cell title="推广佣金" value="¥4,650.00" />
              <wd-cell title="团队佣金" value="¥3,280.00" />
              <wd-cell title="奖励佣金" value="¥1,200.00" />
            </wd-cell-group>
          </wd-tab>
          <wd-tab title="累计" name="total">
            <wd-cell-group border>
              <wd-cell title="投注佣金" value="¥186,500.00" />
              <wd-cell title="推广佣金" value="¥56,800.00" />
              <wd-cell title="团队佣金" value="¥38,600.00" />
              <wd-cell title="奖励佣金" value="¥15,200.00" />
            </wd-cell-group>
          </wd-tab>
        </wd-tabs>
      </wd-card>

      <!-- 最近记录 -->
      <wd-card title="最近记录" class="commission-records-card">
        <wd-cell-group border>
          <wd-cell 
            v-for="record in recentCommissionRecords" 
            :key="record.id"
            :title="record.type"
            :value="`¥${record.amount}`"
            :label="record.time"
          >
            <template #icon>
              <wd-icon :name="record.icon" :color="record.color" />
            </template>
          </wd-cell>
        </wd-cell-group>
        <view class="view-more">
          <wd-button type="text" @click="viewAllRecords">查看全部记录</wd-button>
        </view>
      </wd-card>

      <!-- 提现设置 -->
      <wd-card title="提现设置" class="withdraw-settings-card">
        <wd-cell-group border>
          <wd-cell title="银行卡" value="****1234" is-link @click="manageBankCard">
            <template #icon>
              <wd-icon name="bank-card" color="#165dff" />
            </template>
          </wd-cell>
          <wd-cell title="支付宝" value="未绑定" is-link @click="bindAlipay">
            <template #icon>
              <wd-icon name="alipay" color="#00b42a" />
            </template>
          </wd-cell>
          <wd-cell title="微信" value="已绑定" is-link @click="manageWechat">
            <template #icon>
              <wd-icon name="wechat" color="#07c160" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </wd-card>
    </view>

    <!-- 提取佣金弹窗 -->
    <wd-popup v-model="showWithdrawPopup" position="bottom">
      <view class="withdraw-popup">
        <view class="popup-header">
          <text class="popup-title">提取佣金</text>
          <wd-icon name="close" @click="showWithdrawPopup = false" />
        </view>
        <view class="popup-content">
          <wd-input 
            v-model="withdrawAmount" 
            type="number" 
            placeholder="请输入提取金额"
            prefix-icon="money"
          />
          <text class="available-amount">可提取金额：¥{{ commissionItems[3].value }}</text>
          <wd-button type="primary" block @click="confirmWithdraw" style="margin-top: 40rpx;">
            确认提取
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 佣金等级
const currentCommissionLevel = ref(2)

// 统计标签页
const statsTab = ref('month')

// 提取佣金弹窗
const showWithdrawPopup = ref(false)
const withdrawAmount = ref('')

// 佣金数据
const commissionItems = ref([
  { label: '今日佣金', value: '1,240.00', icon: 'calendar' },
  { label: '本月佣金', value: '15,680.00', icon: 'chart' },
  { label: '累计佣金', value: '128,500.00', icon: 'star' },
  { label: '可提取佣金', value: '8,500.00', icon: 'money' }
])

// 佣金规则
const commissionRules = ref([
  { title: '新手代理', description: '佣金比例：5%，无门槛要求' },
  { title: '铜牌代理', description: '佣金比例：8%，月业绩达到10万' },
  { title: '银牌代理', description: '佣金比例：12%，月业绩达到50万' },
  { title: '金牌代理', description: '佣金比例：15%，月业绩达到100万' }
])

// 佣金记录
const recentCommissionRecords = ref([
  { id: 1, type: '投注佣金', amount: '1,240.00', time: '2024-01-15 14:30', icon: 'money', color: '#00b42a' },
  { id: 2, type: '推广佣金', amount: '680.00', time: '2024-01-15 10:20', icon: 'user', color: '#165dff' },
  { id: 3, type: '佣金提取', amount: '-5,000.00', time: '2024-01-14 16:45', icon: 'withdraw', color: '#f53f3f' },
  { id: 4, type: '投注佣金', amount: '890.00', time: '2024-01-14 09:15', icon: 'money', color: '#00b42a' }
])



/**
 * 提取佣金
 */
const withdrawCommission = () => {
  showWithdrawPopup.value = true
}

/**
 * 确认提取
 */
const confirmWithdraw = () => {
  if (!withdrawAmount.value) {
    toast.error('请输入提取金额')
    return
  }
  
  const amount = parseFloat(withdrawAmount.value)
  const available = parseFloat(commissionItems.value[3].value.replace(',', ''))
  
  if (amount > available) {
    toast.error('提取金额不能超过可提取金额')
    return
  }
  
  showWithdrawPopup.value = false
  toast.loading('正在处理提取申请...')
  
  setTimeout(() => {
    toast.success('提取申请已提交，请等待审核')
    withdrawAmount.value = ''
  }, 2000)
}

/**
 * 查看佣金历史
 */
const viewCommissionHistory = () => {
  uni.navigateTo({
    url: '/pages/commission/history'
  })
}

/**
 * 查看全部记录
 */
const viewAllRecords = () => {
  uni.navigateTo({
    url: '/pages/commission/records'
  })
}

/**
 * 管理银行卡
 */
const manageBankCard = () => {
  uni.navigateTo({
    url: '/pages/account/bank-card'
  })
}

/**
 * 绑定支付宝
 */
const bindAlipay = () => {
  uni.navigateTo({
    url: '/pages/account/alipay'
  })
}

/**
 * 管理微信
 */
const manageWechat = () => {
  uni.navigateTo({
    url: '/pages/account/wechat'
  })
}
</script>

<style lang="scss" scoped>
.commission-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
}

.commission-overview-card,
.commission-action-card,
.commission-rules-card,
.commission-stats-card,
.commission-records-card,
.withdraw-settings-card {
  margin-bottom: 24rpx;
}

.commission-item {
  text-align: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.commission-value {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #ff7d00;
  margin: 8rpx 0;
}

.commission-label {
  font-size: 24rpx;
  color: #86909c;
}

.action-buttons {
  padding: 20rpx 0;
}

.view-more {
  text-align: center;
  padding: 20rpx 0;
}

.withdraw-popup {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d2129;
}

.popup-content {
  padding-bottom: 40rpx;
}

.available-amount {
  display: block;
  font-size: 24rpx;
  color: #86909c;
  margin-top: 16rpx;
}
</style>
