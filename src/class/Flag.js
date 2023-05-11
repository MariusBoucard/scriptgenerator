export default class Flag {
    constructor(id,zoneId,numeroDsZone,timeDeb,timeFin) {
      //Say which kind of plan this is
      this.id = id
      //which zone do it belongs to
      this.zone = zoneId;
      this.numeroDsZone = numeroDsZone
      this.timeDeb = timeDeb
      this.timeFin = timeFin;
      this.planImage = {
        ellipses : [],
        squares : [],
        arrows : [],
        lines : [],
        text : []
      }
      
    }
 
    setTimeFin(tf){
        this.timeFin = tf
    }
    getScene(){
      return this.scene
    }
    getTimeDeb(){
      return this.timeDeb
    }
    getColor(){
      return this.color
    }
    getTimeFin(){
      return this.timeFin
    }
  }