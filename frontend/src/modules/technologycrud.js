import { ref } from 'vue';
import axios from 'axios';
// import { useRoute } from 'vue-router';
const getTechnologies = () => {
  // const route = useRoute();
  const technologies = ref({});
  const formTechnologies = ref({});
  // Get all users
  const GetAllTechnologies = async () => {
    try {
      await axios.get('/technologies').then((res) => {
        technologies.value = res.data;
        formTechnologies.value = [technologies.value, []]; // The second array will store the technologies selected by the user
      });
    } catch (err) {
      console.log(err);
    }
  };
  return {
    GetAllTechnologies,
    technologies,
    formTechnologies,
  };
};
export default getTechnologies;
