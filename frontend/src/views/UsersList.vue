<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <div>
        <!-- Projects Table -->
        <DataTable :value="users">
          <template #empty> No records found </template>
          <template #loading> Loading records, please wait... </template>
          <template #header>
            <div>List of Users</div>
          </template>
          <Column field="email" header="Email" sortable></Column>
          <Column field="role" header="Role" sortable></Column>
          <Column field="avatar" header="Avatar">
            <template #body="{ data }">
              <img
                alt="user avatar"
                :src="data.avatar"
                width="32"
                style="vertical-align: middle; margin-right: 4px"
              />
            </template>
          </Column>
          <Column field="registration_date" header="Registration Date" sortable>
            <template #body="{ data }">
              {{ moment(data.registration_date).format('DD/MM/YYYY hh:mm') }}
            </template>
          </Column>
          <Column field="weekly_hours" header="Weekly hours" sortable></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../modules/utils';
import usercrud from '../modules/usercrud';
import { onMounted } from 'vue';
export default {
  name: 'UsersList',
  setup() {
    const { isUserAdmin } = utils();
    const { users, GetAllUsers } = usercrud();
    var moment = require('moment'); // date formatting package
    onMounted(() => {});
    GetAllUsers();
    // Menu
    const items = [
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        to: '/settings',
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        to: '/users',
        visible: () => isUserAdmin(),
      },
      {
        label: 'Projects',
        icon: 'pi pi-th-large ',
        to: '/',
      },
    ];

    return {
      items,
      users,
      moment,
    };
  },
};
</script>

<style></style>
