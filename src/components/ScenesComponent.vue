<template>
    <div>
        
        <h1>Define each plan</h1>
        <div style="display: inline;padding-bottom:20px">

            <button @click="this.previousZone()" style="display: inline;">Previous scene</button> 
            <p style="display: inline;margin: 150px;">{{ selectedId }}</p>
            <button style="display: inline;" @click="this.nextZone()">Next scene</button>
        </div>
        <audio style=" width: 80%;" ref="audioPlayerScene" controls @timeupdate="onPlaying">
      Your browser does not support the
      <code>audio</code> element.
    </audio>
    <div >
        <!-- <p>This scene is a {{ getUsableSceneData(selectedId).name }} and starts at : {{ formatSeconds(parseInt(selectedZone.timeDeb)) }} / Ends at : {{ formatSeconds(selectedZone.timeFin) }} </p>    -->
           <!-- <p>This scene starts at : {{ formatSeconds(parseInt(selectedZone.timeDeb)) }} {{ selectedZone.timeDeb}}/ Ends at : {{ formatSeconds(selectedZone.timeFin) }} </p>    -->

    </div> 
        <!-- <p>{{ selectedZone }}</p> -->
        
        <table class="mytable" id="tab">
            <tr>
              <th class="myth" style="width: 3%;">Scene N°</th>
              <th class="myth" style="width: 3%;"># Scene</th>
              <th class="myth" style="width: 40%;">Vue</th>
              <th class="myth">Description</th>
              <th class="myth">Paroles</th>
              <th class="myth">Acteurs</th>
              <th class="myth">Description generale Plan</th>
              <th class="myth">Couleur</th>
            </tr>

            <tr v-for="scene in sceneSelectedList" :key="scene"  >

              <td >{{ scene.id }}  <p>{{  getUsableSceneData(scene.id).name}}</p></td>
              <td >{{ scene.numeroDsZone }}
                <button style="margin-top:20px" @click="playSound(scene.timeDeb,scene.timeFin)">Play</button>
                <div>
                    <p>Debut : {{ formatSeconds(scene.timeDeb) }}</p>
                    <p>Fin : {{ formatSeconds(scene.timeFin) }}</p>
                </div>
            </td>
              <td class="mytd">
                    <CanvasComponent
                    :planImage="scene.planImage"
                    :backgroundColor="getBackground(scene.id)"
                    @updateImage=updateImage(scene.zone,scene.numeroDsZone,$event)></CanvasComponent>
              </td>
              <td class="mytd">
                <textarea class="custom-textarea" style="display:flex"  v-model=scene.description placeholder="more info you might add" @input="updateDescription(scene.zone,scene.numeroDsZone,$event.target.value)"></textarea>
</td>
              <td>
                <textarea class="custom-textarea" style="display:flex"  v-model=scene.paroles placeholder="more info you might add" @input="updateParoles(scene.zone,scene.numeroDsZone,$event.target.value)"></textarea>

              </td>
              <td style="display: block;margin-top:">
                <div style="height:100%">

                    <div style="height: 33.33%; margin: auto;">
  <ul style="list-style-type: none; padding: 0; margin: 0;">
    <li v-for="character in scene.characters" style="display: flex; align-items: center; padding: 5px;">
      <div style="flex: 1;">{{ character.name }}</div>
      <button style="background-color: #f32727; border: none; color: white; padding: 5px; border-radius: 5%;" @click="removeCharacter(scene.zone,scene.numeroDsZone,character)">X</button>
    </li>
  </ul>
</div>
      <div style="height: 33.33%;"> <select  v-model="selectedCharacter" style="display: block;margin:auto;margin-top: 20px; min-width: 100px;">
                        <option v-for="character in this.unusedCharacter(scene.zone,scene.numeroDsZone)" :value="character">{{ character.name }}</option>
                        <!-- Select to add a character : need props on characters -->
                    </select></div>
      <div style="height: 33.33%;margin:auto;margin-top: 20px;">
                    <button @click="addCharacter(scene.zone,scene.numeroDsZone)" style="display: block;margin:auto">AddChar</button></div>
                </div>

               
               
              </td>
            <td>{{ getUsableSceneData(scene.id).description }}</td>
            <td> <div :style="{backgroundColor : getUsableSceneData(scene.id).color }" style="width:60px; height:40px"></div></td>
             
            </tr>
          </table>
          
          <!-- mTODOOOO -->
          <textarea style="width:80%;margin-top:20px" class="custom-textarea" :value="getDescription" @change="updateDescriptionZone($event)" placeholder="informations about the scene"></textarea>
        
    </div>
</template>
<script>
import CanvasComponent from './CanvasComponent.vue'

export default{
    props: {
        currentSoundLink : {required : true, type : String},
        usableZoneList: { required: true, type: [Object] },
        usablePlanList: { required: true, type: [Object] },
        zoneList: { required: true, type: [Object] },
        planList: { required: true, type: [Object] },
        usableCharacterList : {required : true, type : [Object]}
    },
    watch: {
        currentSoundLink : {
            handler(newvalue, oldvalue) {
                console.log(newvalue)
                try{
                    
                                        const audioPlayer = this.$refs.audioPlayerScene;
                    
                          const reader = new FileReader();
                    
                          const songURL = newvalue;
                          audioPlayer.src = songURL;
                    
                          reader.onload = (event) => {
                            // this.audioPlayer = this.$refs.audioPlayer;
                            audioPlayer.src = event.target.result;

                };
    
                } catch(e){
                    console.log("zbiii")
                }
    },
    immediate: true

        },
        /* Watch an individual property */
        planList: {
            handler(newValue, oldValue) {
            // Do something with the new and old values
            this.planListIntra = newValue
            // this.planListIntra = newValue
            },
            /* Specify other options if needed */
            deep: true,
            immediate: true
        },
        zoneList: {
            handler(newValue, oldValue) {
            // Do something with the new and old values
            this.zoneListIntra = newValue
            // this.planListIntra = newValue
            },
            /* Specify other options if needed */
            deep: true,
            immediate: true
        },
        
  },
    data() {
        return {
            index: 0,
            zoneListIntra : this.zoneList,
            planListIntra : this.planList,
            selectedCharacter: ''
        };
    },
    computed: {
        planListComp(){
            return this.planList
        },
        usableCharacterListComp(){
            return this.usableCharacterList
        },
        selectedId() {
            if (this.idList.length > 0) {
                console.log("idlist", this.idList);
                return this.idList[this.index];
            }
            else {
                return 0;
            }
        },
        idList() {
            console.log(this.zoneList);
            const filteredList = this.zoneList
                .map(zone => zone.numero); // Extract the age attribute from each object
            console.log(filteredList);
            return Array.from(new Set(filteredList));
        },
        nbZone() {
            return this.idList.length;
        },
        selectedZone(){
            return this.zoneList.filter(zone => zone.numero === this.selectedId);

        },
       
        sceneSelectedList() {
            return this.planList.filter(scene => scene.zone === this.selectedId);
        },
        getDescription(){
            var a = this.zoneListIntra.filter(zone => zone.numero === this.selectedId)
            if(a[0]!==undefined){
                return a[0].description

            }
            return null
        }
    },
    methods: {
        updateDescriptionZone(evt){
            var a = this.selectedZone
            console.log(a)
            this.$emit('updateDescriptionZone',{ zonenb : a[0].numero , value : evt.target.value})
            
        },
        formatSeconds(seconds) {
  const dateObj = new Date(seconds * 1000);
  const minutes = dateObj.getUTCMinutes();
  const secondsFormatted = dateObj.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = Math.floor(dateObj.getUTCMilliseconds() / 10).toString().padStart(2, '0');
  return `${minutes}:${secondsFormatted}.${milliseconds}`;
},
        onPlaying() {
      const audioPlayer = this.$refs.audioPlayerScene;
      if (!audioPlayer) {
        return;
      }
      this.currentTime = audioPlayer.currentTime;
      this.seekValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    },
    onSeek() {
      const audioPlayer = this.$refs.audioPlayerScene;
      const seekto = audioPlayer.duration * (this.seekValue / 100);
      audioPlayer.currentTime = seekto;
    },
        playSound(timedeb,timefin){
            const audioPlayer = this.$refs.audioPlayerScene;
        audioPlayer.currentTime = timedeb; // start playing from 5 seconds
        if(audioPlayer.paused){
            audioPlayer.play();

        } else {
            audioPlayer.pause()
        }

        this.endTime = timefin; // end playing at 10 seconds
        audioPlayer.addEventListener('timeupdate', () => {
      if (audioPlayer.currentTime >= this.endTime) {
        audioPlayer.pause();
      }
    });
        },
        getBackground(id){
            return this.usablePlanList.find(plan => plan.id === id).color
        },
        unusedCharacter(zone,nbDsZone){
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            return this.usableCharacterListComp.filter(item => !scene.characters.includes(item));
        },
        updateImage(zone,nbDsZone,evt){
            console.log(this.planListComp)
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            console.log(zone,nbDsZone)
            scene.planImage = evt.planImage
            scene.planData = evt.data
            this.$emit('sceneUpdated',scene)
        },
        updateDescription(zone,nbDsZone,evt){
            console.log(this.planListComp)
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            console.log(zone,nbDsZone)
            scene.description = evt
            this.$emit('sceneUpdated',scene)
        },
        addCharacter(zone,nbDsZone){
            console.log(this.planListComp)
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            console.log(zone,nbDsZone)
            if(this.selectedCharacter!== ''){

                scene.characters.push(this.selectedCharacter)
                this.$emit('sceneUpdated',scene)
            }
        },
        removeCharacter(zone,nbDsZone,char){
            console.log(this.planListComp)
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            console.log(zone,nbDsZone)
       
                scene.characters.splice(scene.characters.indexOf(char),1)
                this.$emit('sceneUpdated',scene)
            
        },
        updateParoles(zone,nbDsZone,evt){
            console.log(this.planListComp)
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            console.log(zone,nbDsZone)
            scene.paroles = evt
            this.$emit('sceneUpdated',scene)
        },
        getUsableSceneData(id) {
            return this.usablePlanList.find(a => a.id === id);
        },
        nextZone() {
            this.index = ((this.index + 1) % this.nbZone);
        },
        previousZone() {
            this.index === 0 ? this.index = this.nbZone - 1 : this.index = this.index - 1;
        }
    },
    components: { CanvasComponent }
}

</script>
<style>
  .mytable {
    border-collapse: collapse;
    table-layout: fixed;
    position: relative;
    margin-top: 20px;
    width:100%
 
  }
  .myth,
  .mytd {
   
    resize: horizontal;
    overflow: auto;
  }
</style>