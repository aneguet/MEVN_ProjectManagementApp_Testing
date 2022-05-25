<template>
  <div class="generic-card">
    <div id="login-block" class="auth-wrapper">
      <div class="auth-inner">
        <div>
          <img
            src="../assets/logo.png"
            alt="Logo of time fly that consists of a fly"
            width="150"
            class="text-center"
          />
        </div>
        <form
          @submit.prevent="handleLoginSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <p class="logo-text">Welcome to Timefly</p>
          <!-- <h3>Login</h3> -->
          <Message v-if="errors.message" severity="error" :closable="false">{{
            errors.message
          }}</Message>
          <!-- Email -->
          <div class="field">
            <div class="p-float-label p-input-icon-right">
              <i class="pi pi-envelope" />
              <InputText
                id="email"
                type="email"
                v-model="loginUser.email"
                :class="{ 'p-invalid': errors.email && submitted }"
                autocomplete="off"
              />
              <label for="email">Email*</label>
            </div>
          </div>
          <!-- Password -->
          <div class="field">
            <div class="p-float-label">
              <Password
                id="password"
                v-model="loginUser.password"
                :class="{ 'p-invalid': errors.password && submitted }"
                autocomplete="off"
                :feedback="false"
                toggleMask
              >
              </Password>
              <label for="password">Password*</label>
            </div>
          </div>
          <Button type="submit" label="Login" class="p-button submit-btn" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name: 'LoginComponent',
  setup() {
    const loginUser = reactive({
      email: '',
      password: '',
    });
    const errors = reactive({
      email: '',
      password: '',
      message: '',
    });
    const submitted = ref(false);
    const router = useRouter();
    const handleLoginSubmit = async () => {
      resetErrors();
      submitted.value = true;
      const data = {
        email: loginUser.email,
        password: loginUser.password,
      };

      if (areFieldsValid()) {
        try {
          const res = await axios.post('/users/login', data);
          // Store user token and other user fields in localStorage (we need them to be accessible in all the components and views)
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('user_id', res.data.data.user._id);
          localStorage.setItem('avatar', res.data.data.user.avatar);
          localStorage.setItem('email', res.data.data.user.email);
          localStorage.setItem('role', res.data.data.user.role);

          // Redirect to Home page
          router.push('/');
        } catch (err) {
          errors.message = err.response ? err.response.data.error : err;
          console.log(errors);
        }
      }
    };
    const resetErrors = () => {
      errors.email = '';
      errors.password = '';
      errors.message = '';
      submitted.value = false;
    };
    // validate fields
    let areFieldsValid = () => {
      if (!loginUser.email || loginUser.email == '') {
        errors.email = 'Email cannot be empty';
        errors.message = errors.email;
        return false;
      } else if (!loginUser.password || loginUser.password == '') {
        errors.password = 'Password cannot be empty';
        errors.message = errors.password;
        return false;
      } else {
        return true;
      }
    };
    return { loginUser, errors, submitted, handleLoginSubmit };
  },
};
</script>

<style>
.auth-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-top: 8em;
}
.auth-inner {
  width: 450px;
  margin: auto;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 5px;
  transition: all 0.3s;
}
.auth-wrapper .form-control {
  margin-bottom: 1.5em;
}
.auth-wrapper .form-control:focus {
  border-color: #363885;
  box-shadow: none;
}
.auth-wrapper h3 {
  text-align: center;
  margin: 0;
  line-height: 1;
  padding-bottom: 20px;
}
.generic-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}
.logo-text {
  font-size: 31px;
  color: #323232;
  margin-bottom: 0.5em;
  margin-top: 1px;
  font-family: 'Damion', cursive;
}

.generic-card .card {
  /* signup and login forms size*/
  min-width: 450px;
}

.generic-card .field {
  margin-bottom: 1.5rem;
}
form .submit-btn {
  width: 100%;
}

@media screen and (max-width: 960px) {
  .card {
    width: 80%;
  }
}
#login-block {
  margin-top: 3.5em;
}
</style>
