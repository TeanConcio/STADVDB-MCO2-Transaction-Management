<script setup>
import { ref } from 'vue';
import FormComponent from './components/Form.vue';

const tab = ref('insert');
const showForm = ref(false);
const updateInput = ref('');
const deleteInput = ref('');

const selectTab = (selectedTab) => {
  tab.value = selectedTab;
};

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
    <div class="tabs">
      <button :class="{ active: tab === 'insert' }" @click="selectTab('insert')">Insert</button>
      <button :class="{ active: tab === 'update' }" @click="selectTab('update')">Update</button>
      <button :class="{ active: tab === 'delete' }" @click="selectTab('delete')">Delete</button>
    </div>
    <FormComponent v-if="tab === 'insert'" />
    <div v-if="tab === 'update'">
      <input v-model="updateInput" type="text" placeholder="Enter ID">
      <FormComponent v-if="updateInput" />
    </div>
    <div v-if="tab === 'delete'">
      <input v-model="deleteInput" type="text" placeholder="Enter ID to delete">
      <button v-if="deleteInput" @click="confirmDelete">Confirm Deletion</button>
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
.navbar button:hover, .active {
  background-color: #777;
}
</style>