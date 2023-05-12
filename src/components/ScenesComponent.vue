<template>
    <div>
        
        <h1>Define each plan</h1>
        <div style="display: inline;padding-bottom:20px">

            <button @click="this.previousZone()" style="display: inline;">Previous scene</button> 
            <p style="display: inline;margin: 150px;">{{ selectedId }}</p>
            <button style="display: inline;" @click="this.nextZone()">Next scene</button>
        </div>
        
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

            <tr v-for="scene in sceneSelectedList" :key="item"  >

              <td >{{ scene.id }}  <p>{{  getUsableSceneData(scene.id).name}}</p></td>
              <td >{{ scene.numeroDsZone }}</td>
              <td class="mytd">
                    <CanvasComponent
                    :planImage="scene.planImage"
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
           
              
        
    </div>
</template>
<script>
import CanvasComponent from './CanvasComponent.vue'

export default{
    props: {
        usableZoneList: { required: true, type: [Object] },
        usablePlanList: { required: true, type: [Object] },
        zoneList: { required: true, type: [Object] },
        planList: { required: true, type: [Object] },
        usableCharacterList : {required : true, type : [Object]}
    },
    data() {
        return {
            index: 0,
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
        sceneSelectedList() {
            return this.planList.filter(scene => scene.zone === this.selectedId);
        }
    },
    methods: {
        unusedCharacter(zone,nbDsZone){
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            return this.usableCharacterListComp.filter(item => !scene.characters.includes(item));
        },
        updateImage(zone,nbDsZone,evt){
            console.log(this.planListComp)
            var scene = this.planListComp.find(plan => plan.zone===zone && plan.numeroDsZone === nbDsZone)
            console.log(zone,nbDsZone)
            scene.planImage = evt
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
            console.log("getUsa", this.usablePlanList.find(a => a.id === id));
            return this.usablePlanList.find(a => a.id === id);
        },
        nextZone() {
            this.index = ((this.index + 1) % this.nbZone);
        },
        previousZone() {
            this.index === -1 ? this.index = this.nbZone - 1 : this.index = this.index - 1;
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