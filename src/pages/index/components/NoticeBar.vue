<template>
  <view v-for="(item, index) in indexData.noticeBar" :key="index">
    <view style="height: 10px" />
    <wd-notice-bar
      :scrollable="item.scrollable"
      :color="item.color"
      :background-color="item.backgroundColor"
      :speed="item.speed"
      :closable="item.closable"
      :type="item.type"
    >
      <template #prefix>
        <wd-icon class="prefix" name="warn-bold">占位符</wd-icon>
      </template>
      {{ item.content }}
      <template #suffix>
        <div>{{ item.solt }}</div>
      </template>
    </wd-notice-bar>
  </view>
</template>

<script setup lang="ts">
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());
</script>

<style lang="scss"></style>
