<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <div id="project-form-section" class="mt1">
        <form
          @submit.prevent="handleEditTaskSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <Message v-if="errors.message" severity="error" :closable="false">{{
            errors.message
          }}</Message>
          <!-- Name, Description and Stakeholder -->
          <Panel header="Edit task" class="mb1" id="new-task-form">
            <div id="new-task-section1" class="formgrid grid flex">
              <!-- Name -->
              <div v-for="t in task" :key="t.name" class="field col mr2">
                <p v-if="t.name">
                  <i>{{ t.name }}</i>
                </p>
                <label for="name">Name </label>
                <InputText
                  id="name"
                  type="text"
                  v-model="editTask.name"
                  :class="{ 'p-invalid': errors.name && submitted }"
                />
              </div>
              <!-- Description -->
              <div v-for="t in task" :key="t.description" class="field col mr2">
                <p v-if="t.description">
                  <i>{{ t.description }}</i>
                </p>
                <label for="description">Description </label>
                <Textarea
                  id="description"
                  v-model="editTask.description"
                  :autoResize="true"
                  rows="1"
                  cols="30"
                  :class="{ 'p-invalid': errors.description && submitted }"
                />
              </div>
            </div>
            <div id="new-task-section2" class="formgrid grid flex">
              <!-- Assigned to -->
              <div v-for="t in task" :key="t.assigned_to" class="field col mr2">
                <p v-if="t.assigned_to && editTaskMembers">
                  <i>{{ getUserEmail(t.assigned_to, editTaskMembers) }}</i>
                </p>
                <label for="assigned_to">Assigned to </label>
                <Dropdown
                  v-model="editTask.assigned_to"
                  :options="editTaskMembers"
                  optionLabel="email"
                  :class="{ 'p-invalid': errors.task_status && submitted }"
                />
              </div>

              <br />
              <!-- Hours used -->
              <div v-for="t in task" :key="t.hours_used" class="field col mr2">
                <p v-if="t.hours_used != undefined && t.hours_used != null">
                  <i>{{ t.hours_used }}</i>
                </p>
                <label for="hours_used">Hours Used </label>
                <InputNumber
                  id="hours_used"
                  v-model="editTask.hours_used"
                  :class="{
                    'p-invalid': errors.hours_used && submitted,
                  }"
                />
              </div>

              <!-- Task status -->
              <div v-for="t in task" :key="t.task_status" class="field col">
                <p v-if="t.task_status">
                  <i>{{ t.task_status }}</i>
                </p>
                <label for="task_status">Task status </label>
                <Dropdown
                  v-model="editTask.task_status"
                  :options="taskStatus"
                  optionLabel="desc"
                  :class="{ 'p-invalid': errors.task_status && submitted }"
                />
              </div>
            </div>
            <div class="field col mt-auto" id="edit-task-submit-section">
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
import taskcrud from '../modules/taskcrud';
import { reactive, ref, onMounted } from 'vue';
export default {
  name: 'EditTask',
  setup() {
    const { requestError, GetTaskByTaskId, task, editTaskMembers, EditTask } =
      taskcrud();
    const taskStatus = [
      { id: 'todo', desc: 'Todo' },
      { id: 'doing', desc: 'Doing' },
      { id: 'done', desc: 'Done' },
    ];
    const { isUserAdmin } = utils();
    const editTask = reactive({
      name: '',
      description: '',
      assigned_to: '',
      hours_used: '',
      task_status: '',
    });
    const errors = reactive({
      name: '',
      description: '',
      assigned_to: '',
      hours_used: '',
      task_status: '',
      message: '',
    });
    const submitted = ref(false);

    GetTaskByTaskId(); // The project will give us back the project members
    onMounted(() => {});
    const getUserEmail = (user_id, members) => {
      let user_email = '';
      for (let i = 0; i < members.length; i++) {
        if (user_id === members[i]._id) {
          user_email = members[i].email;
        }
      }
      return user_email;
    };
    const handleEditTaskSubmit = async () => {
      resetErrors();
      submitted.value = true;
      const taskToUpdate = prepareTaskToUpdate();
      EditTask(taskToUpdate);
      if (requestError) errors.message = requestError;
    };
    const prepareTaskToUpdate = () => {
      let data = {};
      data.project_id = task.value[0].project_id;
      if (editTask.name && editTask.name != '') {
        data.name = editTask.name;
      }
      if (editTask.description && editTask.description != '') {
        data.description = editTask.description;
      }
      if (editTask.assigned_to && editTask.assigned_to != '') {
        data.assigned_to = editTask.assigned_to._id;
      }

      if (editTask.hours_used && editTask.hours_used != '') {
        data.hours_used = editTask.hours_used;
      }
      if (editTask.task_status && editTask.task_status != '') {
        data.task_status = editTask.task_status.desc;
      }

      return data;
    };
    const resetErrors = () => {
      (errors.name = ''),
        (errors.description = ''),
        (errors.assigned_to = ''),
        (errors.hours_used = ''),
        (errors.task_status = ''),
        (errors.message = '');
      submitted.value = false;
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
      editTask,
      handleEditTaskSubmit,
      errors,
      submitted,
      editTaskMembers,
      taskStatus,
      task,
      getUserEmail,
    };
  },
};
</script>

<style scoped>
#edit-task-section1,
#edit-task-section2 {
  display: flex;
  justify-content: center;
}
#edit-task-section1 {
  margin-top: 4em;
  margin-bottom: 1em;
}
#edit-task-section2 {
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
#edit-task-submit-section {
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 2em;
}
#edit-task-submit-section button {
  width: 30%;
}
</style>
