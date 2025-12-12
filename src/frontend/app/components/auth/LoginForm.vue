<template>
  <div class="max-w-md mx-auto">
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold text-center">Login</h2>
      </template>

      <UForm :state="form" :validate="validate" @submit="handleSubmit">
        <UFormGroup label="Email" name="email" class="mb-4">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mb-6">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
          />
        </UFormGroup>

        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          class="mb-4"
        >
          {{ error }}
        </UAlert>

        <UButton
          type="submit"
          color="primary"
          variant="solid"
          size="lg"
          :loading="loading"
          :disabled="loading"
          block
        >
          Login
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink to="/register" class="text-primary-600 hover:text-primary-700">
              Register here
            </NuxtLink>
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import {useAuth} from "~~/app/composables/useAuth";

const { login, loading, error } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const validate = (state: typeof form) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const handleSubmit = async () => {
  try {
    await login(form)
    await router.push('/dashboard')
  } catch (err) {
    // Error is handled by the useAuth composable
  }
}
</script>
