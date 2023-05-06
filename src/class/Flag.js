export default class Flag {
    constructor(scene,timeDeb,color,zone) {
      this.scene = scene;
      this.timeDeb = timeDeb
      this.timeFin = null;
      this.color= color;
      this.zone = zone;
      
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