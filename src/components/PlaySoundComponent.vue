<template>
  <!-- <input
      type="range"
      min="0"
      max="100"
      step="1"
      v-model="seekValue"
      @change="onSeek"
    /> -->
  <div style="text-align: center;width:80%;margin:auto">

    <h1 style="display:inline-block"> Script Helper</h1>
    <button class="button" @click="this.$emit('settingsDisplay')">Settings</button>
    <div>
      <ol class="ol-days">
        <li v-for="item in this.songPathComp" :key="item" @click="this.launchFile(item)">
          {{ item.name }}
          <button class="button-cross" @click="remove(item)"></button>
        </li>
      </ol>

    </div>

    <div class="container">
      <div class="button-wrap">
        <label class="buttonbis" for="upload"> ouvrir fichier </label>
        <input id="upload" type="file" @change="onFileChange" style="visibility:hidden ; width:0px">
      </div>
    </div>
    <p style="font-weight: 300;">Song playing : {{ this.songPlaying }}</p>
    <audio style=" width: 100%;" ref="audioPlayer" controls @timeupdate="onPlaying">
      Your browser does not support the
      <code>audio</code> element.
    </audio>

    <div>
      <button class="button" @click="play">play</button>
      <button class="button" @click="pause">pause</button>
      <button class="button" @click="stop">stop</button>

    </div>

    <h2> Parties de la chanson </h2>

    <div class="timeline">
      <div v-for="zone in timelineZones" :key="zone.id" :style="zone.style"></div>
      <div class="current-time-bar" :style="currentTimeBarStyle"></div>

    </div>

    <h2> Decoupage scenes </h2>

    <div class="timeline">
      <div v-for="zone in timelineEvent" :key="zone.id" :style="zone.style"></div>
            <div class="current-time-bar" :style="currentTimeBarStyle"></div>

    </div>


    <div style="text-align: center;">
      <h3 style="display: block;float: top">Playing rate</h3>
      <div class="slider" style="margin : auto">

        <input type="range" min="0" max="300" oninput="rangeValue.innerText = this.value" v-model="this.speed">
        <p id="rangeValue">100</p>

      </div>



      <div class="container2">

        <div class="column2">
          <table id="tab">
            <tr>
              <th>zone</th>
              <th>numero Zone</th>
              <th>Debut</th>
              <th>Fin</th>
              <th>Couleur</th>
              <th>Enlever</th>
            </tr>

            <tr v-for="item in this.zoneListComp" :key="item">

              <td>
                <!-- todo in here -->
                <select @change="setZoneName(item, $event.target.value)">
                  <option :value="item.id" selected> {{ zoneNameFromId(item.id) }}</option>

                  <option v-for="zoneName in usableZoneList" :value="zoneName.id">{{ zoneName.name }}</option>

                </select>

              </td>
              <td>{{ item.numero }}</td>
              <td>{{ formatSeconds(item.timeDeb) }}</td>
              <td>{{ formatSeconds(item.timeFin) }}</td>
              <td>
                <div class="color-display" :style='{ backgroundColor: colorZoneFromId(item.id) }'></div>
              </td>
              <td>
                <button @click="removeZone(item)" class="removebtn"></button>
              </td>
            </tr>
          </table>
          <button @click="combleVideZone()">Fill Gap</button>

        </div>
        <div class="column2">


          <table id="tab">
            <tr>
              <th>Scene Id</th>
              <th>Zone belonged</th>
              <th>Numero dans zone</th>
              <th>Debut</th>
              <th>Fin</th>
              <th>Couleur</th>
              <th>Enlever</th>
            </tr>

            <tr v-for="item in this.eventListComp" :key="item">

              <td>     <!-- todo in here -->
                <select @change="setPlanId(item, $event.target.value)">
                  <option value="{{item.id)}}" selected> {{ item.id }}</option>

                  <option v-for="zoneName in usablePlanList" :value="zoneName.id">{{ zoneName.id }}</option>

                </select></td>
              <td>{{ item.zone }}</td>
              <td>{{ item.numeroDsZone }}</td>
              <td>{{ formatSeconds(item.timeDeb) }}</td>
              <td>{{ formatSeconds(item.timeFin) }}</td>
              <td>
                <div class="color-display" :style="{ backgroundColor: colorEventFromId(item.id) }"></div>
              </td>
              <td>
                <button class="removebtn" @click="removeEvent(item)"></button>
              </td>
            </tr>
          </table>
          <button @click="combleVidePlan()">Fill Gap</button>
        </div>

      </div>

      <!-- <button style="background-color: rgb(158, 158, 158); width : 100px; height : 30px" @click="downloadCSV(this.eventList, this.zoneList)"> Export as csv</button> -->




    </div>
  </div>
</template>
  
<script>
import Flag from '@/class/Flag';
import PartiesSong from '@/class/PartiesSong'
// import Song from '@/class/Song'
import { onMounted, onBeforeUnmount } from 'vue';

export default {
  mounted() {

    onMounted(() => {
      if (this.visible) {
        document.addEventListener('keydown', this.handleKeyDown);
      }
    });
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', this.handleKeyDown);
    });



    this.audioPlayer = this.$refs.audioPlayer;
    this.audioPlayer.addEventListener('timeupdate', () => {
      this.currentTime = this.audioPlayer.currentTime;
      this.totalTime = this.audioPlayer.duration;
    });



  },
  props: {
    // songZoneName :  {require :  true, type : Object},
    // colorScene : {require :  true, type :   Object},
    // SceneKey : {require :  true, type : Object},
    // ZoneKey :  {require :  true, type : Object},
    songPathProp: { require: true, type: [Object] },
    planList: { require: true, type: [Object] },
    listeZone: { require: true, type: [Object] },
    visible: { required: true, type: Boolean },
    usableZoneList: { require: true, type: [Object] },
    usablePlanList: { require: true, type: [Object] }
  },
  data() {
    return {
      currentTime: 0,
      seekValue: 0,
      speed: 100,
      songPath: [],
      songPlaying: "",

      totalTime: 0,
      eventList: this.planList,
      zoneList: this.listeZone
    };
  },
  watch: {
    songPathProp(value){
      this.songPath = value
    },

    visible(value) {
      if (value) {
        document.addEventListener('keydown', this.handleKeyDown);
      } else {
        document.removeEventListener('keydown', this.handleKeyDown);
      }
    },
    speed(newValue) {
      this.valueChangedHandler(newValue);
    },
    planList : {
       
      handler(newValue, oldValue) {
        // Do something with the new and old values
        this.eventList = newValue
      },
      /* Specify other options if needed */
      deep: true,
      immediate: true
    },
    listeZone : {
       
       handler(newValue, oldValue) {
         // Do something with the new and old values
         this.zoneList = newValue
       },
       /* Specify other options if needed */
       deep: true,
       immediate: true
     }
  },


  computed: {
    songPathComp() {
      return this.songPathProp
    },
    currentTimeBarStyle() {

      const barHeight = 100; // change as needed
      const leftPosition = (this.currentTime / this.duration) * 100;
      return {
        height: `${barHeight}%`,
        left: `${leftPosition}%`,
      };
    },
    oldPath() {
      return this.songPath
    },
    eventListComp() {
      return this.planList
    },
    zoneListComp() {
      return this.listeZone
    },
    duration() {
      return this.totalTime
    },
    timelineZones() {
      return this.zoneListComp.map((element, index) => {
        const startTime = element.timeDeb; // assuming you have a property called "startTime" on your element
        const endTime = element.timeFin; // assuming you have a property called "endTime" on your element
        const totalTime = this.duration; // assuming you have a property called "totalTime" that represents the total duration of the timeline
        const startPercent = (startTime / totalTime) * 100;
        const endPercent = (endTime / totalTime) * 100;
        const widthPercent = endPercent - startPercent;
        var zone = this.usableZoneList.find(elem => 
          String(elem.id) === String(element.id))
      

        return {
          id: index,
          style: {
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: zone.color, // assuming you have a property called "color" on your element
            'border-style' : 'none none none solid' ,
            'border-width' : '1px',
            'border-color' : 'black'
          }
        };
      });
    },
  
    timelineEvent() {
      return this.eventListComp.map((element, index) => {
        const startTime = element.timeDeb; // assuming you have a property called "startTime" on your element
        const endTime = element.timeFin; // assuming you have a property called "endTime" on your element
        const totalTime = this.duration; // assuming you have a property called "totalTime" that represents the total duration of the timeline

        const startPercent = (startTime / totalTime) * 100;
        const endPercent = (endTime / totalTime) * 100;
        const widthPercent = endPercent - startPercent;
        var zone = this.usablePlanList.find(elem => parseInt(elem.id) === parseInt(element.id))

        return {
          id: index,
          style: {
            height: '100%',
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: zone.color, // assuming you have a property called "color" on your element
            'border-style' : 'none none none solid' ,
            'border-width' : '1px',
            'border-color' : 'black'
          }
        };
      });
    }
  },
  methods: {
    remove(item){
      var index = this.songPath.indexOf(item)

      if(index>-1){

        // this.songPath.splice(index, 1);
        this.$emit('delSong',index)
      }

    },
    combleVidePlan(){
      this.eventList.sort((a,b)=> a.timeDeb-b.timeDeb)
      for(var i=0;i<this.eventList.length-1;i++){
        this.eventList[i].timeFin=this.eventList[i+1].timeDeb
      }
      this.$emit('planUpdated', this.eventList)
    },
    combleVideZone(){
      this.zoneList.sort((a,b)=> a.timeDeb-b.timeDeb)
      for(var i=0;i<this.zoneList.length-1;i++){
        this.zoneList[i].timeFin=this.zoneList[i+1].timeDeb
      
      }
      this.$emit('zoneUpdated', this.zoneList)
    },
     formatSeconds(seconds) {
  const dateObj = new Date(seconds * 1000);
  const minutes = dateObj.getUTCMinutes();
  const secondsFormatted = dateObj.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = Math.floor(dateObj.getUTCMilliseconds() / 10).toString().padStart(2, '0');
  return `${minutes}:${secondsFormatted}.${milliseconds}`;
},
    zoneNameFromId(id) {
      return this.usableZoneList.find(zone => String(zone.id) === String(id)).name
    },
    colorZoneFromId(id) {
      return this.usableZoneList.find(zone => String(zone.id) === String(id)).color

    },
    colorEventFromId(id) {
      return this.usablePlanList.find(zone => String(zone.id) === String(id)).color

    },
    getTimeFinScene(time) {
      var oldTimeDeb = 100000
      this.eventList.forEach(zone => {
        if (zone.timeDeb > time && zone.timeDeb < oldTimeDeb) {
          oldTimeDeb = zone.timeDeb
        }
      })

      if (oldTimeDeb !== 100000) {
        return oldTimeDeb
      } else {
        return null
      }
    },
    getTimeFinZone(time) {
      var oldTimeDeb = 100000
      this.zoneList.forEach(zone => {
        if (zone.timeDeb > time && zone.timeDeb < oldTimeDeb) {
          oldTimeDeb = zone.timeDeb
        }
      })
      if (oldTimeDeb !== 100000) {
        return oldTimeDeb
      } else {
        return null
      }
    },

    setPlanId(item, event) {
      //TODO connect event
      var find = this.eventList.find(elem => elem.timeDeb === item.timeDeb)
   
      this.$emit('setPlanId', 
        {
        "item" : find,
        "value" : event 
      })
    },
    setZoneName(item, event) {
      //TODO connect event
      this.$emit('setZoneName', {
        "item" : item,
        "value" : event
      })
    },


    downloadCSV(event, zone) {
      const csv = this.convertToCSV(event, zone);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    convertToCSV(event, zone) {
      const header = Object.keys(zone[0]).join(',');

      //intercaler les trucs :
      event.sort((a, b) => a.timeDeb - b.timeDeb)
      zone.sort((a, b) => a.timeDeb - b.timeDeb)

      var total = event.concat(zone)
      total = total.sort((a, b) => a.timeDeb - b.timeDeb)

      const rows = total.map(obj => {
        if (Object.keys(obj)[0] === "partie") {
          return "\n" + Object.values(obj).join(',');
        } else {
          return Object.values(obj).join(',');
        }


      })
      return `${header}\n${rows.join('\n')}`;
    },

    removeEvent(item) {
      //TODO Effet Bord

      // var found = this.eventList.find(a => a.timeDeb === item.timeDeb)
      var toRemove = this.eventList.findIndex(found => { return found.timeDeb === item.timeDeb })
      this.eventList.splice(toRemove, 1)
      this.updatePlanList()
      this.updateZoneList()
      this.$emit('planUpdated', this.eventList)
    },
    removeZone(item) {
      var toRemove = this.zoneList.findIndex(found => { return found.timeDeb === item.timeDeb })
      this.zoneList.splice(toRemove, 1)
      this.updatePlanList()
      this.updateZoneList()
      this.$emit('zoneUpdated', this.zoneList)
      this.$emit('planUpdated', this.eventList)
    },
    getZoneFromTime(time) {
      var zone = this.zoneList.find(zone => zone.timeDeb < time && zone.timeFin > time)
      if (zone) {
        return zone.id
      }
      return null
    },
    getNumeroDansZone(zone, time) {
      const filteredItems = this.eventList.filter(item => item.zone === zone);
      filteredItems.sort((a, b) => a.timeDeb - b.timeDeb);

      if (filteredItems.length === 0) {
        return 1;
      }

      for (let i = filteredItems.length - 1; i >= 0; i--) {
        if (filteredItems[i].timeDeb <= time) {
          return filteredItems[i].numeroDsZone + 1;
        }
      }

      // If no item satisfies the condition, return the last item in the array
      return filteredItems[filteredItems.length - 1].numeroDsZone + 1;


    },
    updatePlanList() {
      //MultipleCheck sur les appartenances aux zones, fin, deb, id, id plan etc.
      this.eventList.sort((a, b) => a.timeDeb - b.timeDeb);

      for (let i = 0; i < this.eventList.length - 1; i++) {
        const currentEvent = this.eventList[i];
        const nextEvent = this.eventList[i + 1]

        if (nextEvent) {
          currentEvent.timeFin = nextEvent.timeDeb;
        } else {
          // If there is no next event, set the current event's timeFin to the end of the day (86400000 milliseconds)
          currentEvent.timeFin = null;
        }
      }

      const filtered = this.eventList.filter(evt => evt.zone === null)
      filtered.forEach(
        (item, index) =>
          item.numeroDsZone = index + 1

      )
      this.zoneList.forEach(zone => {
        const filteredItems = this.eventList.filter(item => item.timeDeb > zone.timeDeb && item.timeDeb < zone.timeFin);
        filteredItems.sort((a, b) => a.timeDeb - b.timeDeb)
        filteredItems.forEach((item, index) => {
          item.numeroDsZone = index + 1;
          item.zone = zone.numero
        });
      })

      this.$emit('planUpdated', this.eventList)
    },
    updateZoneList() {

      this.zoneList.sort((a, b) => a.timeDeb - b.timeDeb)
      this.zoneList.forEach((item, index) => {
        item.numero = index + 1;
      });

      this.$emit('zoneUpdated', this.zoneList)

    },
    handleKeyDown(event) {
      //TODO HUGE
      // Do something with the event, such as logging the key code

      this.usablePlanList.forEach(
        plan => {
          if (parseInt(plan.key) === parseInt(event.keyCode)) {

            this.endPlusProche(this.getTime())
            var zone = this.getZoneFromTime(this.getTime())
            this.eventList.push(new Flag(plan.id, zone, this.getNumeroDansZone(zone, this.getTime()), this.getTime(), this.getTimeFinScene(this.getTime())))
            //Update Plan list todo : doit check que pas effet bord lors cgt
            this.updatePlanList()
          }
        }
      )

      this.usableZoneList.forEach(zone => {
        if (parseInt(zone.key) === parseInt(event.keyCode)) {
          this.endPlusProcheZone(this.getTime())
          this.zoneList.push(new PartiesSong(zone.id, 0, this.getTime(), this.getTimeFinZone(this.getTime())))
          this.updatePlanList()
          this.updateZoneList()

        }
      })

    },



    // localStorage.setItem('songList', JSON.stringify(this.songPath))

    getTime() {
      // const audioElement = this.$refs.audioPlayer;
      const currentTime = this.audioPlayer.currentTime;
      return currentTime
    },

    valueChangedHandler(speedval) {
      this.setSpeed(speedval / 100)
    },
    //attention aux nuls
    endPlusProche(time) {
      this.eventList.sort((a, b) => a.timeDeb - b.timeDeb)
      var eventPlusProche = new Flag(9, -1, 'red', "caca")
      this.eventList.forEach(
        event => {
          if ((event.timeFin > eventPlusProche.timeFin && event.timeFin < time && String(event.timeFin) !== 'null')
            || (String(event.timeFin) === 'null' && String(event.timeDeb) < time)
            || (String(event.timeFin) > time && String(event.timeDeb) < time)) {
            eventPlusProche = event
          }
        }
      )
      if (eventPlusProche.timeDeb !== -1) {
        eventPlusProche.timeFin = time
      }

    },
    endPlusProcheZone(time) {
      this.zoneList.sort((a, b) => a.timeDeb - b.timeDeb)
      var eventPlusProche = new PartiesSong(9, -1, 'red')
      this.zoneList.forEach(
        event => {
          if ((event.timeFin > eventPlusProche.timeFin && event.timeFin < time && String(event.timeFin) !== 'null')
            || (String(event.timeFin) === 'null' && String(event.timeDeb) < time)
            || (String(event.timeFin) > time && String(event.timeDeb) < time)) {
            eventPlusProche = event
          }
        }
      )

      if (eventPlusProche.timeFin !== -1) {
        eventPlusProche.timeFin = time
      }

    },
    /*
    When a new file is loaded
    */
    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      this.songPath.push({ name: file.name, path: file.path })
      this.songPlaying = file.name
      // Get a reference to the audio player
      // localStorage.setItem('songList', JSON.stringify(this.songPath))
      this.eventList = []
      this.zoneList = []
      reader.onload = (event) => {
        this.audioPlayer.src = event.target.result;

      };

      reader.readAsDataURL(file);
      this.totalTime = this.audioPlayer.duration
      this.$emit('fileLoad', this.songPath)
      this.$emit('fileChanged',"file://"+file.path)

    },
    launchFile(file) {

      const reader = new FileReader();
      this.songPlaying = file.name

      const songURL = `file://${file.path}`;
      this.audioPlayer.src = songURL;

      reader.onload = (event) => {
        // this.audioPlayer = this.$refs.audioPlayer;
        this.audioPlayer.src = event.target.result;
        this.totalTime = this.audioPlayer.duration
        
        
        
      };
      this.$emit('fileChanged',songURL)
      this.audioPlayer.addEventListener('loadedmetadata', () => {
        this.totalTime = this.audioPlayer.duration
      });
      this.audioPlayer.addEventListener('canplaythrough', () => {
    this.totalTime = this.audioPlayer.duration;
  });
     

      // reader.readAsDataURL(file.path);
    },

    play() {
      this.$refs.audioPlayer.play();
    },
    pause() {
      this.$refs.audioPlayer.pause();
    },
    stop() {
      const { audioPlayer } = this.$refs;
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    },
    setSpeed(speed) {
      this.$refs.audioPlayer.playbackRate = speed;
    },
    onPlaying() {
      const { audioPlayer } = this.$refs;
      if (!audioPlayer) {
        return;
      }
      this.currentTime = audioPlayer.currentTime;
      this.seekValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    },
    onSeek() {
      const { audioPlayer } = this.$refs;
      const seekto = audioPlayer.duration * (this.seekValue / 100);
      audioPlayer.currentTime = seekto;
    },
  },
}
  ;
</script>
<style>
.removebtn {
  width: 20px;
  height: 20px;
  background-image: url('/src/assets/croix.png');
  background-size: cover;
}

.container2 {
  display: flex;
  flex-direction: row;
}

.column2 {
  flex: 1;
  padding: 10px;
}

.timeline {
  border: 1px solid black;
  width: 100%;
  height: 50px;
  position: relative;

  background-color: rgb(197, 197, 197);
}


.timeline>div {
  position: absolute;
  height: 100%;
  top: 0;
}

.color-display {
  width: 20px;
  height: 20px;
  margin: auto;
  border-radius: 5%;
}

.current-time-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  /* change as needed */
  background-color: rgb(0, 0, 0);
  /* change as needed */
  z-index: 99;
}

#tab td,
#tab th {
  border: 1px solid #ddd;
  padding: 8px;
}

#tab tr:nth-child(even) {
  background-color: #f2f2f2;
}

#tab tr:hover {
  background-color: #ddd;
}

#tab th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}

ul.horizontal-list {
  list-style: none;
}

ul.horizontal-list li {
  display: inline-block;
}

.slider {

  width: 60%;
  height: 60px;
  padding: 30px;
  padding-left: 40px;
  background: #fcfcfc;
  border-radius: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 15px 40px #7E6D5766;
}

.slider p {
  font-size: 26px;
  font-weight: 600;
  font-family: Open Sans;
  padding-left: 30px;
  color: black;
}

.slider input[type="range"] {
  width: 420px;
  height: 2px;
  background: black;
  border: none;
  outline: none;
}

.slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  width: 30px;
  height: 30px;
  background: black;
  border: 2px solid black;
  border-radius: 50%;
  cursor: pointer;
}

.slider input[type="range"]::-webkit-slider-thumb:hover {
  background: black;
}

.container {
  align-items: center;
  width: 100%;
  margin-left: 0;
  padding: 0;
}
.button-cross {
  display: inline-block;
  position: relative;
  margin-left: 1em;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  border: none;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.button-cross::before,
.button-cross::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 2px;
  background-color: #000;
}

.button-cross::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.button-cross::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
input[type="file"] {
  z-index: -1;
  top: 15px;
  left: 20px;
  margin-right: auto;
  margin-left: auto;
  font-size: 17px;
  color: #b8b8b8;
}

.button-wrap {
  position: relative;
  margin: 0;
  padding: 0;
}

.button {
  margin: 20px;
  background-color: lightgreen;
  box-shadow: none;
  border: #00ab97;
  border-radius: 5px;
  min-width: 80px;
  min-height: 30px;
}

.buttonbis {
  position: relative;
  display: inline-block;
  background-color: #1d6355;
  border-radius: 10px;
  border: 4px double #cccccc;
  color: #ffffff;
  text-align: center;
  font-size: 20px;
  margin-right: auto;
  margin-left: auto;
  width: 100px;
  transition: all 0.5s;
  cursor: pointer;
}

.buttonbis:hover {
  background-color: #00ab97;
}

audio::-webkit-media-controls-play-button {
  background-color: rgb(255, 255, 255);
}

audio:hover {
  transform: scale(1.1);
  filter: drop-shadow(2px 3px 3px #333);
}

audio::-webkit-media-controls-panel {
  background-color: white;
  border-radius: 0%;
}

audio::-webkit-media-controls-mute-button {
  background-color: white;
  color: black;
}

/*audio::-webkit-media-controls-play-button
audio::-webkit-media-controls-timeline-container
audio::-webkit-media-controls-current-time-display
audio::-webkit-media-controls-time-remaining-display
audio::-webkit-media-controls-timeline
audio::-webkit-media-controls-volume-slider-container
audio::-webkit-media-controls-volume-slider
audio::-webkit-media-controls-seek-back-button
audio::-webkit-media-controls-seek-forward-button
audio::-webkit-media-controls-fullscreen-button
audio::-webkit-media-controls-rewind-button
audio::-webkit-media-controls-return-to-realtime-button
audio::-webkit-media-controls-toggle-closed-captions-button */

.ol-days,
.ol-days * {
  font-size: medium;
  padding: 0;
  box-sizing: border-box;
}

.ol-days {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;

  /* flex-direction: column; */
  gap: 0.25em;
  font-size: clamp(1rem, 5vw, 2rem);
  color: hsl(0, 0%, 90%);

  list-style: none;
  counter-reset: ol-days-counter;
}

.ol-days>li {
  counter-increment: ol-days-counter;
  padding-inline: 1em;
  width: 100%;
  margin: 0;
  padding: 0;
  display: grid;
  text-align: center;
  grid-template-columns: 80% min-content;
  align-items: center;
  background: linear-gradient(hsla(0 0% 100% / 0.2),
      transparent 50%,
      hsla(0 0% 0% / 0.3)),
    var(--clr_bg);
  transition: transform 250ms ease;
  height: 70px;
  cursor: default;
  /* text-shadow: 0 0 5px hsla(0 0% 50% / 0.75); */
}

.ol-days>li:hover {
  transform: scale(1.05);
}

.ol-days>li::before,
.ol-days>li::after {
  display: grid;
  grid-template-columns: 10fr 1fr;
  width: 100%;
  align-items: center;
  grid-row: 1;
  text-align: center;
}

.ol-days>li::before {
  grid-column: 1;
  width: 50%;
  padding-inline-end: 0.25em;
}

.ol-days>li::after {
  content: counter(ol-days-counter, decimal-leading-zero);
  grid-column: 2;
  float: right;
  width: 1.75em;
  height: 3.5em;
  background-image: linear-gradient(90deg,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0) 25%),
    radial-gradient(circle at 0.125em center,
      var(--clr_accent) 1.25em,
      transparent calc(1.25em + 1px));
  padding-inline-start: 0.1em;
  grid-template-columns: 10fr 1fr;

}

.ol-days>li:nth-child(even)::before {
  padding-inline-start: 1.25em;
}

.ol-days>li:nth-child(6n + 1) {
  --clr_bg: #2e2b3c;
  --clr_accent: #fb6767;
}

.ol-days>li:nth-child(6n + 2) {
  --clr_bg: #47505f;
  --clr_accent: #c14755;
}

.ol-days>li:nth-child(6n + 3) {
  --clr_bg: #37aa8d;
  --clr_accent: #a1cc6f;
}

.ol-days>li:nth-child(6n + 4) {
  --clr_bg: #8fb568;
  --clr_accent: #566574;
}

.ol-days>li:nth-child(6n + 5) {
  --clr_bg: #24b8b8;
  --clr_accent: #c4b36a;
}

.ol-days>li:nth-child(6n + 6) {
  --clr_bg: #fc6868;
  --clr_accent: #2e2b3c;
}</style>