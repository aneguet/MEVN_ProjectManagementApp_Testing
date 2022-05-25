import { ref } from 'vue';
import axios from 'axios';

const getUsers = () => {
  const user = ref({});
  const users = ref({});
  const newProjectUsers = ref({});
  let requestError = ref('');
  // Get Logged in User
  const GetUser = async () => {
    try {
      await axios
        .get('/users/userLogin', {
          headers: { 'auth-token': localStorage.getItem('token') },
        })
        .then((res) => {
          user.value = res.data;
        });
    } catch (err) {
      console.log(err);
      user.value = null;
    }
  };
  // Get all users
  const GetAllUsers = async () => {
    try {
      await axios
        .get('/users', {
          headers: { 'auth-token': localStorage.getItem('token') },
        })
        .then((res) => {
          users.value = res.data;
        })
        .then(() => {
          SetNewProjectUsers();
        });
    } catch (err) {
      console.log(err);
    }
  };
  // Update user by id
  const EditUser = async (data) => {
    try {
      await axios.put('/users/user', data, {
        headers: {
          'auth-token': localStorage.getItem('token'),
          id: localStorage.getItem('user_id'),
        },
      });
    } catch (err) {
      console.log(err);
      requestError.value = err;
    }
  };

  const SetNewProjectUsers = () => {
    newProjectUsers.value = users.value.map((element) => ({
      role: element.role,
      email: element.email,
      _id: element._id,
    }));
    let aux = newProjectUsers.value;
    newProjectUsers.value = aux.filter(
      (u) => u._id != localStorage.getItem('user_id')
    );
    if (localStorage.getItem('role') == 'user') {
      // We don't show the admins if the user doesn't have the rights
      newProjectUsers.value = newProjectUsers.value.filter(
        (u) => u.role != 'admin'
      );
    }

    newProjectUsers.value = [newProjectUsers.value, []];
  };

  return {
    user,
    users,
    newProjectUsers,
    GetUser,
    GetAllUsers,
    EditUser,
    requestError,
  };
};
export default getUsers;
