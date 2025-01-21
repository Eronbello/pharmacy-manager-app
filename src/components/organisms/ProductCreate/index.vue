<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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
      <el-autocomplete
        v-model="autosuggestion"
        :fetch-suggestions="querySearch"
        placeholder="Please input"
        @select="handleSelect"
      />
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
import { reactive, defineEmits, ref, onMounted } from 'vue'
import medicines from '@/assets/medicines.json'
import dayjs from 'dayjs'

// Estado para o autocomplete
const autosuggestion = ref<string>('') // Valor selecionado
const suggestions = ref<Array<{ value: string }>>([]) // Lista de sugestões

const emit = defineEmits(['onAddItem', 'onCancel'])

// Dados iniciais do formulário
const formProduct = reactive({
  Name: '',
  Description: '',
  StockQuantity: 0,
  Manufacturer: '',
  ExpirationDate: '',
  BatchNumber: '',
})

// Função para lidar com o envio do formulário
const onSubmit = () => {
  emit('onAddItem', { ...formProduct })

  formProduct.Name = ''
  formProduct.Description = ''
  formProduct.StockQuantity = 0
  formProduct.Manufacturer = ''
  formProduct.ExpirationDate = ''
  formProduct.BatchNumber = ''
}

// Função para cancelar o formulário
const onCancel = () => {
  emit('onCancel')

  formProduct.Name = ''
  formProduct.Description = ''
  formProduct.StockQuantity = 0
  formProduct.Manufacturer = ''
  formProduct.ExpirationDate = ''
  formProduct.BatchNumber = ''
}

// Carregar dados ao montar o componente
onMounted(() => {
  // Transformar os dados do JSON em um formato compatível com o autocomplete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suggestions.value = medicines.map((item: any) => ({ value: item.drug }))
})

// Função chamada durante a busca
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const querySearch = (queryString: string, cb: (results: any[]) => void) => {
  // Filtra os itens com base na entrada do usuário
  const filteredResults = suggestions.value.filter((item) =>
    item.value.toLowerCase().includes(queryString.toLowerCase())
  )

  // Remove duplicatas usando um Set
  const uniqueResults = Array.from(
    new Set(filteredResults.map((item) => item.value))
  ).map((uniqueValue) => {
    return filteredResults.find((item) => item.value === uniqueValue)!
  })

  // Limita a 10 resultados
  cb(uniqueResults.slice(0, 10))
}

// Função chamada ao selecionar uma sugestão
const handleSelect = (item: { value: string }) => {
  autosuggestion.value = item.value
  const selectedMedicine = medicines.find((med) => med.drug === item.value)

  if (selectedMedicine) {
    formProduct.Name = selectedMedicine.drug
  }
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
