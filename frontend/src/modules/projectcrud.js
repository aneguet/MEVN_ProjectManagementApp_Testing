import { ref, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const getProjects = () => {
  const route = useRoute();
  const router = useRouter();
  const userProjects = ref({});
  const projectLeader = ref({});
  let project = ref({});
  const timeSchedule = ref({});
  const remainingHours = ref(0);
  const remainingHPercentage = ref(0);
  const projectId = computed(() => route.params.id);
  let projectState = ref('Ongoing');
  let projectStateClass = ref('info');
  let requestError = ref('');
  let newTaskProjectMembers = ref([]);

  const GetProjectState = () => {
    // We define the project state depending on the time schedule and the current date and time
    let nowDate = new Date();
    nowDate = nowDate.toISOString(); // We convert the date to the mongodb type to compare it

    if (remainingHours.value == 0) {
      if (nowDate > timeSchedule.value.due_date) {
        // due date is past
        projectState.value = 'Complete';
      }
    } else {
      if (nowDate > timeSchedule.value.due_date && remainingHours.value > 0) {
        // due date is past but there are still remaining hours
        projectState.value = 'Overdue';
      }
    }
  };
  const SetProjectStateClass = (projectState) => {
    switch (projectState) {
      case 'Complete':
        projectStateClass.value = 'success';
        break;
      case 'Ongoing':
        projectStateClass.value = 'info';
        break;
      case 'Overdue':
        projectStateClass.value = 'warning';
        break;
      default:
        break;
    }
  };
  const CreateNewProject = async (data) => {
    try {
      await axios
        .post('/projects/project', data, {
          headers: { 'auth-token': localStorage.getItem('token') },
        })
        .then((res) => {
          router.push('/project/' + res.data._id);
        });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };
  const EditProject = async (data) => {
    try {
      await axios
        .put('/projects/project', data, {
          headers: {
            'auth-token': localStorage.getItem('token'),
            id: projectId.value,
          },
        })
        .then(() => {
          router.push('/project/' + projectId.value);
        });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };
  const GetProjectsByUser = async () => {
    try {
      await axios
        .get('/projects/byUser', {
          headers: { 'auth-token': localStorage.getItem('token') },
        })
        .then((res) => {
          userProjects.value = res.data;
        });
    } catch (err) {
      console.log(err);
    }
  };
  // Gets all projects (admin)
  const GetAllProjects = async () => {
    try {
      await axios
        .get('/projects', {
          headers: { 'auth-token': localStorage.getItem('token') },
        })
        .then((res) => {
          userProjects.value = res.data;
        });
    } catch (err) {
      console.log(err);
    }
  };
  // Get project by project Id
  const GetProjectById = async () => {
    try {
      await axios
        .get('/projects/project', {
          headers: {
            'auth-token': localStorage.getItem('token'),
            id: projectId.value,
          },
        })
        .then((res) => {
          project.value = res.data;
          // Save leader
          projectLeader.value = res.data.leader._id;

          // Save time schedule array
          timeSchedule.value = res.data.time_schedule;

          // Save remaining hours and calculate percentage
          remainingHours.value =
            timeSchedule.value.estimated_hours - timeSchedule.value.spent_hours;

          if (remainingHours.value < 0) remainingHours.value = 0;
          remainingHPercentage.value =
            remainingHours.value == 0
              ? 0
              : (remainingHours.value * 100) /
                timeSchedule.value.estimated_hours;
        })
        .then(() => {
          // Save project state depending on the time schedule
          GetProjectState();
        })
        .then(() => {
          SetProjectStateClass(projectState.value);
          SetTaskProjectMembers();
        });
    } catch (err) {
      console.log(err);
    }
  };
  // Delete project by id
  const DeleteProject = async (projectId) => {
    try {
      await axios.delete('/projects/project', {
        headers: {
          'auth-token': localStorage.getItem('token'),
          id: projectId,
        },
      });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };
  const SetTaskProjectMembers = () => {
    let aux;
    aux = project.value.members;

    // we'll use it later when creating a new task and we need the current members of the project for the dropdown
    newTaskProjectMembers.value = aux.map((el) => ({
      _id: el.member_id._id,
      email: el.member_id.email,
    }));
  };

  return {
    userProjects,
    GetProjectsByUser,
    GetAllProjects,
    GetProjectById,
    EditProject,
    project,
    projectLeader,
    timeSchedule,
    remainingHours,
    remainingHPercentage,
    projectState,
    projectStateClass,
    CreateNewProject,
    requestError,
    newTaskProjectMembers,
    DeleteProject,
  };
};
export default getProjects;
