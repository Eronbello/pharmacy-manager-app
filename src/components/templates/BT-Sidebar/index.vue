<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <template v-for="(item, index) in items" :key="`${item}-${index}`">
      <el-menu-item :route="item.route" :index="index">
        <el-icon v-if="item.icon">
          <component :is="resolveIcon(item.icon)" />
        </el-icon>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Calendar,
  Money,
  User,
  Scissor,
  UserFilled,
  Files,
  Setting,
  Delete,
} from '@element-plus/icons-vue'

interface IMenuItem {
  label: string
  route: string
  icon: string
}
const iconMap = {
  Calendar,
  Money,
  User,
  Scissor,
  UserFilled,
  Files,
  Setting,
  Delete,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

defineProps({
  items: { type: Array<IMenuItem>, required: true },
})

const resolveIcon = (iconName: string) => iconMap[iconName]

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
