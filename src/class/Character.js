export default class Character {
    constructor(name,accessoire,moreInfo) {
      this.name = name;
      this.accessoire = accessoire
      this.moreInfo = moreInfo
      this.displayDetails = false
    }
 

    getName(){
      return this.name
    }
    getRole(){
      return this.accessoire
    }
    addAccessoire(name){
        if(!this.accessoire.contains(name)){

            this.accessoire.push(name)
        }
    }
    removeAccessoire(name){
        var index = this.accessoire.indexOf(name)
        this.accessoire.splice(index,1)
    }
  }