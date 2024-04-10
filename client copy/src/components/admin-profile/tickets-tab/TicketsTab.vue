<script setup>
import TicketsTable from "./TicketsTable.vue";
</script>

<template>
    <div class="w-full">
        <h1 class="text-4xl font-bold mb-4">Tickets</h1>
        <div class="grid">
            <!-- display Records Table component-->
            <TicketsTable />
        </div>
    </div>
</template>
