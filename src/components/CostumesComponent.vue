<template>
<div>
        <h1>List of Costumes</h1>
    <ul class="actor-list">
        <li v-for="character in characterList">
            <div @click="character.displayDetails =! character.displayDetails" title="Display some more information about the character">
                <p style="display:inline-block">{{ character.name }} :</p>
                 <ul style="list-style: none; padding: 0; margin: 0;display:inline-block">

  <li v-for="char in character.accessoire" style="  display: inline-block;  margin-right: 10px; "  
  @contextmenu="removeAccessoireCharacter(character.name,char)" title="Right click to remove me">{{ char }}</li>
</ul>


                  <button @click="removeActor(character.name)">Remove actor</button>
            </div>
            <div v-show="character.displayDetails">{{ character.moreInfo }}</div>
     
    </li>
    </ul>
    <div class="form-container">
        <h3>Add a costume to character</h3>
        <div class="form-group">
            <input type="text" v-model="this.currentCharacter" placeholder="Actor name"/>
            <input type="text" v-model="this.currentCostume"  placeholder="Character he will play"/>
            <button @click="this.addCostume">
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
import Character from '@/class/Character';

export default{
    mounted(){
    
    },
    data(){
        return {
            characterList : [],
            currentCharacter:"",
            currentCostume:"",
            currentInfo : ""
        }
    },
    methods : {
        storageUpdate(){
            localStorage.setItem('costumeList',JSON.stringify(this.characterList))
        },
        removeAccessoireCharacter(character,costume){
          console.log(character)
            var find = this.characterList.find(act => act.name===character)
            find.removeAccessoire(costume)
            this.storageUpdate()
        },
        addCostume(){
            
            if(this.characterExists(this.currentCharacter)){
                var character = this.characterList.find(actor => actor.name === this.currentCharacter)
                character.addAccessoire(this.currentCostume)
            } else {
                this.characterList.push(new Character(this.currentCharacter,[this.currentCostume],this.currentInfo))
            }
            if(this.currentInfo !== ""){
                var actor = this.characterList.find(actor => actor.name === this.currentCharacter)
                actor.moreInfo = this.currentInfo
            }
            this.storageUpdate()
        },
        characterExists(name){
            var kuk = this.characterList.find(character => character.name === name)
            if(kuk !== undefined){
                return true
            } else {
                false
            }
        },
        removeActor(name){
            var found = this.characterList.find(ac => ac.name === name)
            var ind = this.characterList.indexOf(found)
            this.characterList.splice(ind,1)
            this.storageUpdate()
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