export default class Song {
    constructor(name,path,timeZone,timeEvent) {
      this.name = name;
      this.path = path
      this.eventList= timeEvent;
      this.zoneList = timeZone;
     
      
    }
  
    setEventList(tf){
        this.eventList = tf
    }
    setZoneList(tf){
        this.zoneList = tf
    }
    getName(){
      return this.name
    }
    getPath(){
      return this.path
    }
    getEventList(){
      return this.eventList
    }
    getZoneList(){
      return this.zoneList
    }
  }