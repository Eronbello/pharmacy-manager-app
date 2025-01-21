<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row class="row-bg customer__header" justify="space-between">
    <el-text class="mb-1" size="large">Clientes</el-text>
    <el-button type="primary" @click="onAddItem">Adicionar cliente</el-button>
  </el-row>
  <el-table border :data="tableData" style="width: 100%" max-height="400">
    <el-table-column prop="first_name" label="first_name" />
    <el-table-column prop="last_name" label="last_name" />
    <el-table-column prop="email" label="email" />
    <el-table-column prop="phone_number" label="phone_number"> </el-table-column>
    <el-table-column fixed="right" label="Operations">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
          Edit
        </el-button>
        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const now = new Date()

const tableData = ref([
  {
    date: '1991-01-11',
    name: 'James',
    first_name: 'Lynn',
    last_name: 'Daniel',
    address: '75482 Michelle Row\nHuynhberg, IA 52988',
    email: 'eric16@hotmail.com',
    phone_number: '41 33461486',
  },
  {
    date: '2017-05-19',
    name: 'Luis',
    first_name: 'Timothy',
    last_name: 'Cooper',
    address: '36528 Spencer Turnpike Apt. 969\nPort Timothyhaven, MI 57961',
    email: 'harmontracey@harris.com',
    phone_number: '41 33461486',
  },
  {
    date: '2001-05-19',
    name: 'Brett',
    first_name: 'George',
    last_name: 'Anderson',
    address: 'USS Long\nFPO AA 71986',
    email: 'npatel@ellis.com',
    phone_number: '41 33461486',
  },
  {
    date: '2018-10-13',
    name: 'Mitchell',
    first_name: 'Jennifer',
    last_name: 'Thompson',
    address: '143 Turner Glen Apt. 883\nChristopherberg, KS 99796',
    email: 'erin87@hotmail.com',
    phone_number: '41 33461486',
  },
  {
    date: '2004-12-03',
    name: 'Gabriel',
    first_name: 'Raymond',
    last_name: 'Leon',
    address: '43917 Mercer Ville\nWilsonside, WA 28792',
    email: 'gibsonmichael@wang-jones.com',
    phone_number: '41 33461486',
  },
  {
    date: '1972-01-19',
    name: 'Elizabeth',
    first_name: 'Lisa',
    last_name: 'Howard',
    address: '63197 Dunlap Plaza Suite 915\nMartinezburgh, OH 43621',
    email: 'zgarcia@lane.com',
    phone_number: '41 33461486',
  },
  {
    date: '1998-06-12',
    name: 'Joshua',
    first_name: 'Eric',
    last_name: 'Weber',
    address: 'Unit 9142 Box 5947\nDPO AA 25546',
    email: 'montoyastacie@ortiz-holland.com',
    phone_number: '41 33461486',
  },
  {
    date: '2004-03-30',
    name: 'Donna',
    first_name: 'Karen',
    last_name: 'Yates',
    address: '5902 Hill Vista\nRichardsfurt, OR 23349',
    email: 'shaunmay@daniel-sharp.org',
    phone_number: '41 33461486',
  },
  {
    date: '2000-02-19',
    name: 'Antonio',
    first_name: 'Ronald',
    last_name: 'King',
    address: '9375 Garcia Road\nTimothymouth, CO 56103',
    email: 'vherrera@middleton-reed.com',
    phone_number: '41 33461486',
  },
  {
    date: '1974-09-03',
    name: 'Austin',
    first_name: 'Samantha',
    last_name: 'Cervantes',
    address: '75518 Erica Orchard Suite 364\nMarkchester, OR 27556',
    email: 'brandi37@gmail.com',
    phone_number: '41 33461486',
  },
])

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const onAddItem = () => {
  now.setDate(now.getDate() + 1)
  tableData.value.push({
    date: dayjs(now).format('YYYY-MM-DD'),
    name: 'Tom',
    first_name: 'California',
    last_name: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    email: 'CA 90036',
    phone_number: '41 33461486',
  })
}
</script>

<style lang="scss" scoped>
.customer {
  &__header {
    margin-bottom: 2rem;
  }
}
</style>
