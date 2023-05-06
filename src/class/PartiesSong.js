export default class PartiesSong {
  constructor(partie,timeDeb,color) {
    this.partie = partie;
    this.timeDeb = timeDeb
    this.timeFin = null;
    this.color= color;
   
    
  }

  setTimeFin(tf){
      this.timeFin = tf
  }
  getZone(){
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