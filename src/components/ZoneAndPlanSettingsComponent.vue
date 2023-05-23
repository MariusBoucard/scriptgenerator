<template>
<div>
    <h1>Name of the Script</h1>
<input type="text" style="font-size: larger;" @change="updateTitle()" v-model="titleInside" input>
<h1>Author</h1>
<input type="text" style="font-size: larger;" @change="updateAuthor()" v-model="authorInside" input>


    <h1>List of differents plans of the clip (Havn't found a relevant name for it yet)</h1>
    <div ref="planList">
      
          <table id="tab" style="width:80%;margin:auto">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Color</th>
              <th>key</th>
              <th>Remove</th>
            </tr>

            <tr v-for="plan in this.planList" >

              <td>{{ plan.id }}</td>
              <td><input @change="this.changePlanName(plan.id,$event.target.value)" :value="plan.name" type="text"/> </td>
              <td> <input @change="this.changePlanDescription(plan.id,$event.target.value)" :value="plan.description" type="text"/></td>
              
              <td>
                <input @change="this.changePlanColor(plan.id,$event.target.value)" :value="plan.color" type="color"/>
              </td> 
              <td>
                {{ plan.key }}
              </td>
              <td>
                  <button @click="this.deletePlan(plan.id)">del plan</button>
              </td>
            </tr>
          </table>

    </div>
    <h1>List of differents parts in the song</h1>
    <div ref="zoneList">
        <table id="tab" style="width:80%;margin:auto">
            <tr>
              <th>Id</th>
              <th>Name</th>
             
              <th>Color</th>
              <th>key</th>
              <th>Remove</th>
            </tr>
            <tr v-for="part in this.zoneList" >
                <td>{{ part.id }}</td>
                <td><input @change="this.changeZoneName(part.id,$event.target.value)" :value="part.name" type="text"/></td>
                <td><input @change="this.changeZoneColor(part.id,$event.target.value)" :value="part.color" type="color"/></td>
                <td>{{ part.key }}</td>
                <td><button @click="this.deleteZone(part.id)">del zone</button></td>
            </tr>

        </table>
       
    </div>

    <div ref="addThings" style="display:block !important">
        <div v-show="this.alreadyTaken" >id or Key Already taken</div>
        <div>
            <label for="input-id"> Enter ID : </label>
            <input v-model="this.currentId" placeholder="id" id="input-id" type="number"/>
            <label for="input-name"> Enter name : </label>
            <input v-model="this.currentName" placeholder="name" id="input-name" type="text"/>
        </div>
        <div>

            <label for="input-description">Enter description : </label>
            <input v-model="this.currentDescription" placeholder="description" id="input-description" type="text"/>
            <label for="input-key">Enter key : </label>
            <input v-model="this.currentKey" placeholder="key" id="input-key" type="text"/>
        </div>
        <div>
            <label for="input-color">Enter color : </label>
            <input v-model="this.currentColor" type="color" id="input-color"/>
        </div>



        <div >
            <button style="margin:10px" @click="addPlan()">addPlan</button>
            <button  style="margin:10px" @click="addZone()">addZone</button>

        </div>

    </div>

</div>
</template>
<script>
export default{
    props : {
        title : {require : true,type : String},
        author :  {require : true,type : String},
        planList : {required : true, type :[Object]},
        zoneList : {required : true, type :[Object]}
    },
    watch : {
        author : {
            handler(newvalue,oldvalue){
                this.authorInside = newvalue
            }
        },
        title : {
            handler(newvalue,oldvalue){
                this.titleInside = newvalue
            }
        },
        planList : {
            handler(newValue,oldValue){
                this.planListInside = newValue
            }
        },
        zoneList : {
            handler(newValue,oldValue){
                this.zoneListInside = newValue
            }
        }
    },
    data(){
        return {
            titleInside : this.title,
            planListInside : this.planList,
            zoneListInside : this.zoneList,
            currentKey : "",
            currentDescription :"",
            currentId:0,
            currentName:"",
            currentColor : "#000000",
            alreadyTaken : false

        }
    },
    methods : {
        updateTitle(){
            this.$emit('updateTitle',this.titleInside)
            console.log("titleUpdated")
        },
        updateAuthor(){
            this.$emit('updateAuthor',this.authorInside)
            console.log("autorUpdated")
            
        },
        getPlan(id){
            return this.planListInside.find(plan => String(plan.id) === String(id))
        },
        getZone(id){
            return this.zoneListInside.find(zone => String(zone.id) === String(id))

        },
        changePlanDescription(id,desc){
            var plan = this.getPlan(id)
            plan.description = desc
            this.$emit('descriptionPlanChanged',{ id : id, list : this.planListInside})

        },
        changePlanColor(id,color){
            var plan = this.getPlan(id)
            plan.color = color
            this.$emit('colorPlanChanged',{ id : id, list : this.planListInside})

        },
        changeZoneColor(id,color){
            var plan = this.getZone(id)
            plan.color = color
            console.log("color changed",color)
            this.$emit('colorZoneChanged',{ id : id, list : this.zoneListInside})

        },
        changePlanName(id,name){
            var plan = this.getPlan(id)
            plan.name = name
            this.$emit('namePlanChanged',{ id : id, list : this.planListInside})
        },
        changeZoneName(id,name){
            var zone = this.getZone(id)
            zone.name = name
            this.$emit('nameZoneChanged',{ id : id, list : this.zoneListInside})
        },
        deletePlan(id){
            var index = this.planListInside.indexOf(this.getPlan(id))
            this.planListInside.splice(index,1)
            this.$emit('deletePlan',this.planListInside)
            //TODO Anticipate border effects on objects name after this
        },
        deleteZone(id){
            var index = this.zoneListInside.indexOf(this.getZone(id))
            this.zoneListInside.splice(index,1)
            this.$emit('deleteZone',this.zoneListInside)

            //TODO Anticipate border effects on objects name after this
        },
        addPlan(){
            // Check if id already taken :
            if(!this.planListInside.find(plan => parseInt(plan.id) === this.currentId) && !this.planListInside.find(plan => parseInt(plan.key) === this.currentKey.charCodeAt(0) && this.currentKey.charCodeAt(0) !== NaN)){
                this.planListInside.push(
                    {
                        id : this.currentId ,
                        name: this.currentName,
                        description : this.currentDescription,
                        key: this.currentKey.charCodeAt(0),
                        color : this.currentColor
                    }
                )
                this.alreadyTaken = false


            } else{
                this.alreadyTaken = true
            }
            this.$emit('planUpdate',this.planListInside)

        },
        addZone(){
            if(!this.zoneListInside.find(zone => parseInt(zone.id) === this.currentId) && !this.zoneListInside.find(plan => parseInt(plan.key) === this.currentKey.charCodeAt(0) && this.currentKey.charCodeAt(0) !== NaN)){
                this.zoneListInside.push(
                    {
                        id : this.currentId ,
                        name: this.currentName,
                        key: this.currentKey.charCodeAt(0),
                        color : this.currentColor
                    }
                )
                this.alreadyTaken = false


            } else{
                this.alreadyTaken = true
            }
            
            this.$emit('zoneUpdate',this.zoneListInside)
        }
    }
}
</script>