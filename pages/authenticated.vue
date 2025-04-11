<script setup lang="ts">
const { loading, user, logout } = useKeycloak()
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div
      class="w-[480px] border rounded shadow-sm py-6 px-8 space-y-6"
    >
      <div
        v-if="!loading && user"
        class="space-y-2"
      >
        <p class="text-center">
          {{ user.sub }}
        </p>

        <p class="text-center">
          Welcome, <span class="font-medium">{{ user.name }}</span> ({{ user.email }})
        </p>
      </div>

      <button
        type="button"
        :disabled="loading"
        class="bg-blue-600 font-semibold rounded-sm py-1.5 px-2.5 w-full text-white transition hover:opacity-75"
        @click="logout('/login')"
      >
        Log Out
      </button>
    </div>
  </div>
</template>
