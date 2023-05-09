<template>
    <div style="width:100%;height:100%;background-color: green;">
        <h2>Write your synopsis in here</h2>
        <MdEditor v-model="text" language="en-US" />
                  <!-- <div v-html=""></div> -->
    </div>
</template>
<script>
import { ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
export default{
    name: 'Synopsis',
    components: {
    MdEditor
  },
  data() {
    return {
         text : ref('# Hello Editor'),
      markdown : '# This is a heading \n\nSome **bold** and *italic* text'
    }},
    computed() {
   
  }
}
</script>
<style>
</style>