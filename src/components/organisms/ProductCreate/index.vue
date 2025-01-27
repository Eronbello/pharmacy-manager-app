<!-- eslint-disable vue/multi-word-component-names -->
<!-- ProductCreateForm.vue -->
<template>
  <el-form :model="formProduct" class="demo-form-inline" label-positions="left" size="large">
    <!-- Nome do Produto (autocomplete) -->
    <el-form-item label="Nome do Produto">
      <el-autocomplete
        v-model="productName"
        :fetch-suggestions="fetchNameSuggestions"
        placeholder="Digite o nome do produto"
        @select="handleSelectProduct"
        @blur="handleBlurProduct"
        clearable
      />
    </el-form-item>

    <!-- Descrição -->
    <el-form-item label="Descrição">
      <el-input v-model="formProduct.Description" placeholder="Descrição do Produto" clearable />
    </el-form-item>

    <!-- Quantidade em Estoque -->
    <el-form-item label="Quantidade em Estoque">
      <el-input-number v-model="formProduct.StockQuantity" placeholder="Quantidade" :min="0" />
    </el-form-item>

    <!-- Fabricante (autocomplete) -->
    <el-form-item label="Fabricante">
      <el-autocomplete
        v-model="formProduct.Manufacturer"
        :fetch-suggestions="fetchManufacturerSuggestions"
        placeholder="Digite o fabricante"
        @select="handleSelectManufacturer"
        clearable
      />
    </el-form-item>

    <!-- Data de Validade (type="month") -->
    <el-form-item label="Data de Validade">
      <el-date-picker
        v-model="formProduct.ExpirationDate"
        type="month"
        format="MM-YYYY"
        placeholder="Data de Validade"
        clearable
      />
    </el-form-item>

    <!-- Número do Lote -->
    <el-form-item label="Número do Lote">
      <el-input v-model="formProduct.BatchNumber" placeholder="Número do Lote" clearable />
    </el-form-item>

    <!-- Botões de Ação -->
    <el-form-item class="product-create__footer">
      <div class="product-create__footer">
        <el-button @click="onCancel">Cancelar</el-button>
        <el-button type="primary" @click="onSubmit">Salvar Produto</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
/* ------------------------------------------------------------------
   IMPORTS E TIPAGENS
   ------------------------------------------------------------------ */
import { reactive, defineEmits, defineProps, ref, onMounted } from 'vue'

// Interface para um Produto (o que vai ser salvo/enviado)
interface Product {
  Name: string
  Description: string
  StockQuantity: number
  Manufacturer: string
  ExpirationDate: string
  BatchNumber: string
}

// Interface para cada item vindo de props.items
interface Item {
  Name: string
  Manufacturer: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // caso tenha outros campos
}

// Interface para sugestões usadas no Autocomplete
interface Suggestion {
  value: string
}

const emit = defineEmits(['onAddItem', 'onCancel'])

/* ------------------------------------------------------------------
   PROPRIEDADES (PROPS)
   ------------------------------------------------------------------ */
const props = defineProps<{
  items: Item[]
}>()

/* ------------------------------------------------------------------
   ESTADO REATIVO
   ------------------------------------------------------------------ */
const formProduct = reactive<Product>({
  Name: '',
  Description: '',
  StockQuantity: 0,
  Manufacturer: '',
  ExpirationDate: '',
  BatchNumber: '',
})

// Para autocomplete de Nome do Produto
const productName = ref<string>('') // Para exibir no el-autocomplete
const productSuggestions = ref<Suggestion[]>([])

// Para autocomplete de Fabricante
const manufacturerSuggestions = ref<Suggestion[]>([])

/* ------------------------------------------------------------------
   FUNÇÕES DE UTILIDADE
   ------------------------------------------------------------------ */
/** Reseta o formulário para o estado inicial. */
function resetForm() {
  formProduct.Name = ''
  formProduct.Description = ''
  formProduct.StockQuantity = 0
  formProduct.Manufacturer = ''
  formProduct.ExpirationDate = ''
  formProduct.BatchNumber = ''

  productName.value = ''
}

/**
 * Filtra as sugestões a partir do termo de busca.
 * @param suggestions - Lista de sugestões
 * @param query       - Texto digitado
 * @return Array de sugestões filtradas
 */
function filterSuggestions(suggestions: Suggestion[], query: string) {
  const q = query.toLowerCase()

  return suggestions.filter((item) => item.value.toLowerCase().includes(q))
}

/** Função para remover duplicatas (baseado no 'value' da Suggestion). */
function removeDuplicateSuggestions(arr: Suggestion[]) {
  const unique = new Set(arr.map((item) => item.value))
  return Array.from(unique).map((val) => arr.find((item) => item.value === val)!)
}

/* ------------------------------------------------------------------
   LÓGICA DE MONTA (onMounted)
   ------------------------------------------------------------------ */
onMounted(() => {
  // Monta as sugestões de Nomes (baseadas em 'Name')
  const nameArray = props.items?.map((item) => ({
    value: item.Name,
  }))
  productSuggestions.value = removeDuplicateSuggestions(nameArray)

  // Monta as sugestões de Fabricantes (baseadas em 'Manufacturer')
  const manufacturerArray = props.items?.map((item) => ({
    value: item.Manufacturer,
  }))
  manufacturerSuggestions.value = removeDuplicateSuggestions(manufacturerArray)
})

/* ------------------------------------------------------------------
   AUTOCOMPLETE - Nome do Produto
   ------------------------------------------------------------------ */
/**
 * Busca sugestões para o nome do produto.
 * @param queryString - termo digitado
 * @param cb          - callback para retornar o resultado
 */
function fetchNameSuggestions(queryString: string, cb: (results: Suggestion[]) => void) {
  if (!queryString) {
    // Se não tem texto, retorna até 10 primeiros
    cb(productSuggestions.value.slice(0, 10))
    return
  }

  const filtered = filterSuggestions(productSuggestions.value, queryString)
  cb(filtered.slice(0, 10))
}

/** Ao selecionar uma sugestão de Nome */
function handleSelectProduct(item: Suggestion) {
  productName.value = item.value
  formProduct.Name = item.value
}

/** Ao sair do campo (blur), confirmar valor no formProduct */
function handleBlurProduct() {
  formProduct.Name = productName.value
}

/* ------------------------------------------------------------------
   AUTOCOMPLETE - Fabricante
   ------------------------------------------------------------------ */
function fetchManufacturerSuggestions(queryString: string, cb: (results: Suggestion[]) => void) {
  if (!queryString) {
    cb(manufacturerSuggestions.value.slice(0, 10))
    return
  }

  const filtered = filterSuggestions(manufacturerSuggestions.value, queryString)
  cb(filtered.slice(0, 10))
}

/** Ao selecionar um Fabricante */
function handleSelectManufacturer(item: Suggestion) {
  formProduct.Manufacturer = item.value
}

/* ------------------------------------------------------------------
   EVENTOS DO FORMULÁRIO
   ------------------------------------------------------------------ */
/** Ao enviar o formulário */
function onSubmit() {
  emit('onAddItem', { ...formProduct })
  resetForm()
}

/** Ao cancelar o formulário */
function onCancel() {
  emit('onCancel')
  resetForm()
}
</script>

<style scoped>
.demo-form-inline {
  width: 100%;
}

.demo-form-inline .el-form-item {
  width: 100%;
}

/* Ajustes de largura para input, select e number */
.demo-form-inline .el-input,
.demo-form-inline .el-select,
.demo-form-inline .el-input-number {
  --el-input-width: 100%;
  --el-select-width: 100%;
  --el-input-number-width: 100%;
}

.product-create__footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
