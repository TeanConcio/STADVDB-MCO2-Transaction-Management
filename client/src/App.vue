<script setup>
import { ref } from 'vue';
import FormComponent from './components/Form.vue';

const tab = ref('insert');
const showForm = ref(false);
const updateInput = ref('');
const deleteInput = ref('');
const showDevPanel = ref(false);

const selectTab = (selectedTab) => {
  tab.value = selectedTab;
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const toggleDevPanel = () => {
  showDevPanel.value = !showDevPanel.value;
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

    <!-- Check if ID exists, then shows form. If field not filled out, keep as is -->
    <div v-if="tab === 'update'">
      <input v-model="updateInput" type="text" placeholder="Enter ID to update">
      <FormComponent v-if="updateInput" />
    </div>

    <!-- Check if ID exists, if exists, show delete button -->
    <div v-if="tab === 'delete'">
      <input v-model="deleteInput" type="text" placeholder="Enter ID to delete">
      <button v-if="deleteInput" @click="confirmDelete">Confirm Deletion</button>
    </div>
  </div>

  <button class="dev-button" @click="toggleDevPanel">DEV</button>
    <div class="dev-panel" v-if="showDevPanel">
      <h2>Node Status</h2>
      <p>Node 1: Status</p>
      <p>Node 2: Status</p>
      <p>Node 3: Status</p>
      <button @click="refreshStatus">Refresh</button>
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

.dev-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: #555;
  color: white;
  border: none;
  cursor: pointer;
}

.dev-panel {
  position: fixed;
  bottom: 60px;
  right: 20px;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  width: 200px;
  color: black;
}
</style>