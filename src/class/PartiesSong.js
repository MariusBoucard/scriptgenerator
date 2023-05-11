export default class PartiesSong {
  constructor(id,numero,timeDeb,timeEnd) {
    this.id =id
    this.numero = numero;
    this.timeDeb = timeDeb
    this.timeFin = timeEnd;
   
    
  }

  setTimeFin(tf){
      this.timeFin = tf
  }
  getZoneId(){
    return this.id
  }
  getTimeDeb(){
    return this.timeDeb
  }
  getNumero(){
    return this.numero
  }
  getTimeFin(){
    return this.timeFin
  }
}