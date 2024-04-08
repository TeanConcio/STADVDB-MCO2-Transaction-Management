<script setup>
import FormComponent from './components/Form.vue';
</script>

<template>
  <div id="app">
    <FormComponent />
  </div>
</template>

<style scoped>
#app, .form {
  text-align: left;
  width: 100%;
}
.form label,
.form input,
.form select {
  display: block;
  width: 100%;
}
</style>