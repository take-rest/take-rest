<template>
  <div class="outputBody">
    <h3>Response</h3>
    <textarea v-model="content" disabled></textarea>
  </div>
</template>

<script>
export default {
  name: "Output",
  props: ["content"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.outputBody {
  height: 20em;
  textarea {
    height: 20em;
    width: 100%;
    overflow-y: scroll;
  }
}
</style>
