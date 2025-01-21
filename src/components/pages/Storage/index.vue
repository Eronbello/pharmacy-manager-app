<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="dialogVisible" title="Medicamentos" width="500" :before-close="handleClose">
    <ProductCreate
      @onCancel="dialogVisible = false"
      @onAddItem="(product) => handleAddItem(product)"
    />
  </el-dialog>
  <el-row class="row-bg product__header" justify="space-between">
    <el-text class="mb-1" size="large">Produtos</el-text>
    <el-button type="primary" @click="onAddItem">Adicionar Produto</el-button>
  </el-row>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    row-key="ID"
    style="width: 100%"
    max-height="400"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="Name" label="Nome do Produto" />
    <el-table-column prop="Description" label="Descrição" />
    <el-table-column prop="StockQuantity" label="Quantidade" />
    <el-table-column prop="Manufacturer" label="Fabricante" />
    <el-table-column prop="ExpirationDate" label="Data de Validade">
      <template #default="scope">
        {{ formatDate(scope.row.ExpirationDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="BatchNumber" label="Lote" />
    <el-table-column fixed="right" label="Operações">
      <template #default="scope">
        <el-button link type="primary" size="small">Editar</el-button>
        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)"
          >Remover</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="clearSelection">Limpar Seleção</el-button>
    <el-button @click="logSelection">Log Selecionados</el-button>
  </div>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next, sizes, total"
      :total="tableData.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      background
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import ProductCreate from '@/components/organisms/ProductCreate/index.vue'

const dialogVisible = ref(false)

// Dados fornecidos
const tableData = ref([
  {
    ID: 'dd25bb64-2719-4aaf-908d-b11829608342',
    Name: 'Shampoo X',
    Description: 'A high-quality shampoo for daily use.',
    StockQuantity: 50,
    Manufacturer: 'BeautyCorp',
    ExpirationDate: '2025-12-31T00:00:00Z',
    BatchNumber: 'BATCH-12345',
    CreatedAt: '2025-01-21T19:47:38.895713Z',
    UpdatedAt: '2025-01-21T19:47:38.895713Z',
  },
])

const currentPage = ref(1)
const pageSize = ref(5)

// Dados paginados
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const multipleTableRef = ref()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedProducts = ref([]) as any

// Formata a data para exibição
const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const handleClose = () => {
  dialogVisible.value = false
}

// Remove uma linha da tabela
const deleteRow = (index: number) => {
  const actualIndex = (currentPage.value - 1) * pageSize.value + index
  tableData.value.splice(actualIndex, 1)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAddItem = (product: any) => {
  dialogVisible.value = false
  tableData.value.push(product)
}

// Adiciona um novo produto (exemplo fictício)
const onAddItem = () => {
  dialogVisible.value = true
}

// Lida com a mudança de seleção
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectionChange = (val: any[]) => {
  selectedProducts.value = val
}

// Paginação
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
}

// Limpa a seleção
const clearSelection = () => {
  multipleTableRef.value.clearSelection()
}

// Loga os produtos selecionados
const logSelection = () => {
  console.log('Produtos selecionados:', selectedProducts.value)
}
</script>

<style lang="scss" scoped>
.product {
  &__header {
    margin-bottom: 2rem;
  }
}

.pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>
