export default class Plan {
    constructor(){
        // Number representing the id of the zone he is into
        this.zoneNb =0
        // Number of the plan into the zone
        this.numero = 0
        //name of the plan
        this.name = "name field"
        // What this plan should represent, like there is multiple already made things you know
        this.sceneId = 0
        this.timeBeginning =0
        this.timeEnd =0

        this.planImage = {
            ellipses : [],
            squares : [],
            arrows : [],
            lines : [],
            text : []
          }

    }
}