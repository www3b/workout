<script setup lang="ts">
import {h, resolveComponent} from "vue";
import type {TableColumn} from '@nuxt/ui'
import {useApiFetch} from "~/composables/useApiFetch";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
}

definePageMeta({
  layout: 'crm',
});

const UButton = resolveComponent('UButton');

const { $api } = useNuxtApp();
const {data, pending} = useApiFetch<{users: User[]}>('/users');

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({row}) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({row}) => {
      const userId = row.getValue('id');

      return [
        h(UButton, {
          color: 'neutral',
          size: 'xs',
          icon: 'heroicons:pencil',
          onClick: () => console.log('edit ' + userId) // replace with real function
        }),
        h(UButton, {
          color: 'error',
          size: 'xs',
          icon: 'heroicons:trash',
          onClick: () => console.log('delete ' + userId) // replace with real function
        }),
      ];
    }
  }
];

const addUser = async () => {
  try {
    const response = await $api('/users', {
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        role: 'user'
      }
    });

    console.log(response);
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Users"/>
      <UPageBody>
        <UButton @click="addUser" color="primary">Add User</UButton>
        <UTable :loading="pending" :columns="columns" :data="data?.users"/>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped>

</style>
