<template>
<div>
        <h1>List of actors</h1>
    <ul class="actor-list">
        <li v-for="actor in actorList">
            <div @click="actor.displayDetails =! actor.displayDetails" title="Display some more information about the author">
                <p style="display:inline-block">{{ actor.name }} :</p>
                 <ul style="list-style: none; padding: 0; margin: 0;display:inline-block">
  <li v-for="char in actor.role" style="  display: inline-block;  margin-right: 10px; "  @contextmenu="this.$emit('removeRoleActor',{ 'actor' : actor.name, 'role' : char})" title="Right click to remove me">{{ char }}</li>
</ul>

                  <button @click="this.$emit('removeActor',actor.name)">Remove actor</button>
            </div>
            <div v-show="actor.displayDetails">{{ actor.moreInfo }}</div>
     
    </li>
    </ul>
    <div class="form-container">
        <h3>Add an actor or a role to him</h3>
        <div class="form-group">
          <select v-model="this.currentActorDrop">
                    <option v-for="out in actorList" :value="out.name">{{out.name}}</option>
                </select>
            <input type="text" v-model="this.currentActor" placeholder="Actor name"/>
            <input type="text" v-model="this.currentCharacter"  placeholder="Character he will play"/>
            <button @click="addActor()">
                Add it to list
            </button>

        </div>
        <div class="form-group">

            <textarea class="custom-textarea" style="display:flex" v-model="this.currentInfo" placeholder="more info you might add"></textarea>

        </div>


    </div>
    
</div>
</template>
<script>
import Actor from '@/class/Actor';

export default{
  props : {
    actorList : {required : true, type : [Object]}
  },
    mounted(){
        if(localStorage.getItem('actorList')!==null){
            // this.actorList =  JSON.parse(localStorage.getItem('actorList')).map(actorData => new Actor(actorData.name, actorData.role, actorData.moreInfo));
        }
    },
    data(){
        return {
           
            currentActor:"",
            currentCharacter:"",
            currentInfo : "",
            currentActorDrop : "",
        }
    },
    methods : {
        storageUpdate(){
            localStorage.setItem('actorList',JSON.stringify(this.actorList))
        },
        addActor(){
        var actorAdd = ""
          if(this.currentActor ===""){
            actorAdd = this.currentActorDrop
          }else {
            actorAdd = this.currentActor
          }
          this.$emit('addActor', {
              'currentActor' : actorAdd,
              'currentCharacter' : this.currentCharacter,
              'currentInfo' : this.currentInfo
            })
        }
       
    }






}


</script>

<style>
.actor-list {
  list-style: none;
  padding: 0;
}

.actor-list li {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}

.actor-list li:hover {
  background-color: #f5f5f5;
}

.actor-list li p {
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  display: inline-block;
}

.actor-list li ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: inline-block;
}

.actor-list li ul li {
  display: inline-block;
  margin-right: 10px;
  font-size: 14px;
}

.actor-list li ul li:last-child {
  margin-right: 0;
}

.actor-list li button {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
}

.actor-list li button:hover {
  background-color: #c0392b;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
}

.form-group {
  display: flex;
  margin-bottom: 10px;
}

input[type="text"],
textarea {
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: #f8f8f8;
  margin-right: 5px;
  flex: 1;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #3e8e41;
}

.custom-textarea {
  width: 100%;
  height: 100px;
  resize: both;

}
</style>