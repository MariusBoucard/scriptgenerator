export default class Actor {
    constructor(name,Role,moreInfo) {
      this.name = name;
      this.role = Role
      this.moreInfo = moreInfo
      this.displayDetails = false
    }
 
    setTimeFin(tf){
        this.timeFin = tf
    }
    getName(){
      return this.name
    }
    getRole(){
      return this.role
    }
    addRole(name){
      this.role.push(name)
    }
    removeRole(name){
        var index = this.role.indexOf(name)
        this.role.splice(index,1)
    }
  }