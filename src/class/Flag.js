export default class Flag {
    constructor(scene,timeDeb,color) {
      this.scene = scene;
      this.timeDeb = timeDeb
      this.color= color;
      this.timeFin = null;
      
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