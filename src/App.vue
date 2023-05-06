<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div style="width:100%;">
    <div >
     

    <PlaySoundComponent :colorZone=colorZone
                        :songZoneName=songZoneName
                        :colorScene=colorScene
                        :SceneKey=SceneKey
                        :ZoneKey=ZoneKey 
                        :class="this.showSettings ? 'reduit' : 'plein'"
                        @settingsDisplay = "this.showSettings = !this.showSettings"
                        ></PlaySoundComponent> 
                        
                        
                        
                        <SettingsComponent v-show="this.showSettings" :colorZone="this.colorZone"
                        :colorScene="this.colorScene"
                        :songZoneName="this.songZoneName"
    
    
    @colorSceneUpdate="updateColorScene($event)"
    @colorZoneUpdate="updateColorZone($event)"
    @zoneNameUpdate="updateZoneName($event)"
    :class="this.showSettings ? 'settings' : ''"
    ></SettingsComponent>



    </div>
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PlaySoundComponent from './components/PlaySoundComponent.vue';
import SettingsComponent from './components/SettingsComponent.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    PlaySoundComponent,
    SettingsComponent
},
methods : {
  updateColorZone(event){
  this.colorZone[event.id] = event.value
  },
  updateColorScene(event){
  this.colorScene[event.id] = event.value
  },
  updateZoneName(event){
    console.log(event)
  this.songZoneName[event.id] = event.value
  }
},
  data() {
    return {
      showSettings : true,
      ZoneKey: {
        "1": '65',
        "2": '90',
        "3": '69',
        "4": '82',
        "5": '84',
        "6": '89',
      },
      SceneKey: {
        "1": '49',
        "2": '50',
        "3": '51',
        "4": '52',
        "5": '53',
        "6": '54',
      },
      colorScene: {
        "1": '#33cc33',
        "2": '#ff9900',
        "3": '#ff3300',
        "4": '#ffff00',
        "5": '#f8e45c',
        "6": '#ffccff',
      },
      colorZone: {
        "1": '#33cc33',
        "2": '#ff9900',
        "3": '#ff3300',
        "4": '#ffff00',
        "5": '#f8e45c',
        "6": '#ffccff',
      },
      songZoneName: {
        "1": 'intro',
        "2": 'verse',
        "3": 'chorus',
        "4": 'bridge',
        "5": 'solo',
        "6": 'transition',
      },
    }
  }
}
</script>

<style lang="scss">
.reduit{
  display: inline-block;
  width:80%;
  margin:0px !important;
}
.plein{
  display: inline-block;

  width:100%;
}
.settings{
  display: inline-block;

  width:20%;
  margin: 0px !important
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
