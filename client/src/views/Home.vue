<template>
  <div class="home">
    <div v-for="(table, index) in tables" :key="index">
      <TableInfo :tableInfo="table" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TableInfo from "../components/TableInfo";

export default {
  name: "Home",
  components: {
    TableInfo,
  },
  data() {
    return {
      tables: null,
    };
  },
  created() {
    axios({
      method: "GET",
      url: "http://localhost:5050/api/schema",
      headers: { "content-type": "application/json" },
    })
      .then((response) => {
        this.tables = response.data;
      })
      .catch((error) => {
        this.tables = error.message;
      });
  },
};
</script>
