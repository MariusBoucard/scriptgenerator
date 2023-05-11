<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div style="width:100%;margin: none; padding:none">
    <nav>
      <ul>
        <li> <a @click="updateShow('Synopsis')">Synopsis</a></li>
        <li><a @click="updateShow('Actors')">Actors</a></li>
        <li><a @click="updateShow('Costumes')">Costumes</a></li>
        <li><a @click="updateShow('PlaySound')">Timeline</a></li>
        <li><a @click="updateShow('ZoneAndPlanSettings')">Settings </a></li>
        <li><a @click="updateShow('Scenes')">Scenes </a></li>

      </ul>
    </nav>

    <div>
      <ScenesComponent v-show="this.showComponentObject['Scenes']"
            :usableZoneList=scriptData.usableZoneList
            :usablePlanList=scriptData.usablePlanList
            :zoneList=scriptData.timeline.zoneList
            :planList=scriptData.timeline.planList
            :usableCharacterList=scriptData.characterList
            @sceneUpdated="updateScene($event)"
            ></ScenesComponent>
      <!-- <CanvasComponent :planimage=test></CanvasComponent> -->
      <ZoneAndPlanSettingsComponent v-show="this.showComponentObject['ZoneAndPlanSettings']" :zoneList=scriptData.usableZoneList :planList=scriptData.usablePlanList
        @zoneUpdate="this.scriptData.usableZoneList = $event" @planUpdate="this.scriptData.usablePlanList = $event"
        @deletePlan="this.deleteUsablePlan($event)" @deleteZone="this.deleteUsableZone($event)"
        @changePlanColor="this.changePlanColor($event)" @changeZoneColor="this.changeZoneColor($event)"
        @nameZoneChanged="this.nameZoneChanged($event)" @namePlanChanged="this.namePlanChanged($event)"
        @descriptionPlanChanged="this.descriptionPlanChanged($event)"></ZoneAndPlanSettingsComponent>




      <SynopsisComponent v-show="this.showComponentObject['Synopsis']" :synopsisText=scriptData.synopsis
        :title=scriptData.title></SynopsisComponent>

      <ActorsComponent v-show="this.showComponentObject['Actors']" :actor-list=scriptData.actorList
        @addActor="this.addActor($event)" @removeRoleActor="this.removeRoleActor($event.actor, $event.role)"
        @removeActor="this.removeActor($event)"></ActorsComponent>

      <CostumesComponent v-show="this.showComponentObject['Costumes']" :character-list=scriptData.characterList
        @removeCharacter="this.removeCharacter($event.name)"
        @removeAccessoireCharacter="this.removeAccessoireCharacter($event.name, $event.accessoire)"
        @addCostume="this.addCostume($event)"></CostumesComponent>


      <PlaySoundComponent v-show="this.showComponentObject['PlaySound']" 
        
        :songPathProp="this.scriptData.timeline.songPath"

        :visible="this.showComponentObject['PlaySound']"

        :usablePlanList=scriptData.usablePlanList
        :usableZoneList="scriptData.usableZoneList"
        :class="this.showSettings ? 'reduit' : 'plein'"
        :planList=scriptData.timeline.planList
        :listeZone=scriptData.timeline.zoneList

        @settingsDisplay="this.showSettings = !this.showSettings"
        @planUpdated="updatePlan($event)"
        @zoneUpdated="updateZone($event)"
        @fileLoad="fileLoad($event)"
        
        ></PlaySoundComponent>



      <SettingsComponent v-show="this.showSettings" 
        :colorZone="this.colorZone" 
        :colorScene="this.colorScene"
        :usableZoneList="this.scriptData.usableZoneList"
        :usablePlanList="this.scriptData.usablePlanList"
        :songZoneName="this.songZoneName" :SceneKey=SceneKey :ZoneKey=ZoneKey @colorSceneUpdate="updateColorScene($event)"
        @colorZoneUpdate="updateColorZone($event)" @zoneNameUpdate="updateZoneName($event)"
        :class="this.showSettings ? 'settings' : ''"></SettingsComponent>



    </div>

  </div>
</template>

<script>
import Flag from './class/Flag';
import Actor from './class/Actor';
import CanvasComponent from './components/CanvasComponent.vue'
import ActorsComponent from './components/ActorsComponent.vue';
import CostumesComponent from './components/CostumesComponent.vue';
import HelloWorld from './components/HelloWorld.vue'
import PlaySoundComponent from './components/PlaySoundComponent.vue';
import SettingsComponent from './components/SettingsComponent.vue';
import SynopsisComponent from './components/SynopsisComponent.vue';
import Character from './class/Character';
import ZoneAndPlanSettingsComponent from './components/ZoneAndPlanSettingsComponent.vue';
import PartiesSong from './class/PartiesSong';
import ScenesComponent from './components/ScenesComponent.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    PlaySoundComponent,
    SettingsComponent,
    ActorsComponent,
    SynopsisComponent,
    CostumesComponent,
    CanvasComponent,
    ZoneAndPlanSettingsComponent,
    ScenesComponent
},
  computed: {

  },
  methods: {
    save(){
      localStorage.setItem('saveApp',JSON.stringify(this.scriptData))
    },
    load(){
      if(localStorage.getItem('saveApp')){
        this.scriptData =JSON.parse(localStorage.getItem('saveApp'))
      }
    },
    updateScene(evt){
      var scene = this.scriptData.timeline.planList.find(plan => plan.zone === evt.zone && plan.nbDsZone === evt.nbDsZone)
      scene = evt
      console.log("update Scene",this.scriptData.timeline.planList)
      this.save()
    },
    updatePlan(evt){
      this.scriptData.timeline.planList = evt
      console.log("updatePlan",this.scriptData.timeline.planList)
      this.save()


    },
    fileLoad(evt){
      console.log("fileLoad",evt)
      this.scriptData.timeline.songPath=evt
      this.save()

    },
    updateZone(evt){
      this.scriptData.timeline.zoneList = evt
      console.log("updateZone",this.scriptData.timeline.zoneList)
      this.save()


    },
    descriptionPlanChanged(evt) {
      //TODO use id to handle border effect
      var id = evt.id
      this.scriptData.usablePlanList = evt.list
      console.log("descPlanCHanged", this.scriptData.usablePlanList)
      this.save()

    },
    nameZoneChanged(evt) {
      //TODO use id to handle border effect
      var id = evt.id
      this.scriptData.usableZoneList = evt.list
      console.log("nameZoneChanges", this.scriptData.usableZoneList)
      this.save()

    },
    namePlanChanged(evt) {
      //TODO use id to handle border effect
      var id = evt.id
      this.scriptData.usablePlanList = evt.list
      console.log("namplanCanges", this.scriptData.usablePlanList)
      this.save()


    },
    changePlanColor(evt) {
      //TODO use id to handle border effect
      var id = evt.id
      this.scriptData.usablePlanList = evt.list
      this.save()

    },
    changeZoneColor(evt) {
      //TODO use id to handle border effect

      var id = evt.id
      this.scriptData.usableZoneList = evt.list
      this.save()

    },
    deleteUsablePlan(evt) {
      //TODO better with border effect
      this.scriptData.usablePlanList = evt
      this.save()

    },
    deleteUsableZone(evt) {
      //TODO better with border effect

      this.scriptData.usableZoneList = evt
      this.save()


    },
    fart() {
      this.test = new Flag(1, 1.2, 1.5, "#000000")
      console.log(this.test)
    },
    updateShow(name) {
      var keys = Object.keys(this.showComponentObject)
      keys.forEach(key => {
        if (key === name) {
          this.showComponentObject[key] = true
        } else {
          this.showComponentObject[key] = false

        }
      })
      this.showSettings = false
    },
    updateColorZone(event) {
      var found = this.scriptData.usableZoneList.find(zone => zone.id === event.id)
      found.color = event.value
      console.log("found", found.color)
      this.save()

    },
    updateColorScene(event) {
      var found = this.scriptData.usablePlanList.find(zone => zone.id === event.id)
      found.color = event.value
      this.save()

    },
    updateZoneName(event) {
      var found = this.scriptData.usableZoneList.find(zone => zone.id === event.id)
      found.name = event.value
      this.save()

    },
    removeRoleActor(name, character) {

      var find = this.scriptData.actorList.find(act => act.name === name)
      find.removeRole(character)
      // this.storageUpdate()
    },
    addActor(evt) {
      if (this.actorExist(evt.currentActor)) {
        var actor = this.scriptData.actorList.find(actor => actor.name === evt.currentActor)
        actor.addRole(evt.currentCharacter)
      } else {
        this.scriptData.actorList.push(new Actor(evt.currentActor, [evt.currentCharacter], evt.currentInfo))
      }
      if (evt.currentInfo !== "") {
        var actor = this.scriptData.actorList.find(actor => actor.name === evt.currentActor)
        actor.moreInfo = evt.currentInfo
      }
      // this.storageUpdate()
    },
    actorExist(name) {
      var kuk = this.scriptData.actorList.find(actor => actor.name === name)
      if (kuk !== undefined) {
        return true
      } else {
        false
      }
    },
    removeActor(name) {
      var found = this.scriptData.actorList.find(ac => ac.name === name)
      var ind = this.scriptData.actorList.indexOf(found)
      this.scriptData.actorList.splice(ind, 1)
    },
    removeAccessoireCharacter(character, costume) {
      console.log(character)
      var find = this.scriptData.characterList.find(act => act.name === character)
      find.removeAccessoire(costume)
      // this.storageUpdate()
    },
    addCostume(evt) {

      if (this.characterExists(evt.currentCharacter)) {
        var character = this.scriptData.characterList.find(actor => actor.name === evt.currentCharacter)
        character.addAccessoire(evt.currentCostume)
      } else {
        this.scriptData.characterList.push(new Character(evt.currentCharacter, [evt.currentCostume], evt.currentInfo))
      }
      if (evt.currentInfo !== "") {
        var actor = this.scriptData.characterList.find(actor => actor.name === evt.currentCharacter)
        actor.moreInfo = evt.currentInfo
      }
      // this.storageUpdate()
    },
    characterExists(name) {
      var kuk = this.scriptData.characterList.find(character => character.name === name)
      if (kuk !== undefined) {
        return true
      } else {
        false
      }
    },
    removeCharacter(name) {
      var found = this.scriptData.characterList.find(ac => ac.name === name)
      var ind = this.scriptData.characterList.indexOf(found)
      this.scriptData.characterList.splice(ind, 1)
      // this.storageUpdate()
    }
  },
  data() {
    return {
      scriptData: {
        title: "someTitle",
        synopsis: "Synop",
        actorList: [
         
        ],
        characterList: [
         
        ],
        timeline: {
          songPath: [],
          zoneList: [],
          planList: []
        },
        usableZoneList: [
      

        ],
        usablePlanList: [
         

        ]
      },
      test: "prout",
      currentTab: "Synopsis",
      showComponentObject: {
        "Synopsis": true,
        "Actors": false,
        "Costumes": false,
        "PlaySound": false,
        "Settings": false,
        "ZoneAndPlanSettings" : false,
        "Scenes" : false
      },
      showSettings: false,
    }
  },
  mounted(){
    this.load()
  }
}
</script>

<style lang="scss">
.reduit {
  display: inline-block;
  width: 80%;
  margin: auto !important;
}

.plein {
  display: inline-block;

  width: 100%;
}

.settings {
  display: inline-block;

  width: 20%;
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


// Navbar css
nav {
  background-color: #333;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

nav li {
  margin: 0 10px;
}

nav a {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 10px;
}

nav a:hover {
  background-color: #555;
}
</style>
