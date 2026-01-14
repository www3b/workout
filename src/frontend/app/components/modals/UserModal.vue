<script setup lang="ts">
import * as z from "zod";
type FormSubmitEvent<T> = SubmitEvent & { data: T };

const schema = z.object({
  name: z.string("Name is required").min(2, "Must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}
</script>

<template>
  <SimpleModal :is-open="true" title="User Details">
    <slot />
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" class="mb-4" />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" class="mb-4" />
        </UFormField>
        <UFormField label="Password" name="password" required>
          <UInput v-model="state.password" class="mb-4" />
        </UFormField>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </template>
  </SimpleModal>
</template>
