<template>
    <div style="width:80%;height:100vh;background-color: ;margin:auto">
        <h2 @click="test()">Write your synopsis for {{ this.title }} in here</h2>
        <MdEditor v-model="text"  @blur="changeSynopsis()" language="en-US" />
                  <!-- <div v-html=""></div> -->
    </div>
</template>
<script>

import { ref, watch } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

export default {
  name: 'Synopsis',
  components: {
    MdEditor
  },
  props: {
    synopsisText: { required: true, type: String },
    title: { required: true, type: String }
  },
  setup(props) {
    const text = ref(props.synopsisText);

    watch(() => props.synopsisText, (newValue) => {
      text.value = newValue;
    }, { immediate: true });

    return {
      text
    };
  },
  methods : {
    changeSynopsis() {
      this.$emit('updateSynopsis', this.text);
    }

  }

};
</script>
<style>
</style>