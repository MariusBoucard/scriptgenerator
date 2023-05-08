export default class PartiesSong {
  constructor(partie,timeDeb,timeEnd,color) {
    this.partie = partie;
    this.timeDeb = timeDeb
    this.timeFin = timeEnd;
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