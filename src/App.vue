<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import BTHeader from '@/components/templates/BT-Header/index.vue'
import BTSidebar from '@/components/templates/BT-Sidebar/index.vue'
import BTBreadcrumb from '@/components/templates/BT-Breadcrumb/index.vue'

const route = useRoute()

const menuItems = [
  // { label: 'Agenda', route: '/', icon: 'Calendar' },
  // { label: 'Caixa', route: '/orders', icon: 'Money' },
  // { label: 'Clientes', route: '/customers', icon: 'User' },
  // { label: 'Servicos', route: '/services', icon: 'Scissor' },
  // { label: 'Funcionarios', route: '/employees', icon: 'UserFilled' },
  { label: 'Estoque', route: '/storage', icon: 'Files' },
  { label: 'Lixeira', route: '/trash', icon: 'Delete' },
  // { label: 'Configuracao', route: '/configs', icon: 'Setting' },
]
</script>

<template>
  <div class="common-layout" v-if="route.name !== 'Login'">
    <el-container>
      <el-aside class="hidden-xs-only"><BTSidebar :items="menuItems" /></el-aside>
      <el-container>
        <el-header><BTHeader /></el-header>
        <el-main class="app__main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.app {
  &__main {
  }
}
</style>
