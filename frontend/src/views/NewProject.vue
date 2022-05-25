<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <Toast />
      <div id="page-title">
        <p>New Project</p>
      </div>
      <div id="project-form-section" class="mt1">
        <form
          @submit.prevent="handleNewProjectSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <Message v-if="errors.message" severity="error" :closable="false">{{
            errors.message
          }}</Message>
          <!-- Name, Description and Stakeholder -->
          <Panel :toggleable="true" header="Basic Information *" class="mb1">
            <div id="basic-info-section" class="formgrid grid flex">
              <!-- Name -->
              <div class="field col mr2">
                <label for="name">Name</label>
                <InputText
                  id="name"
                  type="text"
                  v-model="newProject.name"
                  :class="{ 'p-invalid': errors.name && submitted }"
                />
              </div>
              <!-- Description -->
              <div class="field col mr2">
                <label for="description">Description</label>
                <Textarea
                  id="description"
                  v-model="newProject.description"
                  :autoResize="true"
                  rows="1"
                  cols="30"
                  :class="{ 'p-invalid': errors.description && submitted }"
                />
              </div>
              <!-- Stakeholder -->
              <div class="field col">
                <label for="stakeholder">Stakeholder</label>
                <InputText
                  id="stakeholder"
                  type="text"
                  v-model="newProject.stakeholder"
                  :class="{ 'p-invalid': errors.stakeholder && submitted }"
                />
              </div>
            </div>
          </Panel>

          <!-- List of users to pick as members -->
          <Panel :toggleable="true" header="Members *" class="mb1">
            <div id="members-section">
              <PickList
                v-model="newProjectUsers"
                listStyle="height:120px;margin-bottom: 1em"
                dataKey="_id"
              >
                <template #sourceheader> All Users </template>
                <template #targetheader> Selected Users </template>
                <template #item="slotProps">
                  <div class="product-item">
                    <div class="product-list-detail">
                      <p class="mb-2">{{ slotProps.item.email }}</p>
                    </div>
                  </div>
                </template>
              </PickList>
              <p v-if="errors.members && submitted" class="error-text">
                {{ errors.members }}
              </p>
            </div>
          </Panel>
          <!-- List of technologies to pick-->
          <Panel :toggleable="true" header="Technologies *" class="mb1">
            <div id="technologies-section">
              <PickList
                v-model="formTechnologies"
                listStyle="height:150px"
                dataKey="_id"
              >
                <template #sourceheader> All Technologies </template>
                <template #targetheader> Selected Technologies </template>
                <template #item="slotProps">
                  <div class="product-item">
                    <div class="product-list-detail">
                      <p class="mb-2">{{ slotProps.item.tech_name }}</p>
                    </div>
                  </div>
                </template>
              </PickList>
              <p v-if="errors.technologies && submitted" class="error-text">
                {{ errors.technologies }}
              </p>
            </div>
          </Panel>

          <!-- Time Schedule -->
          <Panel :toggleable="true" header="Time Schedule *" class="mb1">
            <div id="time-schedule-section" class="formgrid grid flex">
              <!-- Estimated hours -->
              <div class="field col mr2 w10">
                <label for="estimated_hours">Estimated hours</label>
                <InputNumber
                  id="estimated_hours"
                  v-model="newProject.time_schedule.estimated_hours"
                  :class="{ 'p-invalid': errors.estimated_hours && submitted }"
                />
              </div>
              <!-- Start date -->
              <div class="field col mr2">
                <label for="start_date">Start date</label>
                <Calendar
                  id="start_date"
                  v-model="newProject.time_schedule.start_date"
                  :showTime="true"
                  :showSeconds="true"
                  :showIcon="true"
                  :class="{ 'p-invalid': errors.start_date && submitted }"
                />
              </div>
              <!-- End date -->
              <div class="field col mr2">
                <label for="end_date">End date</label>
                <Calendar
                  id="end_date"
                  v-model="newProject.time_schedule.end_date"
                  :showTime="true"
                  :showSeconds="true"
                  :showIcon="true"
                  :class="{ 'p-invalid': errors.end_date && submitted }"
                />
              </div>
              <!-- Due date -->
              <div class="field col mr2">
                <label for="due_date">Due date</label>
                <Calendar
                  id="due_date"
                  v-model="newProject.time_schedule.due_date"
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
import usercrud from '../modules/usercrud';
import projectcrud from '../modules/projectcrud';
import technologycrud from '../modules/technologycrud';
import { useToast } from 'primevue/usetoast';
import { reactive, ref, onMounted } from 'vue';
export default {
  name: 'NewProject',
  setup() {
    const { GetAllUsers, newProjectUsers } = usercrud();
    const { CreateNewProject, requestError } = projectcrud();
    const { GetAllTechnologies, formTechnologies } = technologycrud();
    const { isUserAdmin } = utils();
    const toast = useToast();
    const newProject = reactive({
      //The leader is set in the backend (user creating the project)
      name: '',
      description: '',
      stakeholder: '',
      members: [],
      technologies: [],
      time_schedule: {
        start_date: '',
        due_date: '',
        end_date: '',
        estimated_hours: 0,
      },
    });
    const errors = reactive({
      //The leader is set in the backend (user creating the project)
      name: '',
      description: '',
      stakeholder: '',
      members: '',
      technologies: '',
      start_date: '',
      due_date: '',
      end_date: '',
      estimated_hours: '',
      message: '',
    });
    const submitted = ref(false);

    onMounted(() => {
      GetAllUsers();
      GetAllTechnologies();
    });

    const handleNewProjectSubmit = async () => {
      resetErrors();
      submitted.value = true;
      if (areFieldsValid()) {
        // Conversion of dates to ISO 8601 before being stored in the database
        newProject.time_schedule.start_date =
          newProject.time_schedule.start_date.toISOString();
        newProject.time_schedule.end_date =
          newProject.time_schedule.end_date.toISOString();
        newProject.time_schedule.due_date =
          newProject.time_schedule.due_date.toISOString();
        // Prepares the array of technologies with the ids only
        setTechnologies(formTechnologies.value[1]);
        // Prepares the array of members with the ids and other properties
        setMembers(newProjectUsers.value[1]);
        CreateNewProject(newProject);
        if (requestError) errors.message = requestError;
      } else {
        showToastError();
      }
    };
    const resetErrors = () => {
      (errors.name = ''),
        (errors.description = ''),
        (errors.stakeholder = ''),
        (errors.members = ''),
        (errors.technologies = ''),
        (errors.start_date = ''),
        (errors.due_date = ''),
        (errors.end_date = ''),
        (errors.estimated_hours = ''),
        (errors.message = '');
      submitted.value = false;
    };

    let areFieldsValid = () => {
      if (!newProject.name || newProject.name == '') {
        errors.name = 'Name cannot be empty';
        errors.message = errors.name;

        return false;
      } else if (!newProject.description || newProject.description == '') {
        errors.description = 'Description cannot be empty';
        errors.message = errors.description;

        return false;
      } else if (!newProject.stakeholder || newProject.stakeholder == '') {
        errors.stakeholder = 'Stakeholder cannot be empty';
        errors.message = errors.stakeholder;

        return false;
      } else if (
        newProjectUsers.value[1].length == 0 ||
        newProjectUsers.value[1] == []
      ) {
        errors.members = 'Members cannot be empty';
        errors.message = errors.members;

        return false;
      } else if (
        formTechnologies.value[1].length == 0 ||
        formTechnologies.value[1] == []
      ) {
        errors.technologies = 'Technologies cannot be empty';
        errors.message = errors.technologies;

        return false;
      } else if (
        !newProject.time_schedule.estimated_hours ||
        newProject.time_schedule.estimated_hours == ''
      ) {
        errors.estimated_hours = 'Estimated hours cannot be empty';
        errors.message = errors.estimated_hours;
        return false;
      } else if (newProject.time_schedule.estimated_hours <= 0) {
        errors.estimated_hours = 'Estimated hours must be greater than 0';
        errors.message = errors.estimated_hours;
        return false;
      } else if (
        !newProject.time_schedule.start_date ||
        newProject.time_schedule.start_date == ''
      ) {
        errors.start_date = 'Start date cannot be empty';
        errors.message = errors.start_date;
        return false;
      } else if (
        !newProject.time_schedule.end_date ||
        newProject.time_schedule.end_date == ''
      ) {
        errors.end_date = 'End date cannot be empty';
        errors.message = errors.end_date;
        return false;
      } else if (
        !newProject.time_schedule.due_date ||
        newProject.time_schedule.due_date == ''
      ) {
        errors.due_date = 'Due date cannot be empty';
        errors.message = errors.due_date;
        return false;
      } else {
        return true;
      }
    };
    const showToastError = () => {
      toast.add({
        severity: 'warn',
        summary: 'Scroll Top to check error',
        life: 3000,
      });
    };
    const setTechnologies = (technologies) => {
      for (let i = 0; i < technologies.length; i++) {
        newProject.technologies.push(technologies[i]._id);
      }
    };
    const setMembers = (members) => {
      for (let i = 0; i < members.length; i++) {
        newProject.members.push({
          member_id: members[i]._id,
        });
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

    return {
      items,
      newProject,
      newProjectUsers,
      formTechnologies,
      handleNewProjectSubmit,
      errors,
      submitted,
    };
  },
};
</script>

<style scoped>
#basic-info-section,
#time-schedule-section {
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
