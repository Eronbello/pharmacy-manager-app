<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="dialogVisible" title="Medicamentos" width="500" :before-close="handleClose">
    <ProductCreate
      @onCancel="dialogVisible = false"
      :items="tableData"
      @onAddItem="(product) => handleAddItem(product)"
    />
  </el-dialog>
  <el-row class="row-bg product__header" justify="space-between">
    <el-text class="mb-1" size="large">Produtos</el-text>
    <el-button type="primary" @click="onAddItem">Adicionar Produto</el-button>
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
    show-summary
    :data="tableData"
    :key="key"
    :summary-method="summaryHandle"
    sum-text=""
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
        <!-- <el-button link type="primary" size="small">Editar</el-button> -->
        <el-button link type="primary" size="small" @click="deleteRow(scope.$index, scope.row)"
          >Remover</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-progress v-if="isLoading" :percentage="50" :indeterminate="true" />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ProductCreate from '@/components/organisms/ProductCreate/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

dayjs.extend(utc)

const dialogVisible = ref(false)
const search = ref('')
const filterDueDate = ref(false)

// Dados fornecidos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableData = ref([]) as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let backupData: any[] = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const summaryHandle = ({ columns, data }: any) => {
  // Array que conterá as células do resumo, 1 para cada coluna
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sums = [] as any

  // Itera sobre as colunas do el-table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns.forEach((column: any, index: any) => {
    // Exemplo: primeira coluna mostra apenas a label "Total"
    if (index === 1) {
      sums[index] = `Total ${data.length}`
      return
    }

    // Verifica se a coluna é a que contém o StockQuantity
    if (column.property === 'StockQuantity') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const total = data.reduce((acc: any, item: any) => {
        // item.StockQuantity ou 0 se for undefined
        return acc + (Number(item.StockQuantity) || 0)
      }, 0)
      sums[index] = total
    } else {
      // Para as demais colunas, deixamos vazio
      sums[index] = ''
    }
  })

  return sums
}
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: { ExpirationDate: string; Name: string }
  rowIndex: number
}) => {
  const today = dayjs() // Data atual
  const expirationDate = dayjs(row.ExpirationDate)

  console.log(row.Name, {
    diff: expirationDate.diff(today, 'day'),
  })

  // Verifica se a data de validade já passou
  if (expirationDate.isBefore(today, 'day')) {
    return 'danger-row' // Expirado
  }

  // Verifica se está faltando 1 mês para expirar
  if (expirationDate.diff(today, 'day') <= 30) {
    return 'danger-row' // Expirado
  }

  // Verifica se está faltando 2 meses para expirar
  if (expirationDate.diff(today, 'day') <= 60) {
    return 'yellow-row'
  }

  return '' // Sem classe específica
}

const currentPage = ref(1)
const pageSize = ref(5)
const key = ref(0)
const isLoading = ref(true)

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
  return dayjs.utc(date).format('DD/MM/YYYY')
}

const handleClose = () => {
  dialogVisible.value = false
}

// Remove uma linha da tabela
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteRow = async (index: number, row: any) => {
  ElMessageBox.confirm('Tem certeza que deseja deletar esse item?')
    .then(async () => {
      await fetch(`https://naked-eydie-bellos-tech-3517c645.koyeb.app/products/${row.ID}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...row, Category: 'deleted' }),
      })

      ElMessage({
        message: 'Produto removido com sucesso!',
        type: 'success',
      })

      tableData.value = [...tableData.value].filter((item) => item.ID !== row.ID)

      backupData = [...tableData.value]
    })
    .catch(() => {
      // catch error
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAddItem = async (product: any) => {
  dialogVisible.value = false

  if (product) {
    const rawResponse = await fetch('https://naked-eydie-bellos-tech-3517c645.koyeb.app/products', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    const content = await rawResponse.json()

    ElMessage({
      message: 'Produto adicionado com sucesso!',
      type: 'success',
    })

    product.ID = content.id

    tableData.value.push(product as never)

    backupData = [...tableData.value]
  }
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

const handleSearch = () => {
  tableData.value = [...backupData].filter((item) =>
    item.Name?.toLowerCase().includes(search.value.toLowerCase()),
  )
}

const clearFilters = () => {
  currentPage.value = 1 // Reseta a página
  tableData.value = [...backupData]
}

onMounted(async () => {
  const rawResponse = await fetch('https://naked-eydie-bellos-tech-3517c645.koyeb.app/products', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  tableData.value = [...(await rawResponse.json())].filter((item) => item.Category !== 'deleted')
  backupData = [...tableData.value]
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.product {
  &__header {
    margin-bottom: 2rem;

    & > button {
      margin-left: 10px;
    }
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
.warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
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
