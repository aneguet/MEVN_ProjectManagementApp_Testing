import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginComponent from '../components/LoginComponent.vue';
import SignupComponent from '../components/SignupComponent.vue';
import UsersList from '../views/UsersList.vue';
import UserSettings from '../views/UserSettings.vue';
import ProjectDetail from '../views/ProjectDetail.vue';
import NewProject from '../views/NewProject.vue';
import EditProject from '../views/EditProject.vue';
import NewTask from '../views/NewTask.vue';
import EditTask from '../views/EditTask.vue';

const routes = [
  {
    path: '/:catchAll(.*)', // Unrecognized path
    redirect: '/',
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupComponent,
  },
  {
    path: '/users',
    name: 'users',
    component: UsersList,
    beforeEnter: [
      function (from, to, next) {
        // check if user is logged in
        if (
          localStorage.getItem('token') !== null &&
          localStorage.getItem('token') !== undefined
        ) {
          next(); // proceeds to execute the second function
        } else {
          next('/login');
        }
      },
      function (from, to, next) {
        // check if user is admin
        if (
          localStorage.getItem('role') !== null &&
          localStorage.getItem('role') !== undefined &&
          localStorage.getItem('role') == 'admin'
        ) {
          // Thank you
          next();
        }
      },
    ],
  },
  {
    path: '/settings',
    name: 'settings',
    component: UserSettings,
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/project/:id',
    name: 'project',
    component: ProjectDetail,
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/project/new',
    name: 'new project',
    component: NewProject,
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/project/edit/:id',
    name: 'edit project',
    component: EditProject,
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/project/newTask/:id',
    name: 'new task',
    component: NewTask,
    beforeEnter: checkIfLoggedIn,
  },
  {
    path: '/project/editTask/:id',
    name: 'edit task',
    component: EditTask,
    beforeEnter: checkIfLoggedIn,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Check if user is logged in before letting them enter the routes
function checkIfLoggedIn(to, from, next) {
  if (
    localStorage.getItem('token') !== null &&
    localStorage.getItem('token') !== undefined
  ) {
    next();
  } else {
    next('/login');
  }
}

export default router;
