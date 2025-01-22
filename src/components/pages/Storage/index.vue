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
    :row-class-name="tableRowClassName"
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
        <!-- <el-button link type="primary" size="small">Editar</el-button> -->
        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)"
          >Remover</el-button
        >
      </template>
    </el-table-column>
  </el-table>
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
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import ProductCreate from '@/components/organisms/ProductCreate/index.vue'

const dialogVisible = ref(false)

// Dados fornecidos
const tableData = ref([])

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: { ExpirationDate: string }
  rowIndex: number
}) => {
  const today = dayjs() // Data atual
  const expirationDate = dayjs(row.ExpirationDate)

  // Verifica se a data de validade já passou
  if (expirationDate.isBefore(today, 'day')) {
    return 'danger-row' // Expirado
  }

  // Verifica se está faltando 1 mês para expirar
  if (expirationDate.diff(today, 'month') === 1) {
     return 'warning-row' // Expirado
  }

  // Verifica se está faltando 2 meses para expirar
  if (expirationDate.diff(today, 'month') === 2) {
    return 'yellow-row'
  }

  return '' // Sem classe específica
}

const currentPage = ref(1)
const pageSize = ref(5)
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
  return dayjs(date).format('DD/MM/YYYY')
}

const handleClose = () => {
  dialogVisible.value = false
}

// Remove uma linha da tabela
const deleteRow = async (index: number) => {
  const actualIndex = (currentPage.value - 1) * pageSize.value + index

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = tableData.value[actualIndex] as any

  await fetch(`https://naked-eydie-bellos-tech-3517c645.koyeb.app/products/${product.ID}`, {
  method: 'DELETE',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
});


  tableData.value.splice(actualIndex, 1)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAddItem = async (product: any) => {
  dialogVisible.value = false

  if(product) {
    const rawResponse = await fetch('https://naked-eydie-bellos-tech-3517c645.koyeb.app/products', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    const content = await rawResponse.json();
    tableData.value.push(product as never)
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

onMounted(async () => {
    const rawResponse = await fetch('https://naked-eydie-bellos-tech-3517c645.koyeb.app/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });

    tableData.value = await rawResponse.json();
    isLoading.value = false
})
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
</style>