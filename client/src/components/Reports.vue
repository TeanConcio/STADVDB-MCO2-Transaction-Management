<template>
    <div>
      <div v-if="error">
        Error: {{ error.message }}
      </div>
      <div v-else-if="reports">
        <pre>{{ reports }}</pre>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
</template>
  
<script>
export default {
  name: 'Reports',
  data() {
    return {
      reports: null,
      error: null
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:8081/reports');
      this.reports = await response.json();
    } catch (error) {
      this.error = error;
    }
  }
}
</script>