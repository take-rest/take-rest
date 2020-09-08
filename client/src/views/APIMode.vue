<template>
  <div class="api">
    <div class="header">
      <select v-model="selected">
        <option
          v-for="option in options"
          v-bind:value="option.value"
          :key="option.text"
        >{{ option.text }}</option>
      </select>
      <input type="text" name="url" placeholder="URL" v-model="url" required autocomplete="on" />
      <button @click="sendRequest">send</button>
    </div>
    <div class="inputBody" v-if="selected === 'POST' || selected === 'PUT'">
      <editor
        v-model="inputBody"
        @init="editorInit"
        lang="json"
        theme="chrome"
        class="editor"
        width="auto"
        height="200"
      ></editor>
    </div>
    <div class="outputBody">
      <span v-if="outputBody">{{`Status: ${status}`}}</span>
      <OutputComponent :content="outputBody" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OutputComponent from "../components/Output";
export default {
  name: "API",
  components: {
    OutputComponent,
    editor: require("vue2-ace-editor"),
  },
  data() {
    return {
      selected: "GET",
      url: "",
      inputBody: "",
      status: null,
      options: [
        { text: "GET", value: "GET" },
        { text: "POST", value: "POST" },
        { text: "PUT", value: "PUT" },
        { text: "DELETE", value: "DELETE" },
      ],
      outputBody: null,
    };
  },
  methods: {
    editorInit: function () {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/json");
      require("brace/theme/chrome");
      require("brace/snippets/json"); //snippet
    },
    sendRequest() {
      axios({
        method: this.selected,
        url: this.url,
        headers: { "content-type": "application/json" },
        data: this.inputBody,
      })
        .then((response) => {
          this.status = `${response.status} ${response.statusText}`;
          let prettyJson = JSON.stringify(response.data, undefined, 4);
          this.outputBody = prettyJson;
        })
        .catch((error) => {
          // this.status = `${response.status} ${response.statusText}`;
          console.log(error);
          this.outputBody = error.message;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.api {
  position: relative;
  width: 80%;
  margin: 0 auto;
  .header {
    display: flex;
    justify-content: center;

    select {
      width: auto;
      padding: 1em 0.5em;
    }
    option {
      padding: 30px;
    }
    input {
      width: 100%;
      padding: 1em 0.5em;
      font-size: 1em;
    }
    button {
      width: auto;
      padding: 1em 1em;
      font-size: 1em;
    }
  }
  .inputBody {
    margin: 1em 0;
  }
  .outputBody {
    position: relative;
    span {
      position: absolute;
      top: 50px;
      right: 20px;
      z-index: 1;
      color: green;
    }
  }
}
</style>
