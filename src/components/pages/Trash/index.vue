<!-- eslint-disable vue/multi-word-component-names -->
<!-- Trash.vue -->
<template>
  <el-row class="row-bg product__header" justify="space-between">
    <el-text class="mb-1" size="large">Lixeira</el-text>
    <!-- Botão de adicionar produto removido -->
  </el-row>

  <div class="search-container">
    <el-input
      v-model="search"
      style="width: 240px"
      placeholder="Nome do produto"
      :suffix-icon="Search"
    />
    <el-button type="primary" @click="handleSearch">Filtrar Produtos</el-button>
    <el-button class="clear-button" type="danger" @click="clearFilters">Limpar filtros</el-button>
  </div>

  <el-table
    ref="multipleTableRef"
    :data="tableData"
    :key="key"
    row-key="ID"
    style="width: 100%"
    height="75vh"
    max-height="100%"
    :row-class-name="tableRowClassName"
    :default-sort="{ prop: 'ExpirationDate', order: 'ascending' }"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column sortable prop="Name" label="Nome do Produto" />
    <el-table-column prop="Description" label="Descrição" />
    <el-table-column prop="StockQuantity" label="Quantidade" width="55" />
    <el-table-column prop="Manufacturer" label="Fabricante" />
    <el-table-column prop="Category" label="Categoria" />
    <el-table-column sortable prop="ExpirationDate" label="Data de Validade">
      <template #default="scope">
        {{ formatDate(scope.row.ExpirationDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="BatchNumber" label="Lote" />
    <el-table-column fixed="right" label="Operações">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="restoreRow(scope.$index, scope.row)"
          >Recuperar</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-progress v-if="isLoading" :percentage="50" :indeterminate="true" />
</template>

<script lang="ts" setup>
/* ------------------------------------------------------------------
   IMPORTS
   ------------------------------------------------------------------ */
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

dayjs.extend(utc)

/* ------------------------------------------------------------------
   ESTADO LOCAL
   ------------------------------------------------------------------ */
const search = ref('')
const filterDueDate = ref(false)

// Dados da tabela
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableData = ref([]) as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let backupData: any[] = []

const tableRowClassName = ({ row }: { row: { ExpirationDate: string; Name: string } }) => {
  const today = dayjs()
  const expirationDate = dayjs(row.ExpirationDate)

  // Se a data de validade já passou ou está prestes a passar
  if (expirationDate.diff(today, 'day') <= 30) {
    return 'danger-row'
  } else if (expirationDate.diff(today, 'day') <= 60) {
    return 'yellow-row'
  }
  return ''
}

const currentPage = ref(1)
const pageSize = ref(5)
const key = ref(0)
const isLoading = ref(true)

// Paginação
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const multipleTableRef = ref()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedProducts = ref([]) as any

/* ------------------------------------------------------------------
   FUNÇÕES DE APOIO
   ------------------------------------------------------------------ */
const formatDate = (date: string) => {
  return dayjs.utc(date).format('DD/MM/YYYY')
}

// Ao recuperar (restaurar) uma linha
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const restoreRow = async (index: number, row: any) => {
  ElMessageBox.confirm('Tem certeza que deseja recuperar esse item?')
    .then(async () => {
      // Faz a requisição para alterar Category para 'recovered'
      await fetch(`https://naked-eydie-bellos-tech-3517c645.koyeb.app/products/${row.ID}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...row, Category: 'recovered' }),
      })

      ElMessage({
        message: 'Produto recuperado com sucesso!',
        type: 'success',
      })

      // Remove o item do array atual, pois ele não está mais "deleted"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tableData.value = tableData.value.filter((item: any) => item.ID !== row.ID)
      backupData = [...tableData.value]
    })
    .catch(() => {
      // Caso usuário cancele a confirmação
    })
}

// Lida com a mudança de seleção
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectionChange = (val: any[]) => {
  selectedProducts.value = val
}

// Pesquisar
const handleSearch = () => {
  tableData.value = [...backupData].filter((item) =>
    item.Name?.toLowerCase().includes(search.value.toLowerCase()),
  )
}

// Limpar filtros
const clearFilters = () => {
  currentPage.value = 1 // Reseta a página
  tableData.value = [...backupData]
}

// Paginação
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
}

/* ------------------------------------------------------------------
   onMounted
   ------------------------------------------------------------------ */
onMounted(async () => {
  const rawResponse = await fetch('https://naked-eydie-bellos-tech-3517c645.koyeb.app/products', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const allProducts = await rawResponse.json()
  // Filtra apenas aqueles que estão com Category = 'deleted'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData.value = allProducts.filter((item: any) => item.Category === 'deleted')
  backupData = [...tableData.value]
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.product {
  &__header {
    margin-bottom: 2rem;
  }
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.clear-button {
  margin-left: 0 !important;
}
</style>

<style lang="scss">
.danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
.yellow-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-progress__text {
  display: none;
}
</style>
