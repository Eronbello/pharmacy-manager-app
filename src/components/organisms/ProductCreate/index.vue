<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-form
    :inline="true"
    :model="formProduct"
    class="demo-form-inline"
    label-positions="left"
    size="large"
  >
    <el-form-item label="Nome do Produto">
      <el-input v-model="formProduct.Name" placeholder="Nome do Produto" clearable />
    </el-form-item>
    <el-form-item label="Descrição">
      <el-input v-model="formProduct.Description" placeholder="Descrição do Produto" clearable />
    </el-form-item>
    <el-form-item label="Quantidade em Estoque">
      <el-input-number v-model="formProduct.StockQuantity" placeholder="Quantidade" :min="0" />
    </el-form-item>
    <el-form-item label="Fabricante">
      <el-input v-model="formProduct.Manufacturer" placeholder="Fabricante" clearable />
    </el-form-item>
    <el-form-item label="Data de Validade">
      <el-date-picker
        v-model="formProduct.ExpirationDate"
        type="date"
        placeholder="Data de Validade"
        clearable
      />
    </el-form-item>
    <el-form-item label="Número do Lote">
      <el-input v-model="formProduct.BatchNumber" placeholder="Número do Lote" clearable />
    </el-form-item>
    <el-form-item class="product-create__footer">
      <div class="product-create__footer">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Salvar Produto</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, defineEmits } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits(['onAddItem', 'onCancel'])

const formProduct = reactive({
  Name: 'Novo Produto',
  Description: 'Descrição do novo produto.',
  StockQuantity: 100,
  Manufacturer: 'New Manufacturer',
  ExpirationDate: dayjs().add(1, 'year').toISOString(),
  BatchNumber: 'NEW-BATCH-001',
})

const onSubmit = () => {
  emit('onAddItem', { ...formProduct })
}

const onCancel = () => {
  emit('onCancel')
}
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

.demo-form-inline .el-input-number {
  --el-input-number-width: 100%;
}

.el-form--inline .el-form-item {
  width: 100%;
}
.product-create__footer {
  display: flex;
  align-items: flex-end;
  width: 100%;
  align-items: flex-end;
  justify-content: end;
}
</style>
