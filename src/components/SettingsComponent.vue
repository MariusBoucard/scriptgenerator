<template>
<div class="settingscomp" style="margin-top: 0px;">
<!-- Display the zone keys -->
<!-- put descriptif scenes as well -->
<h2>Color for differents Zones</h2>

    <ul style="list-style: none;">
        <li v-for="color in colorZoneComp"  > Zone n° {{ color.id }} : 
<input type="color"   :value=color.value  @input="updateColorScene(color.id,$event.target.value)">
</li>
    </ul>

    <h2>Color for differents scenes</h2>
<ul style="list-style: none;">
        <li v-for="color in colorSceneComp"  >Scene n° {{ color.id }} : 
<input type="color"  :value=color.value  @input="updateZoneName(color.id,$event.target.value)">
</li>
    </ul>
    <ul style="list-style: none;">
        <li v-for="text in songZoneNameComp"  >
            Zone n° {{ text.id }}       <textarea :value="text.value" @input="updateZoneName(text.id,$event.target.value)"></textarea>
</li>
    </ul>
</div>
</template>
<script>

export default {
  
    props : {
        colorZone : {require :  true, type : Object},
        songZoneName :  {require :  true, type : Object},
        colorScene : {require :  true, type : Object},
        SceneKey : {require :  true, type : Object},
        ZoneKey :  {require :  true, type : Object}
    },
    computed : {
        colorZoneComp(){
            if(this.colorZone!== null){
                return this.formatAsArray(this.colorZone)
            }
        },
        colorSceneComp(){
            if(this.colorScene!== null){
                return this.formatAsArray(this.colorScene)
            }
        },
        songZoneNameComp(){
            if(this.songZoneName!== null){
                return this.formatAsArray(this.songZoneName)
            }
        }
    } ,
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
        formatAsArray(obj){
            var keys = Object.keys(obj);
            
            var formattedArray = []
            keys.forEach(
                attribute => {
                    formattedArray.push({ "id" : attribute , "value" : obj[attribute] })
                }

            )
            return formattedArray
        },
        setColor() {
            var found = this.colorZone.find
            this.$emit('color',Object)
        }
    }
}
</script>
<style>
.settingscomp{
    background-color: rgba(120,120,120,0.5);
    
}

</style>