export default class Flag {
    constructor(scene,timeDeb) {
      this.scene = scene;
      this.timeDeb = timeDeb;
      this.timeFin = null;
      
    }
    setTimeFin(tf){
        this.timeFin = tf
    }
  }