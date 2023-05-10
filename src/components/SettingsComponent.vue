<template>
<div class="settingscomp" style="margin-top: 0px;">
<!-- Display the zone keys -->
<!-- put descriptif scenes as well -->


<h2>Color for differents Plans</h2>

    <ul style="list-style: none;">
        <li v-for="color in usablePlanListComp"  > Plan n° {{ color.id }} : 
<input type="color"   :value=color.color  @input="updateColorScene(color.id,$event.target.value)"> | {{ String.fromCharCode(color.key) }}
</li>
    </ul>

    <h2>Color for differents Songs Parts</h2>
<ul style="list-style: none;">
        <li v-for="color in usableZoneListComp"  >Part n° {{ color.id }} : 
<input type="color"  :value=color.color  @input="updateColorZone(color.id,$event.target.value)">  | {{ String.fromCharCode(color.key) }}
</li>
    </ul>
    <h2>Name of differents zones</h2>
    <ul style="list-style: none;">
        <li v-for="text in usableZoneListComp"  >
            Zone n° {{ text.id }}       <textarea :value="text.name" @input="updateZoneName(text.id,$event.target.value)"></textarea>
</li>
    </ul>
</div>
</template>
<script>

export default {
  
    props : {
        usableZoneList : {required : true, type : [Object]},
        usablePlanList : {required : true, type : [Object]},

      
    },
    computed : {
        usablePlanListComp(){
            return this.usablePlanList
        },
        usableZoneListComp(){
            return this.usableZoneList
        }
    },
    
    
    methods : {
        updateColorZone(id,val){
            this.$emit('colorZoneUpdate',{ "id" : id,"value" : val })
        },
        updateColorScene(id,val){
            this.$emit('colorSceneUpdate',{ "id" : id,"value" : val })
        },
        updateZoneName(id,val){
            this.$emit('zoneNameUpdate',{ "id" : id,"value" : val })
        },
      
    
    }
}
</script>
<style>
.settingscomp{
    background-color: rgba(120,120,120,0.5);
    
}

</style>