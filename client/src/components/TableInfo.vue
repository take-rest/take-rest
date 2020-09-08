<template>
  <div class="tableInfo">
    <div class="tableName" @click="hide = !hide">{{tableInfo.name}}</div>
    <div class="tableContent" v-if="!hide">
      <table>
        <tr>
          <th>cid</th>
          <th>name</th>
          <th>type</th>
          <th>notnull</th>
          <th>dflt_value</th>
          <th>pk</th>
        </tr>
        <tr v-for="(tableContent,index) in tableContents" :key="index">
          <td>{{tableContent.cid}}</td>
          <td>{{tableContent.name}}</td>
          <td>{{tableContent.type}}</td>
          <td>{{tableContent.notnull}}</td>
          <td>{{tableContent.dflt_value}}</td>
          <td>{{tableContent.pk}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "TableInfo",
  props: ["tableInfo"],
  data() {
    return {
      tableContents: null,
      hide: true,
    };
  },
  created() {
    axios({
      method: "GET",
      url: `http://localhost:5050/api/schema/${this.tableInfo.name}`,
      headers: { "content-type": "application/json" },
    })
      .then((response) => {
        this.tableContents = response.data;
      })
      .catch((error) => {
        this.tableContents = error.message;
      });
  },
};
</script>

<style lang="scss" scoped>
.tableInfo {
  width: 80%;
  margin: 1em auto;
  .tableName {
    border: 1px solid #cccccc;
    padding: 1em 0;
    font-size: 1.3em;
    box-sizing: border-box;
    &:hover {
      cursor: pointer;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
  }
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
}
</style>