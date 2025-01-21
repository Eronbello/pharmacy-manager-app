<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="order">
    <el-button v-if="props.icon" type="danger" :icon="resolveIcon(props.icon)" circle> </el-button>
    <div class="order__description">
      <el-text type="danger">{{ props.type }}</el-text>
      <el-text>{{ props.label }}</el-text>
    </div>
    <div class="order__price">
      <el-text class="mx-1" type="danger">R$ 35,00 </el-text>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Minus } from '@element-plus/icons-vue'

interface IMenuItem {
  label: string
  route: string
  icon: string
}
const iconMap = {
  Plus,
  Minus,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

// const props = defineProps({
//   items: { type: Object as PropType<FlashInterface>, required: true },
// })

const props = defineProps({
  label: { type: String },
  type: { type: String },
  icon: { type: String },
})

const resolveIcon = (iconName: string) => iconMap[iconName]
</script>

<style lang="scss" scoped>
.order {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;

  &__description {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    span {
      align-self: auto;
    }
  }

  &__price {
    margin-left: auto;
  }
}
</style>
