<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <!-- Delete dialog confirmation  -->
      <ConfirmDialog></ConfirmDialog>
      <div id="projectDetailNewTask">
        <Button
          label="New Task"
          icon="pi pi-plus"
          class="mr-2"
          id="new-project"
          @click="newTask(project._id)"
        />
      </div>
      <!-- Name, Description, Stakeholder -->
      <Fieldset id="project-name">
        <template #legend>
          {{ project.name }}
        </template>
        <!-- Project state -->
        <div id="tag-style">
          <Tag :severity="projectStateClass"> {{ projectState }} </Tag>
        </div>
        <div>
          <span class="pi pi-briefcase icon-weight"></span>&nbsp;&nbsp;<strong
            >{{ project.stakeholder }}</strong
          >
        </div>
        {{ project.description }}
      </Fieldset>
      <!-- Time schedule -->
      <Panel :toggleable="true" id="project-schedule">
        <template #header> Time Schedule </template>
        <!-- Remaining hours -->
        <div v-if="remainingHours > 0">
          <ProgressBar :value="remainingHPercentage" class="remain-hours"
            >{{ remainingHours }} h</ProgressBar
          >
        </div>
        <p>
          <span>Remaining:</span> {{ remainingHours }} h&nbsp;&nbsp;<span
            >Estimated: </span
          >{{ timeSchedule.estimated_hours }} h&nbsp;&nbsp;<span>Spent:</span>
          {{ timeSchedule.spent_hours }} h
        </p>

        <!-- Dates -->
        <div>
          <div class="date-margin">
            <span class="date-span-margin">Start date:</span
            >{{ moment(timeSchedule.start_date).format('DD/MM/YYYY hh:mm') }}
          </div>
          <div class="date-margin">
            <span class="date-span-margin">End date:</span
            >{{ moment(timeSchedule.end_date).format('DD/MM/YYYY hh:mm') }}
          </div>
          <div>
            <span class="date-span-margin">Due date:</span
            >{{ moment(timeSchedule.due_date).format('DD/MM/YYYY hh:mm') }}
          </div>
        </div>
      </Panel>
      <!-- Technologies -->
      <Panel :toggleable="true" id="project-techs">
        <template #header> Technologies </template>
        <div class="flex align-items-center flex-column sm:flex-row">
          <i v-if="project.technologies && project.technologies.length == 0">
            No technologies yet.
          </i>
          <Tag
            class="mr-2"
            :value="tech.tech_name"
            rounded
            v-for="tech in project.technologies"
            :key="tech._id"
          ></Tag>
        </div>
      </Panel>
      <!-- Members -->
      <Panel :toggleable="true" id="project-members">
        <template #header> Members </template>
        <div class="flex align-items-center flex-column sm:flex-row">
          <Chip
            v-for="member in project.members"
            :key="member.member_id._id"
            :label="member.member_id.email"
            :image="member.member_id.avatar"
            v-bind:class="
              member.member_id._id == projectLeader
                ? 'chip leader-color'
                : 'chip'
            "
          />
        </div>
      </Panel>
      <!-- Tasks -->
      <TabView>
        <!-- Tab 1: Todo -->
        <TabPanel>
          <template #header>
            <i
              class="pi pi-circle-fill"
              style="font-size: 8px; color: #ffc107"
            ></i>
            &nbsp;<span>Todo</span>
          </template>
          <!-- Card content -->

          <div
            class="flex align-items-center flex-column sm:flex-row"
            v-if="
              project != undefined &&
              project != null &&
              todoTasks != undefined &&
              todoTasks != null
            "
          >
            <Card v-for="todoTask in todoTasks" :key="todoTask._id">
              <template #title> {{ todoTask.name }} </template>
              <template #subtitle> {{ todoTask.description }} </template>
              <template #content>
                <div>
                  <Chip
                    :label="
                      getMemberEmail(project.members, todoTask.assigned_to)
                    "
                    :image="
                      getMemberAvatar(project.members, todoTask.assigned_to)
                    "
                    class="chip"
                  />
                  <p>
                    <span>Hours Allocated:</span>
                    {{ todoTask.hours_allocated }}
                  </p>
                  <p><span>Hours Used:</span> {{ todoTask.hours_used }}</p>
                  <p>
                    <span>Member roles:</span>
                    {{
                      getMemberProjectRoles(
                        project.members,
                        todoTask.assigned_to
                      )
                    }}
                  </p>
                </div>
              </template>
              <template #footer>
                <div style="display: flex; justify-content: center">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-success mx-2"
                    @click="editTask(todoTask._id)"
                  />
                  &nbsp;
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger"
                    @click="deleteTask(todoTask._id, todoTask.name)"
                  />
                </div>
              </template>
            </Card>
          </div>
          <div v-else>
            <p>No tasks yet</p>
          </div>
        </TabPanel>
        <!-- Tab 2: Doing -->
        <TabPanel>
          <template #header>
            <i
              class="pi pi-circle-fill"
              style="font-size: 8px; color: #17a2b8"
            ></i>
            &nbsp;<span>Doing</span>
          </template>
          <!-- Card content -->

          <div
            class="flex align-items-center flex-column sm:flex-row"
            v-if="
              project != undefined &&
              project != null &&
              doingTasks != undefined &&
              doingTasks != null
            "
          >
            <Card v-for="doingTask in doingTasks" :key="doingTask._id">
              <template #title> {{ doingTask.name }} </template>
              <template #subtitle> {{ doingTask.description }} </template>
              <template #content>
                <div>
                  <Chip
                    :label="
                      getMemberEmail(project.members, doingTask.assigned_to)
                    "
                    :image="
                      getMemberAvatar(project.members, doingTask.assigned_to)
                    "
                    class="chip"
                  />
                  <p>
                    <span>Hours Allocated:</span>
                    {{ doingTask.hours_allocated }}
                  </p>
                  <p><span>Hours Used:</span> {{ doingTask.hours_used }}</p>
                  <p>
                    <span>Member roles:</span>
                    {{
                      getMemberProjectRoles(
                        project.members,
                        doingTask.assigned_to
                      )
                    }}
                  </p>
                </div>
              </template>
              <template #footer>
                <div style="display: flex; justify-content: center">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-success mx-2"
                    @click="editTask(doingTask._id)"
                  />
                  &nbsp;
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger"
                    @click="deleteTask(doingTask._id, doingTask.name)"
                  />
                </div>
              </template>
            </Card>
          </div>
          <div class="flex align-items-center flex-column sm:flex-row" v-else>
            <p>No tasks yet</p>
          </div>
        </TabPanel>
        <!-- Tab 3: Done -->
        <TabPanel>
          <template #header>
            <i
              class="pi pi-circle-fill"
              style="font-size: 8px; color: #28a745"
            ></i>
            &nbsp;<span>Done</span>
          </template>
          <!-- Card content -->

          <div
            class="flex align-items-center flex-column sm:flex-row"
            v-if="
              project != undefined &&
              project != null &&
              doneTasks != undefined &&
              doneTasks != null
            "
          >
            <Card v-for="doneTask in doneTasks" :key="doneTask._id">
              <template #title> {{ doneTask.name }} </template>
              <template #subtitle> {{ doneTask.description }} </template>
              <template #content>
                <div>
                  <Chip
                    :label="
                      getMemberEmail(project.members, doneTask.assigned_to)
                    "
                    :image="
                      getMemberAvatar(project.members, doneTask.assigned_to)
                    "
                    class="chip"
                  />
                  <p>
                    <span>Hours Allocated:</span>
                    {{ doneTask.hours_allocated }}
                  </p>
                  <p><span>Hours Used:</span> {{ doneTask.hours_used }}</p>
                  <p>
                    <span>Member roles:</span>
                    {{
                      getMemberProjectRoles(
                        project.members,
                        doneTask.assigned_to
                      )
                    }}
                  </p>
                </div>
              </template>
              <template #footer>
                <div style="display: flex; justify-content: center">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-success mx-2"
                    @click="editTask(doneTask._id)"
                  />
                  &nbsp;
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger"
                    @click="deleteTask(doneTask._id, doneTask.name)"
                  />
                </div>
              </template>
            </Card>
          </div>
          <div class="flex align-items-center flex-column sm:flex-row" v-else>
            <p>No tasks yet</p>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script>
import projectcrud from '../modules/projectcrud';
import taskcrud from '../modules/taskcrud';
import { useConfirm } from 'primevue/useconfirm';
import utils from '../modules/utils';
import { useRouter } from 'vue-router';
// import { onMounted } from 'vue';
export default {
  name: 'ProjectDetail',
  setup() {
    const confirm = useConfirm();
    const router = useRouter();
    const {
      GetProjectById,
      project,
      projectLeader,
      timeSchedule,
      remainingHours,
      remainingHPercentage,
      projectState,
      projectStateClass,
    } = projectcrud();
    const { GetTasksByProject, todoTasks, doingTasks, doneTasks, DeleteTask } =
      taskcrud();
    const { isUserAdmin } = utils();
    var moment = require('moment'); // date formatting package
    // Gets user email comparing the user id and the project members array
    const getMemberEmail = (members, assignedTo) => {
      const member = members.filter(
        (member) => member.member_id._id === assignedTo
      );

      return member[0].member_id.email;
    };
    const getMemberAvatar = (members, assignedTo) => {
      const member = members.filter(
        (member) => member.member_id._id === assignedTo
      );
      return member[0].member_id.avatar;
    };
    const getMemberProjectRoles = (members, assignedTo) => {
      const member = members.filter(
        (member) => member.member_id._id === assignedTo
      );
      const memberRoles = member[0].project_roles;
      let memberRolesFormatted = '';
      for (let i = 0; i < memberRoles.length; i++) {
        memberRolesFormatted += memberRoles[i];
      }
      return memberRolesFormatted;
    };
    GetProjectById();
    GetTasksByProject();
    const newTask = (projectId) => {
      // project id
      router.push('/project/newTask/' + projectId);
    };

    const editTask = (taskId) => {
      router.push('/project/editTask/' + taskId); // FIXME No es error pero comprobar que funciona
    };

    const deleteTask = (taskId, taskName) => {
      confirm.require({
        message: 'Are you sure that you want to delete it?',
        header: 'Deleting ' + taskName,
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
          DeleteTask(taskId);
          // Reload data
          GetTasksByProject();
        },
        reject: () => {},
      });
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
      project,
      projectLeader,
      timeSchedule,
      moment,
      remainingHours,
      remainingHPercentage,
      projectState,
      projectStateClass,
      todoTasks,
      doingTasks,
      doneTasks,
      getMemberEmail,
      getMemberAvatar,
      getMemberProjectRoles,
      items,
      newTask,
      editTask,
      deleteTask,
    };
  },
};
</script>

<style scoped>
.rcolumn fieldset,
.rcolumn .p-panel.p-component {
  margin-bottom: 1em;
}
.flexend {
  justify-self: flex-end;
}
#project-name .icon-weight {
  font-weight: bolder;
}
.p-fieldset .p-fieldset-legend {
  font-size: 20px;
}

#project-members .chip {
  margin-right: 0.4em;
  margin-bottom: 0.4em;
}

.leader-color {
  background-color: #af92ff;
}
.p-tag.p-tag-rounded {
  margin-right: 0.5em;
}
#project-schedule div {
  align-items: center;
  display: flex;
}

.date-margin {
  margin-right: 1em;
}
.date-span-margin {
  margin-right: 0.5em;
}
.remain-hours {
  width: 15%;
  margin-bottom: 1em;
}
.p-progressbar.p-component.p-progressbar-determinate.remain-hours {
  margin-bottom: 0;
  margin-right: 1em;
}
#tag-style {
  margin-bottom: 1em;
}
/* Min height of tasks panel */
.p-tabview-panels {
  min-height: 288px;
}
.p-tabview .p-tabview-panels {
  min-height: 288px;
}
#projectDetailNewTask {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
