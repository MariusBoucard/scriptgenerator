export default class Flag {
    constructor(scene,timeDeb,timeFin,color,zone) {
      this.scene = scene;
      this.id = null
      this.timeDeb = timeDeb
      this.timeFin = timeFin;
      this.color= color;
      this.zone = zone;
      this.planImage = {
        backGround : color,
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