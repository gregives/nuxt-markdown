<template>
  <div>
    <button @click="count++">
      Increment counter
    </button>
    Current count: {{ count }}
  </div>
</template>

<script>
export default {
  props: {
    initial: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      count: null
    }
  },
  created () {
    this.count = this.initial
  }
}
</script>
