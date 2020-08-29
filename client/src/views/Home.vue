<template>
  <div class="home">
    <InputComponent />
  </div>
</template>

<script>
// @ is an alias to /src
import InputComponent from "@/components/Input.vue";

export default {
  name: "Home",
  components: {
    InputComponent,
  },
};
</script>
