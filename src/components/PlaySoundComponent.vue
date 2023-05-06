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
        <li v-for="item in this.songPath" :key="item" @click="this.launchFile(item)">
          {{ item.name }}
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
    </div>

    <h2> Decoupage scenes </h2>

    <div class="timeline">
      <div v-for="zone in timelineEvent" :key="zone.id" :style="zone.style"></div>
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
              <th>Debut</th>
              <th>Fin</th>
              <th>Couleur</th>
              <th>Enlever</th>
            </tr>

            <tr v-for="item in this.zoneListComp" :key="item">

              <td>{{ item.partie }}</td>
              <td>{{ item.timeDeb }}</td>
              <td>{{ item.timeFin }}</td>
              <td>
                <div class="color-display" :style='{ backgroundColor: item.color }'></div>
              </td>
              <td>
                <button @click="removeZone(item)" class="removebtn" ></button>
              </td>
            </tr>
          </table>
        </div>
        <div class="column2">


          <table id="tab">
            <tr>
              <th>Scene</th>
              <th>Debut</th>
              <th>Fin</th>
              <th>Couleur</th>
              <th>Enlever</th>
            </tr>

            <tr v-for="item in this.eventListComp" :key="item">

              <td>{{ item.scene }}</td>
              <td>{{ item.timeDeb }}</td>
              <td>{{ item.timeFin }}</td>
              <td>
                <div class="color-display" :style="{ backgroundColor: item.color }"></div>
              </td>
              <td>
                <button class="removebtn" @click="removeEvent(item)"></button>
              </td>
            </tr>
          </table>
        </div>

      </div>

      <button style="background-color: rgb(158, 158, 158); width : 100px; height : 30px" @click="downloadCSV(this.eventList, this.zoneList)"> Export as csv</button>




    </div>
  </div>
</template>
  
<script>
import Flag from '@/class/Flag';
import PartiesSong from '@/class/PartiesSong'
import Song from '@/class/Song'

export default {
  mounted() {
    
   
    
 
    this.audioPlayer = this.$refs.audioPlayer;
    console.log(localStorage.getItem('songList'))
    if (localStorage.getItem('songList') !== null) {

      this.songPath = JSON.parse(localStorage.getItem('songList'))
    }
    this.$emit('colorZone', this.colorZone)
  },
  props : {
    colorZone : {require :  true, type : Object},
    songZoneName :  {require :  true, type : Object},
    colorScene : {require :  true, type :   Object},
    SceneKey : {require :  true, type : Object},
    ZoneKey :  {require :  true, type : Object}
  },
  data() {
    return {
      currentTime: 0,
      seekValue: 0,
      speed: 100,
      songPath: [],
      songPlaying: "",
      
      totalTime: 0,
      eventList: [],
      zoneList: [],
    };
  },
  watch: {
    speed(newValue) {
      this.valueChangedHandler(newValue);
    },
  },
  created() {
    // Add a global event listener to detect keyboard strokes
    document.addEventListener('keydown', this.handleKeyDown);
  },
  computed: {
    oldPath() {
      return this.songPath
    },
    eventListComp() {
      return this.eventList
    },
    zoneListComp() {
      return this.zoneList
    },
    duration(){
      

      return this.totalTime
    },
    timelineZones() {
      return this.zoneList.map((element, index) => {
        const startTime = element.timeDeb; // assuming you have a property called "startTime" on your element
        const endTime = element.timeFin; // assuming you have a property called "endTime" on your element
        const totalTime = this.duration; // assuming you have a property called "totalTime" that represents the total duration of the timeline
        const startPercent = (startTime / totalTime) * 100;
        const endPercent = (endTime / totalTime) * 100;
        const widthPercent = endPercent - startPercent;
        return {
          id: index,
          style: {
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: element.color // assuming you have a property called "color" on your element
          }
        };
      });
    },
    timelineEvent() {
      return this.eventList.map((element, index) => {
        const startTime = element.timeDeb; // assuming you have a property called "startTime" on your element
        const endTime = element.timeFin; // assuming you have a property called "endTime" on your element
        const totalTime = this.duration; // assuming you have a property called "totalTime" that represents the total duration of the timeline
        console.log(this.audioPlayer.duration)
        console.log(startTime)
        console.log(totalTime)
        const startPercent = (startTime / totalTime) * 100;
        const endPercent = (endTime / totalTime) * 100;
        const widthPercent = endPercent - startPercent;
        return {
          id: index,
          style: {
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: element.color // assuming you have a property called "color" on your element
          }
        };
      });
    }
  },
  methods: {
    colorZoneUpdate(event){
      console.log(event)
    },
    setColorZone(obj){
      console.log("faire set" + obj)
      this.$emit('colorZone',this.colorZone)
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
      total =  total.sort((a, b) => a.timeDeb - b.timeDeb)
      console.log(total)

      const rows = total.map(obj => {
        console.log(Object.keys(obj)[0])
        if (Object.keys(obj)[0] === "partie") {
          return "\n" + Object.values(obj).join(',');
        } else {
          return Object.values(obj).join(',');
        }


      })
      return `${header}\n${rows.join('\n')}`;
    },

    removeEvent(item) {

      // var found = this.eventList.find(a => a.timeDeb === item.timeDeb)
      var toRemove = this.eventList.findIndex(found => { return found.timeDeb === item.timeDeb })
      this.eventList.splice(toRemove, 1)
    },
    removeZone(item) {
      // var found = this.eventList.find(a => a.timeDeb === item.timeDeb)
      var toRemove = this.zoneList.findIndex(found => { return found.timeDeb === item.timeDeb })
      this.zoneList.splice(toRemove, 1)
    },


    handleKeyDown(event) {
      // Do something with the event, such as logging the key code
      console.log("Eventcode " + event.keyCode)
      if (String(event.keyCode) === this.SceneKey[1]) {
        console.log("scene 1 added")
        this.endPlusProche(this.getTime())
        this.eventList.push(new Flag(1, this.getTime(), this.colorScene[1]))

      }
      if (String(event.keyCode) === this.SceneKey[2]) {
        console.log("scene 2 added")

        this.endPlusProche(this.getTime())
        this.eventList.push(new Flag(2, this.getTime(), this.colorScene[2]))

      }
      if (String(event.keyCode) === this.SceneKey[3]) {
        console.log("scene 3 added")
        this.endPlusProche(this.getTime())
        this.eventList.push(new Flag(3, this.getTime(), this.colorScene[3]))
      }
      if (String(event.keyCode) === this.SceneKey[4]) {
        console.log("scene 3 added")
        this.endPlusProche(this.getTime())
        this.eventList.push(new Flag(4, this.getTime(), this.colorScene[4]))
      }
      if (String(event.keyCode) === this.SceneKey[5]) {
        console.log("scene 3 added")
        this.endPlusProche(this.getTime())
        this.eventList.push(new Flag(5, this.getTime(), this.colorScene[5]))
      }
      if (String(event.keyCode) === this.SceneKey[6]) {
        console.log("scene 3 added")
        this.endPlusProche(this.getTime())
        this.eventList.push(new Flag(6, this.getTime(), this.colorScene[6]))
      }


      if (String(event.keyCode) === this.ZoneKey[1]) {
        this.endPlusProcheZone(this.getTime())
        this.zoneList.push(new PartiesSong(this.songZoneName[1], this.getTime(), this.colorZone[1]))
        //TODO if added entre 2, il faut set direct la fin ici dans une fonciton pour assurer de pas avoir de nulls dans le bail
        console.log(this.zoneList)
      }
      if (String(event.keyCode) === this.ZoneKey[2]) {
        this.endPlusProcheZone(this.getTime())
        this.zoneList.push(new PartiesSong(this.songZoneName[2], this.getTime(), this.colorZone[2]))
        //TODO if added entre 2, il faut set direct la fin ici dans une fonciton pour assurer de pas avoir de nulls dans le bail
        console.log(this.zoneList)
      }
      if (String(event.keyCode) === this.ZoneKey[3]) {
        this.endPlusProcheZone(this.getTime())
        this.zoneList.push(new PartiesSong(this.songZoneName[3], this.getTime(), this.colorZone[3]))
        //TODO if added entre 2, il faut set direct la fin ici dans une fonciton pour assurer de pas avoir de nulls dans le bail
        console.log(this.zoneList)
      }
      if (String(event.keyCode) === this.ZoneKey[4]) {
        this.endPlusProcheZone(this.getTime())
        this.zoneList.push(new PartiesSong(this.songZoneName[4], this.getTime(), this.colorZone[4]))
        //TODO if added entre 2, il faut set direct la fin ici dans une fonciton pour assurer de pas avoir de nulls dans le bail
        console.log(this.zoneList)
      }
      if (String(event.keyCode) === this.ZoneKey[5]) {
        this.endPlusProcheZone(this.getTime())
        this.zoneList.push(new PartiesSong(this.songZoneName[5], this.getTime(), this.colorZone[5]))
        //TODO if added entre 2, il faut set direct la fin ici dans une fonciton pour assurer de pas avoir de nulls dans le bail
      }
      if (String(event.keyCode) === this.ZoneKey[6]) {
        this.endPlusProcheZone(this.getTime())
        this.zoneList.push(new PartiesSong(this.songZoneName[6], this.getTime(), this.colorZone[6]))
        //TODO if added entre 2, il faut set direct la fin ici dans une fonciton pour assurer de pas avoir de nulls dans le bail
      }

      this.saveElements()
    },
    saveElements() {
      //Find the song we are working on
      var found = this.songPath.find(song => this.songPlaying === song.name)
      if (found) {
  console.log(typeof found);
  found.eventList = (this.eventList);
  found.zoneList = (this.zoneList);
}


      localStorage.setItem('songList', JSON.stringify(this.songPath))
    },
    getTime() {
      // const audioElement = this.$refs.audioPlayer;
      const currentTime = this.audioPlayer.currentTime;
      return currentTime
    },
    launchFile(file) {

      const reader = new FileReader();
      this.songPlaying = file.name

      const songURL = `file://${file.path}`;
      this.audioPlayer.src = songURL;

      reader.onload = (event) => {
        // this.audioPlayer = this.$refs.audioPlayer;
        this.audioPlayer.src = event.target.result;

      };
      this.audioPlayer.addEventListener('loadedmetadata', () => {
        this.totalTime = this.audioPlayer.duration
});
      this.eventList = file.eventList
      this.zoneList = file.zoneList

      // reader.readAsDataURL(file.path);
    },
    valueChangedHandler(speedval) {
      this.setSpeed(speedval / 100)
    },
    //attention aux nuls
    endPlusProche(time) {
      this.eventList.sort((a, b) => a.timeDeb - b.timeDeb)
      var eventPlusProche = new Flag(9, -1, 'red',"caca")
      this.eventList.forEach(
        event => {
          console.log(event.timeFin)
          if ((event.timeFin > eventPlusProche.timeFin && event.timeFin < time && String(event.timeFin) !== 'null') || String(event.timeFin) === 'null') {

            eventPlusProche = event
          }
        }
      )
      if (eventPlusProche.timeDeb !== -1) {
        eventPlusProche.timeFin  = time
      }

    },
    endPlusProcheZone(time) {
      this.zoneList.sort((a, b) => a.timeDeb - b.timeDeb)
      var eventPlusProche = new PartiesSong(9, -1, 'red')
      this.zoneList.forEach(
        event => {
          if ((event.timeFin > eventPlusProche.timeFin && event.timeFin < time && String(event.timeFin) !== 'null') || String(event.timeFin) === 'null') {

            eventPlusProche = event
          }
        }
      )
     
      if (eventPlusProche.timeFin !== -1) {
        console.log(typeof eventPlusProche); // output: "number"
        eventPlusProche.timeFin = time
      }

    },
    /*
    When a new file is loaded
    */
    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      this.songPath.push(new Song(file.name, file.path, [], []))
      this.songPlaying = file.name
      // Get a reference to the audio player
      localStorage.setItem('songList', JSON.stringify(this.songPath))
      this.eventList = []
      this.zoneList = []
      reader.onload = (event) => {
        this.audioPlayer.src = event.target.result;

      };

      reader.readAsDataURL(file);
      this.totalTime = this.audioPlayer.duration
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
.removebtn{
  width:20px;
  height:20px;
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
.button{
  margin:20px;
  background-color: lightgreen;
  box-shadow: none;
  border:#00ab97;
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
}
</style>