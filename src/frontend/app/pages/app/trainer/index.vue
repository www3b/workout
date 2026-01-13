<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'app',
})

const { user, loggedIn, logout, getProfile } = useAuth()
const { user: abc } = useAuthStore();

const refreshUserData = async () => {
  try {
    await getProfile()
  } catch (error) {
    console.error('Failed to refresh user profile:', error)
  }
}

const handleLogout = async () => {
  await logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <UButton @click="handleLogout" color="neutral" variant="soft">
            Logout
          </UButton>
        </div>

        <!-- Debug Info -->
        <UCard class="mb-4">
          <template #header>
            <h2 class="text-lg font-semibold">Debug Info</h2>
          </template>
          <div class="space-y-2 text-sm">
            <p><strong>User data:</strong> {{ JSON.stringify(user, null, 2) }}</p>
            <p><strong>Is authenticated:</strong> {{ loggedIn }}</p>
          </div>
        </UCard>

        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">User Profile</h2>
          </template>

          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Name</p>
              <p class="text-lg text-white-900">{{ user?.name || 'No name' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Email</p>
              <p class="text-lg text-white-900">{{ user?.email || 'No email' }}</p>
            </div>
            <div v-if="!user" class="text-sm text-red-500">
              User data is not loaded. Click refresh to fetch.
            </div>
            <UButton @click="refreshUserData" color="neutral" variant="soft" size="sm">
              Refresh User Data
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Welcome to Your Dashboard</h2>
          </template>

          <div class="text-center py-8">
            <p class="text-gray-600 mb-4">
              You are successfully authenticated with Laravel Sanctum!
            </p>
            <p class="text-sm text-gray-500">
              This is a protected route that requires authentication.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
