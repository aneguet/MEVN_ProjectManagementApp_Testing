<template>
  <div class="generic-card">
    <Toast />
    <div id="signup-block" class="auth-wrapper">
      <div class="auth-inner">
        <div>
          <img
            src="../assets/logo.png"
            alt="Logo of time fly that consists of a fly"
            width="150"
            class="text-center"
          />
        </div>
        <!-- '.prevent' Prevents page reload when submitting > (PreventDefault method) -->
        <form
          @submit.prevent="handleSignUpSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <div class="p-inputtext-sm">
            <p class="logo-text">Register to join us</p>
            <Message v-if="errors.message" severity="error" :closable="false">{{
              errors.message
            }}</Message>
            <!-- First Name -->
            <div class="field">
              <div class="p-float-label p-input-icon-right">
                <i class="pi pi-user" />
                <InputText
                  id="first_name"
                  type="text"
                  v-model="signupUser.first_name"
                  :class="{ 'p-invalid': errors.first_name && submitted }"
                  autocomplete="off"
                />
                <label for="first_name">First Name*</label>
              </div>
            </div>
            <!-- Last Name -->
            <div class="field">
              <div class="p-float-label p-input-icon-right">
                <i class="pi pi-user" />
                <InputText
                  id="last_name"
                  type="text"
                  v-model="signupUser.last_name"
                  :class="{ 'p-invalid': errors.last_name && submitted }"
                  autocomplete="off"
                />
                <label for="last_name">Last Name*</label>
              </div>
            </div>
            <!-- Email -->
            <div class="field">
              <div class="p-float-label p-input-icon-right">
                <i class="pi pi-envelope" />
                <InputText
                  id="email"
                  type="email"
                  v-model="signupUser.email"
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
                  v-model="signupUser.password"
                  toggleMask
                  :class="{ 'p-invalid': errors.password && submitted }"
                  autocomplete="off"
                >
                </Password>
                <label for="password">Password*</label>
              </div>
            </div>
            <!-- Password confirm. -->
            <div class="field">
              <div class="p-float-label">
                <Password
                  id="password_confirm"
                  v-model="signupUser.password_confirm"
                  toggleMask
                  :class="{ 'p-invalid': errors.password_confirm && submitted }"
                  autocomplete="off"
                  :feedback="false"
                >
                </Password>
                <label for="password_confirm">Password Confirmation*</label>
              </div>
            </div>
            <Button type="submit" label="Sign Up" class="p-button submit-btn" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
export default {
  name: 'SignupComponent',
  setup() {
    const signupUser = reactive({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
    });
    const errors = reactive({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      message: '',
    });
    const toast = useToast();
    const submitted = ref(false);
    const router = useRouter();
    const avatarLink = ref('');
    // Get all users
    const GetRandomAvatar = async () => {
      try {
        await axios.get('/avatars/randomAvatar').then((res) => {
          avatarLink.value = res.data.img_link;
        });
      } catch (err) {
        console.log(err);
      }
    };
    GetRandomAvatar(); // we get a random avatar to set to the user when they sign up
    const showToastMessage = () => {
      toast.add({
        severity: 'success',
        summary: 'User successfully created',
        life: 3000,
      });
    };
    const handleSignUpSubmit = async () => {
      resetErrors();
      submitted.value = true;
      const data = {
        avatar: avatarLink.value,
        first_name: signupUser.first_name,
        last_name: signupUser.last_name,
        email: signupUser.email,
        password: signupUser.password,
        password_confirm: signupUser.password_confirm,
      };
      // validate fields
      if (areFieldsValid()) {
        try {
          await axios.post('/users/register', data);
          showToastMessage();
          //Successful Signup > Redirection to login page
          router.push({ path: '/login' });
        } catch (err) {
          errors.message = err.response.data.error.message
            ? err.response.data.error.message
            : err;
        }
      }
    };

    const resetErrors = () => {
      (errors.first_name = ''),
        (errors.last_name = ''),
        (errors.email = ''),
        (errors.password = ''),
        (errors.password_confirm = ''),
        (errors.message = '');
      submitted.value = false;
    };
    // validate fields
    let areFieldsValid = () => {
      if (!signupUser.first_name || signupUser.first_name == '') {
        errors.first_name = 'First name cannot be empty';
        errors.message = errors.first_name;
        return false;
      } else if (!signupUser.last_name || signupUser.last_name == '') {
        errors.last_name = 'Last name cannot be empty';
        errors.message = errors.last_name;
        return false;
      } else if (!signupUser.email || signupUser.email == '') {
        errors.email = 'Email cannot be empty';
        errors.message = errors.email;
        return false;
      } else if (!signupUser.password || signupUser.password == '') {
        errors.password = 'Password cannot be empty';
        errors.message = errors.password;
        return false;
      } else if (
        !signupUser.password_confirm ||
        signupUser.password_confirm == ''
      ) {
        errors.password_confirm = 'Password confirmation cannot be empty';
        errors.message = errors.password_confirm;
        return false;
      } else if (signupUser.password != signupUser.password_confirm) {
        errors.password_confirm =
          'Password must be equal to Password confirmation';
        errors.message = errors.password_confirm;
        return false;
      } else {
        return true;
      }
    };

    return {
      signupUser,
      errors,
      submitted,
      handleSignUpSubmit,
    };
  },
};
</script>
<style>
#signup-block.auth-wrapper {
  margin-top: 1.5em;
}
#signup-block .auth-inner {
  padding: 20px 45px 25px 45px;
}
</style>
