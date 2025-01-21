<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section class="login">
    <div class="login__form">
      <div>
        <img style="width: 200px" src="@/assets/logo.png" alt="Element logo" />
        <el-form style="max-width: 600px" label-width="auto" label-position="top">
          <el-form-item label="Email">
            <el-input v-model="email" />
          </el-form-item>
          <el-form-item label="Senha">
            <el-input v-model="password" />
          </el-form-item>
        </el-form>
        <el-button type="primary" plain @click="handleLogin">Login</el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router' // Importa o roteador

// Referências para email, senha e mensagens de erro
const email = ref('')
const password = ref('')
const error = ref('')

// Store do usuário
const userStore = useUserStore()
const router = useRouter() // Instância do roteador

async function handleLogin() {
  try {
    await userStore.login(email.value, password.value)
    ElMessage({
      message: 'Login efetuado com sucesso!',
      type: 'success',
    })
    router.push('/storage') // Redireciona para a rota /storage
  } catch (err) {
    ElMessage.error('Erro ao efetuar login')
    error.value = 'Login failed. Please check your credentials.'
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  width: 100vw;
  display: flex;

  &__image {
    width: 60%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* Faz a imagem cobrir todo o espaço da div sem distorções */
    }
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 2rem;
    padding-left: 2rem;

    & > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .el-form {
        width: 100%;
      }

      .el-button {
        width: 100%;
        max-width: 600px;
      }
    }
  }
}
</style>
