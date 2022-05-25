<template>
  <div id="sidebar-main">
    <div id="sidebar" class="lcolumn">
      <!-- Sidebar -->
      <PanelMenu :model="items" />
    </div>
    <div class="rcolumn">
      <Toast />
      <div id="page-title"><p>User settings</p></div>
      <div id="user-form-section" class="mt1">
        <form
          @submit.prevent="handleEditUserSubmit"
          class="p-fluid"
          autocomplete="off"
        >
          <Message v-if="errors.message" severity="error" :closable="false">{{
            errors.message
          }}</Message>

          <Panel header="Update user" class="mb1">
            <div id="user-section" class="formgrid grid flex">
              <!-- First name -->
              <div class="field col mr2">
                <p>
                  <i>{{ user.first_name }}</i>
                </p>
                <label for="first_name">First Name</label>
                <InputText
                  id="first_name"
                  type="text"
                  autocomplete="off"
                  v-model="editUser.first_name"
                  :class="{ 'p-invalid': errors.first_name && submitted }"
                />
              </div>
              <!-- Last name -->
              <div class="field col mr2">
                <p>
                  <i>{{ user.last_name }}</i>
                </p>
                <label for="last_name">Last Name</label>
                <InputText
                  id="last_name"
                  type="text"
                  autocomplete="off"
                  v-model="editUser.last_name"
                  :class="{ 'p-invalid': errors.last_name && submitted }"
                />
              </div>
              <!-- New password -->
              <div class="field col mt">
                <label for="password">New password</label>
                <Password
                  id="password"
                  v-model="editUser.password"
                  :class="{ 'p-invalid': errors.password && submitted }"
                  toggleMask
                ></Password>
              </div>
              <!-- Phone -->
              <div class="field col mr2">
                <p>
                  <i>{{ user.phone }}</i>
                </p>
                <label for="phone">Phone</label>
                <InputText
                  id="phone"
                  type="text"
                  autocomplete="off"
                  v-model="editUser.phone"
                  :class="{ 'p-invalid': errors.phone && submitted }"
                />
              </div>
              <!-- Weekly hours -->
              <div class="field col mb">
                <p>
                  <i>{{ user.weekly_hours }}</i>
                </p>
                <label for="weekly_hours">Weekly hours</label>
                <InputNumber
                  id="weekly_hours"
                  autocomplete="off"
                  v-model="editUser.weekly_hours"
                  :class="{ 'p-invalid': errors.weekly_hours && submitted }"
                />
              </div>
            </div>
            <div class="field col mt-auto" id="user-submit-section">
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
import usercrud from '../modules/usercrud';
import { useToast } from 'primevue/usetoast';
const { GetUser, user, requestError, EditUser } = usercrud();
import { onMounted, reactive, ref } from 'vue';
export default {
  name: 'UserSettings',
  setup() {
    const { isUserAdmin } = utils();
    const toast = useToast();
    onMounted(() => {});
    GetUser();
    const editUser = reactive({
      first_name: '',
      last_name: '',
      password: '',
      phone: '',
      weekly_hours: '',
    });
    const errors = reactive({
      first_name: '',
      last_name: '',
      password: '',
      phone: '',
      weekly_hours: '',
      message: '',
    });
    const submitted = ref(false);
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
    const resetErrors = () => {
      (errors.first_name = ''),
        (errors.last_name = ''),
        (errors.password = ''),
        (errors.phone = ''),
        (errors.weekly_hours = ''),
        (errors.message = '');
      submitted.value = false;
    };
    const showToastSuccess = () => {
      toast.add({
        severity: 'success',
        summary: 'User successfully updated',
        life: 3000,
      });
    };
    const showToastWarn = () => {
      toast.add({
        severity: 'warn',
        summary: 'No fields updated',
        life: 3000,
      });
    };
    let areFieldsValid = () => {
      if (
        editUser.first_name &&
        editUser.first_name != '' &&
        (editUser.first_name.length < 2 || editUser.first_name.length > 255)
      ) {
        errors.first_name = 'First name must at least 2 characters';
        errors.message = errors.first_name;
        return false;
      }

      if (
        editUser.last_name &&
        editUser.last_name != '' &&
        (editUser.last_name.length < 2 || editUser.last_name.length > 255)
      ) {
        errors.last_name = 'Last name must have at least 2 characters';
        errors.message = errors.last_name;
        return false;
      }
      if (
        editUser.phone &&
        editUser.phone != '' &&
        (editUser.phone.length < 7 || editUser.phone.length > 15)
      ) {
        errors.phone = 'Phone must have between 7 and 15 characters';
        errors.message = errors.phone;
        return false;
      }
      if (
        editUser.password &&
        editUser.password != '' &&
        (editUser.password.length < 5 || editUser.password.length > 30)
      ) {
        errors.password = 'Password must have between 5 and 30 characters';
        errors.message = errors.password;
        return false;
      } else {
        return true;
      }
    };
    const prepareUserToUpdate = (data) => {
      let fieldsToUpdate = 0;
      if (editUser.first_name && editUser.first_name != '') {
        data.first_name = editUser.first_name;
        fieldsToUpdate++;
      }
      if (editUser.last_name && editUser.last_name != '') {
        data.last_name = editUser.last_name;
        fieldsToUpdate++;
      }
      if (editUser.password && editUser.password != '') {
        data.password = editUser.password;
        fieldsToUpdate++;
      }
      if (editUser.phone && editUser.phone != '') {
        data.phone = editUser.phone;
        fieldsToUpdate++;
      }

      if (editUser.weekly_hours && editUser.weekly_hours != '') {
        data.weekly_hours = editUser.weekly_hours;
        fieldsToUpdate++;
      }

      return fieldsToUpdate;
    };
    const handleEditUserSubmit = async () => {
      resetErrors();
      submitted.value = true;
      if (areFieldsValid()) {
        let userToUpdate = ref({});
        const fieldsToUpdate = prepareUserToUpdate(userToUpdate.value);
        if (fieldsToUpdate > 0) {
          EditUser(userToUpdate.value);
          if (requestError.value && requestError.value != '') {
            errors.message = requestError.value;
          } else {
            showToastSuccess();
            GetUser();
          }
        } else {
          showToastWarn();
        }
      }
    };

    return {
      items,
      editUser,
      submitted,
      handleEditUserSubmit,
      user,
      errors,
    };
  },
};
</script>

<style scoped>
.mt {
  margin-top: 1em;
}
.mb {
  margin-bottom: 2em;
}
</style>
