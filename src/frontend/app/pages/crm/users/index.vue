<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { useApiFetch } from "~/composables/useApiFetch";
import UserModal from "~/components/modals/UserModal.vue";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

definePageMeta({
  layout: "crm",
});

const UButton = resolveComponent("UButton");

const { $api } = useNuxtApp();
const { data, pending, refresh } = useApiFetch<{ users: User[] }>("/users");
const toast = useToast();

const columns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userId = row.getValue("id") as number;

      return [
        h(UButton, {
          class: "mx-1",
          color: "neutral",
          size: "xs",
          icon: "heroicons:pencil",
          disabled: true,
          onClick: () => deleteUser(userId), // replace with real function
        }),
        h(UButton, {
          class: "mx-1",
          color: "error",
          size: "xs",
          icon: "heroicons:trash",
          onClick: () => deleteUser(userId), // replace with real function
        }),
      ];
    },
  },
];

async function deleteUser(userId: number) {
  const response = await $api(`/users/${userId}`, {
    method: "DELETE",
  });

  toast.add({
    title: "Success",
    description: `User with id #${userId} been deleted.`,
    color: "success",
  });

  refresh();
}
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Users" />
      <UPageBody>
        <UserModal @created="refresh">
          <UButton color="primary">Add User</UButton>
        </UserModal>
        <UTable :loading="pending" :columns="columns" :data="data?.users" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
