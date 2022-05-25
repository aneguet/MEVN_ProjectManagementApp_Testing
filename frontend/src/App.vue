<template>
  <div id="app">
    <!-- Navigation bar: the key allows us to reload the navbar as well when pushing a specific route -->
    <NavComponent :key="$route.fullPath" />
    <ScrollTop />
    <router-view></router-view>
  </div>
</template>

<script>
import NavComponent from './components/NavComponent.vue';
import utils from './modules/utils';
export default {
  name: 'App',
  components: { NavComponent },
  setup() {
    const { isUserLoggedIn } = utils();
    return { isUserLoggedIn };
  },
};
</script>

<style lang="scss">
/* General style */
@import url('https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700,800');
* {
  box-sizing: border-box;
}

body {
  background: #363885 !important;
  min-height: 100vh;
  display: flex;
  font-weight: 400;
  margin: 0px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
* {
  box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5,
h6,
label,
span {
  font-weight: 500;
}
// Sidebar
#sidebar-main {
  display: flex;
  width: 100%;
  min-height: 100vh;
}
#sidebar .p-panelmenu {
  width: 22rem;
}

#sidebar .p-panelmenu.p-component,
#sidebar .p-panelmenu-panel {
  /* height: 100vh; */
  background-color: white;
  width: 200px;
}
.lcolumn {
  background-color: #d5d5d5;
}
a.p-panelmenu-header-link {
  padding-top: 1.5em;
  padding-bottom: 1.5em;
}
//
#app {
  width: 100%;
  height: 100%;
}
.row {
  width: 100%;
  display: flex;
}
// Pages title
#page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#page-title p {
  color: white;
  font-size: 20px;
}
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

/* Forms */
.custom-control-label {
  font-weight: 400;
}
.forgot-password,
.forgot-password a {
  text-align: right;
  font-size: 13px;
  padding-top: 10px;
  color: #7f7d7d;
  margin: 0;
}
.forgot-password a {
  color: #363885;
}
</style>
