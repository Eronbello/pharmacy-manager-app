<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="12">
      <div class="orders__content">
        <div class="orders__money">
          <span>Resultado</span>
          <p>R$ 965,00</p>
        </div>
        <div>
          <el-button type="success">
            Adicionar receita<el-icon class="el-icon--right"><Plus /></el-icon>
          </el-button>
          <el-button type="danger">
            Adicionar despesa<el-icon class="el-icon--right"><Minus /></el-icon>
          </el-button>
        </div>
        <div></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="orders__summary">
        <h2>Lançamentos</h2>
        <div v-for="(i, index) in 10" :key="index">
          <Order label="Despesa" type="Aluguel" icon="Minus" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Plus, Minus, Search, Share, Upload } from '@element-plus/icons-vue'
import Order from '@/components/molecules/Order/index.vue'
</script>

<style lang="scss" scoped>
.el-row,
.el-col {
  height: 100%;
}
.orders {
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-bottom: 10rem;
  }

  &__money {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    text-align: center;

    p {
      font-size: 2rem;
    }
  }

  &__summary {
    h2 {
      margin-bottom: 1rem;
    }
  }
}
</style>
