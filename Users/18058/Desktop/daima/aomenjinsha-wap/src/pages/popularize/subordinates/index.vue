<style lang="scss" scoped>
/* 响应式适配 */
@media (max-width: 750rpx) {
  .filter-controls-section {
    padding: 24rpx;
    gap: 20rpx;

    .filter-dropdown,
    .search-container {
      padding: 20rpx 24rpx;

      .filter-text,
      .search-input {
        font-size: 26rpx;
      }
    }
  }

  .subordinates-list-section {
    margin: 0 16rpx;

    .empty-state {
      padding: 80rpx 24rpx;

      .empty-icon {
        width: 60rpx;
        height: 60rpx;

        .empty-dot {
          font-size: 36rpx;
        }
      }

      .empty-text {
        font-size: 26rpx;
      }
    }

    .subordinates-list {
      padding: 24rpx;

      .subordinate-item {
        padding: 24rpx 0;

        .subordinate-header {
          margin-bottom: 16rpx;

          .subordinate-info {
            gap: 12rpx;

            .subordinate-id {
              font-size: 26rpx;
            }

            .subordinate-level {
              font-size: 20rpx;
              padding: 4rpx 8rpx;
            }
          }

          .subordinate-status {
            font-size: 22rpx;
            padding: 6rpx 12rpx;
          }
        }

        .subordinate-details {
          gap: 10rpx;

          .detail-item {
            .detail-label,
            .detail-value {
              font-size: 22rpx;
            }
          }
        }
      }
    }
  }
}
</style> <!-- 新增闭合标签 -->