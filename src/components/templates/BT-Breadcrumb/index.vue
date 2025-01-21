<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div aria-label="A complete example of page header">
    <el-page-header>
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(segment, index) in breadcrumbSegments" :key="index">
            <router-link v-if="index < breadcrumbSegments.length - 1" :to="generatePath(index)">
              {{ segment }}
            </router-link>
            <span v-else>{{ segment }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Captura a rota atual
const route = useRoute()

// Divide o path em segmentos, ignorando o primeiro `/`
const breadcrumbSegments = computed(() => {
  const segments = route.path.split('/').filter(Boolean) // Remove strings vazias
  return segments.map((segment) => decodeURIComponent(segment)) // Decodifica strings URI
})

// Gera o caminho acumulado para cada segmento
const generatePath = (index: number) => {
  const segments = route.path.split('/').filter(Boolean)
  return '/' + segments.slice(0, index + 1).join('/')
}
</script>

<style lang="scss">
:root {
  --el-header-padding: auto;
}
</style>
