<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/authenticated',
  },
})

const { loading, login } = useKeycloak()

const form = reactive({
  username: '',
  password: '',
})

const isValid = computed(() => Boolean(form.username) && Boolean(form.password))

const onSubmit = async () => {
  if (!isValid.value) {
    alert('Username & password are requried')
    return
  }

  try {
    await login({ ...form }, '/authenticated')
  }
  catch (e: any) {
    alert(e)
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-50">
    <div class="w-[480px] border rounded shadow-sm py-6 px-8 space-y-6 bg-white">
      <p class="text-center font-bold text-3xl select-none text-gray-700">
        Nuxt <span class="text-blue-600">Keycloak</span>
      </p>

      <form
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          class="border rounded-sm py-1.5 px-2.5 w-full"
        >

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="border rounded-sm py-1.5 px-2.5 w-full"
        >

        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 font-semibold rounded-sm py-1.5 px-2.5 w-full text-white transition hover:opacity-75"
        >
          {{ loading ? 'Loading...' : 'Log In' }}
        </button>
      </form>
    </div>
  </div>
</template>
