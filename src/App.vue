<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div style="width:100%;margin: none; padding:none">
    <nav>
      <ul>
        <li> <a @click="updateShow('Synopsis')">Synopsis</a></li>
        <li><a @click="updateShow('Actors')">Actors</a></li>
        <li><a @click="updateShow('Costumes')">Costumes</a></li>
        <li><a @click="updateShow('PlaySound')">Timeline</a></li>
        <li><a @click="fart()">fart</a></li>
      </ul>
    </nav>

    <div>
      <!-- <CanvasComponent :planimage=test></CanvasComponent> -->

      <SynopsisComponent v-show="this.showComponentObject['Synopsis']" :synopsisText=scriptData.synopsis
        :title=scriptData.title></SynopsisComponent>

        <ActorsComponent v-show="this.showComponentObject['Actors']" :actor-list=scriptData.actorList
        @addActor="this.addActor($event)"
        @removeRoleActor="this.removeRoleActor($event.actor,$event.role)"
        @removeActor="this.removeActor($event)"
        ></ActorsComponent>
        
        <CostumesComponent v-show="this.showComponentObject['Costumes']"
        :character-list=scriptData.characterList
        @removeCharacter="this.removeCharacter($event.name)"
        @removeAccessoireCharacter="this.removeAccessoireCharacter($event.name,$event.accessoire)"
        @addCostume="this.addCostume($event)"
        ></CostumesComponent>


      <PlaySoundComponent v-show="this.showComponentObject['PlaySound']" :colorZone=colorZone :songZoneName=songZoneName
        :colorScene=colorScene :SceneKey=SceneKey :ZoneKey=ZoneKey :class="this.showSettings ? 'reduit' : 'plein'"
        @settingsDisplay="this.showSettings = !this.showSettings"></PlaySoundComponent>



      <SettingsComponent v-show="this.showSettings" :colorZone="this.colorZone" :colorScene="this.colorScene"
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

export default {
  name: 'App',
  components: {
    HelloWorld,
    PlaySoundComponent,
    SettingsComponent,
    ActorsComponent,
    SynopsisComponent,
    CostumesComponent,
    CanvasComponent
  },
  computed: {

  },
  methods: {
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
      this.colorZone[event.id] = event.value
    },
    updateColorScene(event) {
      this.colorScene[event.id] = event.value
    },
    updateZoneName(event) {
      console.log(event)
      this.songZoneName[event.id] = event.value
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
    removeAccessoireCharacter(character,costume){
          console.log(character)
            var find = this.scriptData.characterList.find(act => act.name===character)
            find.removeAccessoire(costume)
            // this.storageUpdate()
        },
        addCostume(evt){
            
            if(this.characterExists(evt.currentCharacter)){
                var character = this.scriptData.characterList.find(actor => actor.name === evt.currentCharacter)
                character.addAccessoire(evt.currentCostume)
            } else {
                this.scriptData.characterList.push(new Character(evt.currentCharacter,[evt.currentCostume],evt.currentInfo))
            }
            if(evt.currentInfo !== ""){
                var actor = this.scriptData.characterList.find(actor => actor.name === evt.currentCharacter)
                actor.moreInfo = evt.currentInfo
            }
            // this.storageUpdate()
        },
        characterExists(name){
            var kuk = this.scriptData.characterList.find(character => character.name === name)
            if(kuk !== undefined){
                return true
            } else {
                false
            }
        },
        removeCharacter(name){
            var found = this.scriptData.characterList.find(ac => ac.name === name)
            var ind = this.scriptData.characterList.indexOf(found)
            this.scriptData.characterList.splice(ind,1)
            // this.storageUpdate()
        }
  },
  data() {
    return {
      scriptData: {
        title: "someTitle",
        synopsis: "Synop",
        actorList: [
          new Actor("Marius", ["Ballzzy", "Ballzzy Old"], "Il est super impressive")
        ],
        characterList : [
          new Character("Topin",['couilles'],"moreInfo")
        ],
        scenes: [],
        plans: []
      },
      test: "prout",
      currentTab: "Synopsis",
      showComponentObject: {
        "Synopsis": true,
        "Actors": false,
        "Costumes": false,
        "PlaySound": false,
        "Settings": false
      },
      showSettings: false,
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
