<template>
    <div style="width:80%;height:100vh;background-color: ;margin:auto">
        <h2 @click="test()">Write your synopsis for {{ this.title }} in here</h2>
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

  props:{
    synopsisText : { required : true , type : String},
    title : { required : true , type : String}
  },
  data() {
    return {
      text : this.synopsisText,
    }},
    computed() {
   
  },
  methods: {
    test(){
      console.log(this.synopsisText)
    }
  },
}
</script>
<style>
</style>