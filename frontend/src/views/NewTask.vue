<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <Toast />

      <div id="project-form-section" class="mt1">
        <form
          @submit.prevent="handleNewTaskSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <Message v-if="errors.message" severity="error" :closable="false">{{
            errors.message
          }}</Message>
          <!-- Name, Description and Stakeholder -->
          <Panel header="New task" class="mb1" id="new-task-form">
            <div id="new-task-section1" class="formgrid grid flex">
              <!-- Name -->
              <div class="field col mr2">
                <label for="name">Name *</label>
                <InputText
                  id="name"
                  type="text"
                  v-model="newTask.name"
                  :class="{ 'p-invalid': errors.name && submitted }"
                />
              </div>
              <!-- Description -->
              <div class="field col mr2">
                <label for="description">Description *</label>
                <Textarea
                  id="description"
                  v-model="newTask.description"
                  :autoResize="true"
                  rows="1"
                  cols="30"
                  :class="{ 'p-invalid': errors.description && submitted }"
                />
              </div>
            </div>
            <div id="new-task-section2" class="formgrid grid flex">
              <!-- Assigned to -->
              <div class="field col mr2">
                <label for="assigned_to">Assigned to *</label>
                <Dropdown
                  v-model="newTask.assigned_to"
                  :options="newTaskProjectMembers"
                  optionLabel="email"
                  :class="{ 'p-invalid': errors.task_status && submitted }"
                />
              </div>

              <br />
              <!-- Hours allocated -->
              <div class="field col mr2">
                <label for="hours_allocated">Hours Allocated *</label>
                <InputNumber
                  id="hours_allocated"
                  v-model="newTask.hours_allocated"
                  :class="{
                    'p-invalid': errors.hours_allocated && submitted,
                  }"
                />
              </div>

              <!-- Task status -->
              <div class="field col">
                <label for="task_status">Task status *</label>
                <Dropdown
                  v-model="newTask.task_status"
                  :options="taskStatus"
                  optionLabel="desc"
                  :class="{ 'p-invalid': errors.task_status && submitted }"
                />
              </div>
            </div>
            <div class="field col mt-auto" id="new-task-submit-section">
              <Button
                type="submit"
                label="Submit"
                class="p-button p-button-success submit-btn"
              />
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
import taskcrud from '../modules/taskcrud';
import { reactive, ref, onMounted } from 'vue';
export default {
  name: 'NewTask',
  setup() {
    const { GetProjectById, newTaskProjectMembers } = projectcrud(); //projectId send in the task request
    const { requestError, CreateNewTask } = taskcrud();
    const taskStatus = [
      { id: 'todo', desc: 'Todo' },
      { id: 'doing', desc: 'Doing' },
      { id: 'done', desc: 'Done' },
    ];
    const { isUserAdmin } = utils();
    const newTask = reactive({
      name: '',
      description: '',
      assigned_to: '',
      hours_allocated: '',
      task_status: 'todo',
    });
    const errors = reactive({
      name: '',
      description: '',
      assigned_to: '',
      hours_allocated: '',
      task_status: '',
      message: '',
    });
    const submitted = ref(false);

    onMounted(() => {
      GetProjectById(); // The project will give us back the project members
    });

    const handleNewTaskSubmit = async () => {
      resetErrors();
      submitted.value = true;
      if (areFieldsValid()) {
        let data = {
          assigned_to: newTask.assigned_to._id,
          description: newTask.description,
          hours_allocated: newTask.hours_allocated,
          name: newTask.name,
          task_status: newTask.task_status.desc,
        };

        CreateNewTask(data);
        if (requestError) errors.message = requestError;
      }
    };
    const resetErrors = () => {
      (errors.name = ''),
        (errors.description = ''),
        (errors.assigned_to = ''),
        (errors.hours_allocated = ''),
        (errors.task_status = ''),
        (errors.message = '');
      submitted.value = false;
    };

    let areFieldsValid = () => {
      if (!newTask.name || newTask.name == '') {
        errors.name = 'Name cannot be empty';
        errors.message = errors.name;
        return false;
      } else if (!newTask.description || newTask.description == '') {
        errors.description = 'Description cannot be empty';
        errors.message = errors.description;
        return false;
      } else if (!newTask.assigned_to || newTask.assigned_to == '') {
        errors.assigned_to = 'Assigned member cannot be empty';
        errors.message = errors.assigned_to;
        return false;
      } else if (newTask.hours_allocated == '') {
        errors.hours_allocated = 'Hours allocated cannot be empty';
        errors.message = errors.hours_allocated;
        return false;
      } else if (newTask.hours_allocated <= 0) {
        errors.hours_allocated = 'Hours allocated must be greater than 0';
        errors.message = errors.hours_allocated;
        return false;
      } else if (!newTask.task_status || newTask.task_status == '') {
        errors.task_status = 'Task status cannot be empty';
        errors.message = errors.task_status;
        return false;
      } else {
        return true;
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
      newTask,
      handleNewTaskSubmit,
      errors,
      submitted,
      newTaskProjectMembers,
      taskStatus,
    };
  },
};
</script>

<style scoped>
#new-task-section1,
#new-task-section2 {
  display: flex;
  justify-content: center;
}
#new-task-section1 {
  margin-top: 4em;
  margin-bottom: 1em;
}
#new-task-section2 {
  margin-bottom: 2em;
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
#new-task-submit-section {
  text-align: center;
  margin-bottom: 2em;
}
#new-task-submit-section button {
  width: 30%;
}
</style>
