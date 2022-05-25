<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <!-- Delete dialog confirmation  -->
      <ConfirmDialog></ConfirmDialog>
      <div id="welcomeuser">
        <p class="text-center">Hi, {{ user.first_name }}</p>
        <Button
          label="New Project"
          icon="pi pi-plus"
          class="mr-2"
          id="new-project"
          @click="newProject()"
        />
      </div>
      <Message v-if="errors.message" severity="error" :closable="false">{{
        errors.message
      }}</Message>
      <div>
        <!-- Projects Table -->
        <DataTable :value="userProjects">
          <template #empty> No records found </template>
          <template #loading> Loading records, please wait... </template>
          <template #header>
            <div>List of Projects</div>
          </template>
          <Column field="name" header="Name" sortable></Column>
          <Column field="stakeholder" header="Stakeholder" sortable></Column>
          <Column header="Leader">
            <template #body="{ data }">
              <img
                :alt="data.leader.first_name"
                :src="data.leader.avatar"
                width="32"
                style="vertical-align: middle; margin-right: 4px"
              />
              <span class="image-text">{{ data.leader.email }}</span>
            </template>
          </Column>

          <Column header="Actions">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-info mx-2"
                @click="viewProject(slotProps.data._id)"
              />&nbsp;
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mx-2"
                @click="editProject(slotProps.data._id, slotProps.data.leader)"
              />&nbsp;
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="deleteProject(slotProps.data._id, slotProps.data.name)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import usercrud from '../modules/usercrud';
import { useConfirm } from 'primevue/useconfirm';
import projectcrud from '../modules/projectcrud';
import utils from '../modules/utils';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name: 'HomeView',
  setup() {
    const confirm = useConfirm();
    const router = useRouter();
    const { user, GetUser } = usercrud();
    const { GetProjectsByUser, userProjects, GetAllProjects, DeleteProject } =
      projectcrud();
    const { isUserLoggedIn, isUserAdmin } = utils();
    const errors = reactive({
      message: '',
    });
    const newProject = () => {
      router.push('/project/new');
    };
    const viewProject = (projectId) => {
      // project id
      router.push('/project/' + projectId);
    };
    const editProject = (projectId, leader) => {
      //check if user is leader or admin before proceeding
      if (UserHasProjectRights(leader)) {
        //redirect to project edit
        router.push('/project/edit/' + projectId);
      } else {
        // Error message
        errors.message = 'To edit this project you must be a Leader or Admin';
      }
    };
    onMounted(() => {
      // If user is logged in, we get the data
      if (isUserLoggedIn()) {
        GetUser();
        // use role > user projects · admin role > all projects
        isUserAdmin() ? GetAllProjects() : GetProjectsByUser();
      }
    });
    const UserHasProjectRights = (leader) => {
      // We empty the errors message value
      errors.message = '';
      if (
        leader._id == localStorage.getItem('user_id') ||
        localStorage.getItem('role') == 'admin'
      ) {
        // User is leader of the project or admin
        return true;
      } else {
        return false;
      }
    };
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

    const deleteProject = (projectId, projectName) => {
      confirm.require({
        message: 'Are you sure that you want to delete it?',
        header: 'Deleting ' + projectName,
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
          DeleteProject(projectId);
          // Reload data
          GetAllProjects();
        },
        reject: () => {},
      });
    };

    return {
      user,
      userProjects,
      newProject,
      viewProject,
      deleteProject,
      editProject,
      items,
      errors,
    };
  },
};
</script>

<style>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rcolumn {
  margin: 27px 100px;
  height: 100%;
  min-height: 100%;
  flex: auto;
  width: auto;
}
#welcomeuser {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#welcomeuser p {
  color: white;
  font-size: 20px;
}
</style>
