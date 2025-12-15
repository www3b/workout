<template>
  <div class="max-w-md mx-auto">
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold text-center">Register</h2>
      </template>

      <UForm :state="form" :validate="validate" @submit="handleSubmit">
        <UFormField label="Name" name="name" class="mb-4">
          <UInput
            v-model="form.name"
            type="text"
            placeholder="Enter your name"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Email" name="email" class="mb-4">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Password" name="password" class="mb-4">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Confirm Password" name="password_confirmation" class="mb-6">
          <UInput
            v-model="form.password_confirmation"
            type="password"
            placeholder="Confirm your password"
            :disabled="loading"
          />
        </UFormField>

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
          Register
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="text-primary-600 hover:text-primary-700">
              Login here
            </NuxtLink>
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { register, loading, error } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const validate = (state: typeof form) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Name is required' })
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  if (state.password !== state.password_confirmation) {
    errors.push({ path: 'password_confirmation', message: 'Passwords do not match' })
  }
  return errors
}

const handleSubmit = async () => {
  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
    await navigateTo('/dashboard')
  } catch {
    // Error is handled by the useAuth composable
  }
}
</script>
