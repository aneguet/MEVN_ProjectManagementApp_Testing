<template>
  <div id="navbar">
    <div id="logo">
      <router-link
        to="/"
        class="navbar-brand d-flex align-items-center logo-style"
      >
        Timefly</router-link
      >
    </div>
    <div id="buttons">
      <router-link
        to="/login"
        class="nav-link"
        aria-current="page"
        v-if="!isUserLoggedIn()"
        ><Button
          class="p-button-outlined nav-link p-button-sm button-padding"
          label="Login"
          id="login-btn"
        ></Button
      ></router-link>
      <router-link to="/signup" class="nav-link" v-if="!isUserLoggedIn()"
        ><Button
          class="p-button-outlined nav-link p-button-sm button-padding"
          label="Sign Up"
          id="signup-btn"
        ></Button
      ></router-link>

      <Chip
        v-if="isUserLoggedIn()"
        :label="email"
        :image="avatar"
        class="mr-2 mb-2 avatar-style"
      />
      <Button
        @click="logoutUser"
        v-if="isUserLoggedIn()"
        label="Logout"
        class="p-button-outlined nav-link p-button-sm button-padding"
        icon="pi pi-sign-out"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import utils from '../modules/utils';
export default {
  name: 'NavComponent',

  setup() {
    const router = useRouter();
    const { isUserLoggedIn } = utils();
    const avatar = localStorage.getItem('avatar');
    const email = localStorage.getItem('email');
    const logoutUser = () => {
      localStorage.removeItem('token');
      localStorage.clear();
      // Redirection to home
      router.push('/login');
    };

    return { logoutUser, isUserLoggedIn, avatar, email };
  },
};
</script>
<style scoped>
#navbar {
  font-size: 20px;
  font-family: 'Damion', cursive;
  background-color: #efefef;
  height: 60px;
  padding: 0.5em 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#navbar #buttons {
  align-items: center;
  display: flex;
}
#navbar .avatar-style {
  margin-right: 0.6em;
}
#navbar #signup-btn {
  margin-left: 1em;
}
#navbar #logo a {
  color: #272727;
  font-size: 21px;
}
.p-panelmenu .p-panelmenu-header > a {
  padding: 2em 1.25em;
}
</style>
