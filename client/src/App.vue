<script setup>
import { ref } from 'vue';
import FormComponent from './components/Form.vue';

const showForm = ref(false);
const toggleForm = () => {
  showForm.value = !showForm.value;
};
</script>

<template>
  <div id="app">
    <div class="navbar">
      <button @click="toggleForm">Search</button>
      <FormComponent v-if="showForm" />
    </div>
  </div>
</template>

<style scoped>
#app {
  text-align: left;
  width: 100%;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #333;
  color: white;
  padding: 10px 0;
  padding-left: 20px;
}
.navbar button {
  color: white;
  background-color: #555;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}
.navbar button:hover {
  background-color: #777;
}
</style>