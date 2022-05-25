import { ref, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const getTasks = () => {
  const route = useRoute();
  const router = useRouter();
  const projectTasks = ref({});
  let task = ref({});
  const todoTasks = ref({});
  const doingTasks = ref({});
  const doneTasks = ref({});
  let project = ref({});
  let editTaskMembers = ref({});
  let requestError = ref('');
  const Id = computed(() => route.params.id);

  const CreateNewTask = async (data) => {
    data.project_id = Id.value;
    try {
      await axios
        .post('/tasks/task', data, {
          headers: { 'auth-token': localStorage.getItem('token') },
        })
        .then(() => {
          router.push('/project/' + Id.value);
        });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };
  const EditTask = async (data) => {
    try {
      await axios
        .put('/tasks/task', data, {
          headers: {
            'auth-token': localStorage.getItem('token'),
            id: Id.value,
          },
        })
        .then(() => {
          router.push('/project/' + data.project_id);
        });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };

  const GetTasksByProject = async () => {
    try {
      await axios
        .get('/tasks/byProject', {
          headers: {
            'auth-token': localStorage.getItem('token'),
            id: Id.value,
          },
        })
        .then((res) => {
          projectTasks.value = res.data;
          setTasksByStatus();
        });
    } catch (err) {
      console.log(err);
    }
  };
  const SetTaskMembers = () => {
    let aux;
    aux = project.value.members;
    editTaskMembers.value = aux.map((el) => ({
      _id: el.member_id._id,
      email: el.member_id.email,
    }));
  };
  // Get project by project Id (external id, not from route)
  const GetProjectByIdExternal = async (projectId) => {
    try {
      await axios
        .get('/projects/project', {
          headers: {
            'auth-token': localStorage.getItem('token'),
            id: projectId,
          },
        })
        .then((res) => {
          project.value = res.data;
        })

        .then(() => {
          SetTaskMembers(); // we prepare the members array with key and value for the dropdown
        });
    } catch (err) {
      console.log(err);
    }
  };
  const GetTaskByTaskId = async () => {
    try {
      await axios
        .get('/tasks/task', {
          headers: {
            'auth-token': localStorage.getItem('token'),
            id: Id.value,
          },
        })
        .then((res) => {
          task.value = res.data;
        })
        .then(() => {
          // we also want the project members to show in a dropdown, so first we retrieve the project
          GetProjectByIdExternal(task.value[0].project_id);
        });
    } catch (err) {
      console.log(err);
    }
  };
  // Delete task by id
  const DeleteTask = async (taskId) => {
    try {
      await axios.delete('/tasks/task', {
        headers: {
          'auth-token': localStorage.getItem('token'),
          id: taskId,
        },
      });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };
  // We save the tasks in different arrays depending on the status
  const setTasksByStatus = () => {
    todoTasks.value = projectTasks.value.filter(
      (task) => task.task_status === 'Todo'
    );

    doneTasks.value = projectTasks.value.filter(
      (task) => task.task_status === 'Done'
    );

    doingTasks.value = projectTasks.value.filter(
      (task) => task.task_status === 'Doing'
    );
  };
  return {
    projectTasks,
    GetTasksByProject,
    GetTaskByTaskId,
    todoTasks,
    doingTasks,
    doneTasks,
    CreateNewTask,
    editTaskMembers,
    requestError,
    EditTask,
    task,
    DeleteTask,
  };
};
export default getTasks;
