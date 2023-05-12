<template>
    <div>
        <h1>Magasin</h1>
        <p>Find here all the ustensils you might need</p>

        <ul style="list-style: none;">
            <li v-for="types in typeOutil">
               <div style="background-color: #4CAF50;padding-top: 5px;padding-bottom:5px;color:white;width: 50%;margin: auto;">
                <p  style="margin: 0;">{{ types }}</p>
            </div>
                <ul>
                    <li class="inner-ustensil-list" v-for="outil in outilParType(types)">
                        {{ outil.name }} | {{ outil.quantity }}
                        
    
                        <button @click="removeOutil(outil)">Remove outil</button>
                  
                 

                    </li>
                </ul>
                   


            </li>
        </ul>




        <div class="form-container">
            <h3>Add a tool or something like that</h3>
            <div class="form-group">
                <select v-model="this.currentTypeTool">
                    <option v-for="out in typeOutil" :value="out">{{out}}</option>
                </select>
                <input type="text" v-model="this.currentOutilName" placeholder="Outil name" />
                <input type="number" v-model="this.currentQuantity" placeholder="Nb of items" />
                <button @click="addOutil()">
                    Add it to list
                </button>

            </div>
            <div class="form-group">
                <input type="text" v-model="this.currentOutilAdd" placeholder="Outil type" />
                <button @click="addOutilType()">Add to type</button>
                <button @click="removeOutilType()">Remove type</button>

            </div>


        </div>

    </div>
</template>
<script>
import Actor from '@/class/Actor';

export default {
    props: {
        typeOutil : { required: true, type: [String] },
        magasinList : { required : true, type : [Object]}
    },
    watch : {
        typeOutil : {
            handler(newValue,oldValue){
                this.typeOutilInside = newValue
            },
            deep : true,
            immediate : true
        },
        magasinList : {
            handler(newValue,oldValue){
                this.magasinListInside = newValue
            },
            deep : true,
            immediate : true
        }
    },
    data() {
        return {
            magasinListInside : this.magasinList,
            typeOutilInside : this.typeOutil,
            currentTypeTool :"",
            currentOutilName :"",
            currentQuantity :0,
            currentOutilAdd : ""
        }
    },
    methods: {
        outilParType(type){

            console.log("typeOUtil",this.typeOutil)
            return this.magasinList.filter(outil => outil.type === type)
        },
        removeOutil(outil){
            this.magasinListInside.splice(this.magasinListInside.indexOf(outil),1)
            this.$emit('magasinUpdated',this.magasinListInside)
        },
        getNextId(){
            var i =0
            this.magasinList.forEach(mag =>{
                if(mag.id>i){
                    i = mag.id
                }}
                
                )
                return i+1
            },
        addOutilType(){
            this.typeOutilInside.push(this.currentOutilAdd)
            this.$emit( 'updateOutilType',this.typeOutilInside)
        },
        removeOutilType(){
            if(this.typeOutilInside.find(out => out === this.currentOutilAdd)){
                
                this.typeOutilInside.splice(this.typeOutilInside.indexOf(this.currentOutilAdd),1)
                this.$emit( 'updateOutilType',this.typeOutilInside)
            }
        },
        addOutil(){
            this.magasinListInside.push(
                {
                     id : this.getNextId() , 
                     name : this.currentOutilName,
                     type : this.currentTypeTool ,
                     quantity : this.currentQuantity

                }
            )
            this.$emit('magasinUpdated',this.magasinListInside)

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
.ustensil-list {
list-style: none;
padding: 0;
}

.ustensil-list li {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
border: 1px solid #ccc;
padding: 10px;
}

.ustensil-list li:hover {
background-color: #f5f5f5;
}

.ustensil-list li button {
background-color: #e74c3c;
color: #fff;
border: none;
padding: 5px 10px;
font-size: 14px;
cursor: pointer;
}

.ustensil-list li button:hover {
background-color: #c0392b;
}

.inner-ustensil-list {
display: flex;
justify-content: center;
align-items: center;
text-align: center;
font-size: 16px;
margin-right: 10px;
}

.inner-ustensil-list:last-child {
margin-right: 0;
}

.inner-ustensil-list button {
background-color: #e74c3c;
color: #fff;
border: none;
padding: 5px 10px;
font-size: 14px;
cursor: pointer;
margin-left: 10px;
}

.inner-ustensil-list button:hover {
background-color: #c0392b;
}

</style>