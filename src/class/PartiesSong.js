export default class PartieSong {
  constructor(partie,timeDeb,color) {
    this.partie = partie;
    this.timeDeb = timeDeb
    this.color= color;
    this.timeFin = null;
   
    
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