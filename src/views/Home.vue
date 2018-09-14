<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <JobTemplater />
  </div>
</template>

<script>
// @ is an alias to /src
import JobTemplater from '@/components/JobTemplater.vue'

export default {
  name: 'home',
  components: {
    JobTemplater
  }
}
</script>
