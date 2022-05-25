<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <div id="page-title">
        <p>Edit Project</p>
      </div>
      <div id="project-form-section" class="mt1">
        <form
          @submit.prevent="handleEditProjectSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <Message v-if="errors.message" severity="error" :closable="false">{{
            errors.message
          }}</Message>
          <!-- Name, Description and Stakeholder -->
          <Panel header="Basic Information" class="mb1">
            <div id="basic-info-section" class="formgrid grid flex">
              <!-- Name -->
              <div class="field col mr2">
                <p>
                  <i>{{ project.name }}</i>
                </p>
                <label for="name">Name</label>
                <InputText
                  id="name"
                  type="text"
                  v-model="editProject.name"
                  :class="{ 'p-invalid': errors.name && submitted }"
                />
              </div>
              <!-- Description -->
              <div class="field col mr2">
                <p>
                  <i>{{ project.description }}</i>
                </p>
                <label for="description">Description</label>
                <Textarea
                  id="description"
                  v-model="editProject.description"
                  :autoResize="true"
                  rows="1"
                  cols="30"
                  :class="{ 'p-invalid': errors.description && submitted }"
                />
              </div>
              <!-- Stakeholder -->
              <div class="field col">
                <p>
                  <i>{{ project.stakeholder }}</i>
                </p>
                <label for="stakeholder">Stakeholder</label>
                <InputText
                  id="stakeholder"
                  type="text"
                  v-model="editProject.stakeholder"
                  :class="{ 'p-invalid': errors.stakeholder && submitted }"
                />
              </div>
            </div>
          </Panel>

          <!-- Time Schedule -->
          <Panel header="Time Schedule" class="mb1">
            <div id="time-schedule-section" class="formgrid grid flex">
              <div class="field col mr2 w10">
                <p>
                  <i>{{ timeSchedule.spent_hours }}</i>
                </p>
                <label for="spent_hours">Spent hours</label>
                <InputNumber
                  id="spent_hours"
                  v-model="editProject.time_schedule.spent_hours"
                  :class="{ 'p-invalid': errors.spent_hours && submitted }"
                />
              </div>
              <!-- Start date -->
              <div class="field col mr2">
                <p>
                  <i
                    >{{
                      moment(timeSchedule.start_date).format('DD/MM/YYYY hh:mm')
                    }}
                  </i>
                </p>
                <label for="start_date">Start date</label>
                <Calendar
                  id="start_date"
                  v-model="editProject.time_schedule.start_date"
                  :showTime="true"
                  :showSeconds="true"
                  :showIcon="true"
                  :class="{ 'p-invalid': errors.start_date && submitted }"
                />
              </div>
              <!-- End date -->
              <div class="field col mr2">
                <p>
                  <i>{{
                    moment(timeSchedule.end_date).format('DD/MM/YYYY hh:mm')
                  }}</i>
                </p>
                <label for="end_date">End date</label>
                <Calendar
                  id="end_date"
                  v-model="editProject.time_schedule.end_date"
                  :showTime="true"
                  :showSeconds="true"
                  :showIcon="true"
                  :class="{ 'p-invalid': errors.end_date && submitted }"
                />
              </div>
              <!-- Due date -->
              <div class="field col mr2">
                <p>
                  <i>{{
                    moment(timeSchedule.due_date).format('DD/MM/YYYY hh:mm')
                  }}</i>
                </p>
                <label for="due_date">Due date</label>
                <Calendar
                  id="due_date"
                  v-model="editProject.time_schedule.due_date"
                  :showTime="true"
                  :showSeconds="true"
                  :showIcon="true"
                  :class="{ 'p-invalid': errors.due_date && submitted }"
                />
              </div>
              <div class="field col mt-auto">
                <Button
                  type="submit"
                  label="Submit"
                  class="p-button p-button-success submit-btn"
                />
              </div>
            </div>
          </Panel>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../modules/utils';
import projectcrud from '../modules/projectcrud';
var moment = require('moment'); // date formatting package
import { reactive, ref, onMounted, onBeforeMount } from 'vue';
export default {
  name: 'EditProject',
  setup() {
    const { GetProjectById, requestError, project, timeSchedule, EditProject } =
      projectcrud();
    const { isUserAdmin } = utils();

    const editProject = reactive({
      //The leader is set in the backend (user creating the project)
      name: '',
      description: '',
      stakeholder: '',
      time_schedule: {
        start_date: '',
        due_date: '',
        end_date: '',

        spent_hours: '',
      },
    });
    const errors = reactive({
      //The leader is set in the backend (user creating the project)
      name: '',
      description: '',
      stakeholder: '',
      start_date: '',
      due_date: '',
      end_date: '',
      spent_hours: '',

      message: '',
    });
    const submitted = ref(false);

    GetProjectById(); // We need the project info
    onMounted(() => {});
    onBeforeMount(() => {});

    const handleEditProjectSubmit = async () => {
      resetErrors();
      submitted.value = true;
      const projectToUpdate = prepareProjectToUpdate();
      EditProject(projectToUpdate);
      if (requestError) errors.message = requestError;
    };
    const resetErrors = () => {
      (errors.name = ''),
        (errors.description = ''),
        (errors.stakeholder = ''),
        (errors.start_date = ''),
        (errors.due_date = ''),
        (errors.end_date = ''),
        (errors.message = '');
      submitted.value = false;
    };

    let prepareProjectToUpdate = () => {
      let data = {};
      if (editProject.name && editProject.name != '') {
        data.name = editProject.name;
      }
      if (editProject.description && editProject.description != '') {
        data.description = editProject.description;
      }
      if (editProject.stakeholder && editProject.stakeholder != '') {
        data.stakeholder = editProject.stakeholder;
      }

      data.time_schedule = {
        estimated_hours: timeSchedule.value.estimated_hours,
        spent_hours: editProject.time_schedule.spent_hours
          ? editProject.time_schedule.spent_hours
          : timeSchedule.value.spent_hours,
        start_date: editProject.time_schedule.start_date
          ? editProject.time_schedule.start_date.toISOString()
          : timeSchedule.value.start_date,
        end_date: editProject.time_schedule.end_date
          ? editProject.time_schedule.end_date.toISOString()
          : timeSchedule.value.end_date,
        due_date: editProject.time_schedule.due_date
          ? editProject.time_schedule.due_date.toISOString()
          : timeSchedule.value.due_date,
      };

      return data;
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

    return {
      items,
      editProject,
      handleEditProjectSubmit,
      errors,
      submitted,
      project,
      timeSchedule,
      moment,
    };
  },
};
</script>

<style scoped>
#basic-info-section,
#time-schedule-section,
#basic-info-section-desc {
  display: flex;
}
#basic-info-section {
  justify-content: center;
}

.mr1 {
  margin-right: 1.5em;
}
.mr2 {
  margin-right: 2em;
}
.mb1 {
  margin-bottom: 1.2em;
}
.mt1 {
  margin-top: 1em;
}
.w10 {
  width: 11%;
}
.align-center {
  align-items: center;
}

.mt-auto {
  margin-top: auto;
}
.error-text {
  color: red;
}
</style>
