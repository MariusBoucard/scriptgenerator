<template>
    <div style="height:100%;width:100%">

        <div class="containerCanvas">
            <div class="column-left">
                <div ref="outterDiv" @blur="saveImage()" style="width : 100%;height:100%;">

                    <v-stage style="border : 5px solid black" ref="stage" 
                    
                    :config="stageSize"
                        @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown"  @contextmenu="onContextMenu($event)">
                        <v-layer ref="layer">
                            <!-- OLD -->
                            <v-rect :config="backGround"></v-rect>
                            <v-rect v-for="item in squares" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.name" :config="item"
                                @transformend="handleTransformEnd" />
                            <v-text v-for="item in text" :key="item.id" @dragmove="handleDragMove(item.type,item.name,$event)" :config="item" @transformend="handleTransformEnd" />
                            <v-arrow v-for="item in arrows" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.id" :config="item"
                                @transformend="handleTransformEnd" />

                            <v-line v-for="item in lines" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.id" :config="item" @transformend="handleTransformEnd">

                            </v-line>
                            <v-ellipse v-for="item in ellipses" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.id" :config="item"
                                @transformend="handleTransformEnd">

                            </v-ellipse>
                            <!-- NEW -->
                            <template v-for="item in formes">
                                <v-rect v-if="item.type === 'square'" @dragmove="handleDragMove(item.type, item.name, $event)" :key="item.name" :config="item" @transformend="handleTransformEnd" />
                                <v-text v-else-if="item.type === 'text'" @dragmove="handleDragMove(item.type, item.name, $event)"  :config="item" @transformend="handleTransformEnd" />
                                <v-arrow v-else-if="item.type === 'arrow'" @dragmove="handleDragMove(item.type, item.name, $event)"  :config="item" @transformend="handleTransformEnd" />
                                <v-line v-else-if="item.type === 'line'" @dragmove="handleDragMove(item.type, item.name, $event)"  :config="item" @transformend="handleTransformEnd"></v-line>
                                <v-ellipse v-else-if="item.type === 'ellipse'" @dragmove="handleDragMove(item.type, item.name, $event)"  :config="item" @transformend="handleTransformEnd"></v-ellipse>
                            
                            </template>

                            <v-transformer ref="transformer" />
                        </v-layer>
                    </v-stage>
                </div>
            </div>
            <div class="column-right" style="display: block;">
                <p>Background color :</p>
                <input type="color" :value=selectedBackground @input="updateColorSelected($event.target.value)">
                <p>Border color :</p>
                <input type="color" :value=selectedBorder @input="updateBoundingColorSelected($event.target.value)">
                <p></p>
                <input v-model=textToAdd type="text" />
                <button @click="addText()" style="margin-top:20px">
                    add Text
                </button>
                <p></p>
                <button @click="supprElem()"> Suppr elem</button>
                <p></p>
                <button @click="saveImage()">save</button>

            </div>
        </div>




        <div style="margin:20px">

            <button style="display: inline-block; margin-right: 10px;" @click="addCircle()">
                add Circle
            </button>
            <button style="display: inline-block; margin-right: 10px;" @click="addLine()">
                add Line
            </button>
            <button @click="addSquare()">
                add Square
            </button>
            <button @click="addArrow()">
                add Arrow
            </button>




        </div>

    </div>
</template>
  
<script>
import { ref, nextTick } from 'vue';
import Konva from 'konva';
const width = ref(null);
const height = ref(null)

export default {
    props: {
        planImage : { required: true, type: Object },
        backgroundColor : {type : String},
        selectedScenes : {required : true, type : [Object]}
    },
    setup() {
        const outterDiv = ref(null);
        // const width = ref(null);

        nextTick(() => {
            if (outterDiv.value) {
                width.value = outterDiv.value.clientWidth; // Access the clientWidth property of the ref value
                height.value = outterDiv.value.clientWidth * 0.70; // Access the clientWidth property of the ref value

            }
        });

        return {
            outterDiv,
            width,
            height
        };
    },
    watch : {
        planImage : {
            handler(newvalue,oldvalue){
                this.formes = newvalue.formes ? newvalue.formes : []
                console.log(this.formes)
                this.$nextTick(() => {
                    console.log('paint')
                    const stage = this.$refs.stage.getNode();
                    console.log(stage)
        if (stage) {
          stage.draw();
        }
                });
            },
            deep : true
        },
        backgroundColor : {
            handler(newvalue,oldValue){
               this.backGround = {
                        type: "square",
                        rotation: 0,
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                        scaleX: 1,
                        scaleY: 1,
                        fill: newvalue,
                        name: "square" + String(Math.floor(Math.random() * 1000)),
                        draggable: false,
                    }
            }
        }
    },

    computed: {
        selectedBackground() {
            var form = this.allforms.find(form => form.name === this.selectedShapeName)
            if (form !== undefined) {

                return form.fill
            }
            return '#000000'
        },
        selectedBorder() {
            var form = this.allforms.find(form => form.name === this.selectedShapeName)
            if (form !== undefined) {

                return form.stroke
            }
            return '#000000'
        },
        allforms() {
            console.log(this.stageSize.background)
            return this.squares.concat(this.lines).concat(this.ellipses).concat(this.text).concat(this.arrows)
        }
    },
    data() {
        return {
            copyval : null,
            textToAdd: "",
            stageSize: {
                width: width,
                height: height,
            },
            formes : this.planImage.formes ? this.planImage.formes : [],
            ellipses: this.planImage.ellipses,
            squares: this.planImage.squares,
            arrows: this.planImage.arrows,
            lines:this.planImage.lines,
            text: this.planImage.text,
            selectedShapeName: '',
            backGround : 
                {
                        type: "square",
                        rotation: 0,
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                        scaleX: 1,
                        scaleY: 1,
                        fill: this.backgroundColor,
                        name: "square" + String(Math.floor(Math.random() * 1000)),
                        draggable: false,
                    }
            
        };
    },
    methods: {
        
        copy(name){
            if(this.formes.find(fo => fo.name === name)){

                this.copyval = JSON.stringify(this.formes.find(fo => fo.name === name));
            }
        },
        paste(){
            if(!(this.copyval === null || this.copyval === undefined)){
                var ca = JSON.parse(this.copyval)
                ca.name = ca.type+this.formes.length
                console.log("pasteval",this.copyval)
                this.formes.push(
                   ca
                )
            }
        },
        front(name){
            var index = this.formes.indexOf(this.formes.find(fo => fo.name === name))
            if (index < this.formes.length - 1) {
                const element = this.formes.splice(index, 1)[0];
                this.formes.push(element);
            }
        },
        back(name){
            var index = this.formes.indexOf(this.formes.find(fo => fo.name === name))

            if (index > 0 && index < this.formes.length) {
                const element = this.formes.splice(index, 1)[0];
                this.formes.unshift(element);
            }
        },
        sendForward(name){
            var index = this.formes.indexOf(this.formes.find(fo => fo.name === name))
            if (index < this.formes.length - 1) {
                const temp = this.formes[index];
                this.formes[index] = this.formes[index + 1];
                this.formes[index + 1] = temp;
            }
        },
        sendBackward(name){
            var index = this.formes.indexOf(this.formes.find(fo => fo.name === name))
            if (index > 0) {
                const temp = this.formes[index];
                this.formes[index] = this.formes[index -1];
                this.formes[index - 1] = temp;
            }
        },
        onContextMenu(e) {
  // prevent the browser's default menu
    //  e.preventDefault();
  // show the context menu
  console.log(e)
  this.$contextmenu({
    x: e.evt.clientX,
    y: e.evt.clientY,
    items: [
      { 
        label: "Move forward", 
        onClick: () => {
            
          this.sendForward(e.target.name());
        }
      },
      { 
        label: "Move backward",
        onClick:  () => {
            this.sendBackward(e.target.name());
        } 
      },
      { 
        label: "Put to front", 
        onClick: () => {
            
          this.front(e.target.name());
        }
      },
      { 
        label: "Put to back", 
        onClick: () => {
            
          this.back(e.target.name());
        }
      },
       { 
        label: "Copy",
        onClick:  () => {
           this.copy(e.target.name())
        } 
      },
      { 
        label: "Paste",
        onClick:  () => {
        this.paste()   
        } 
      },
      {
        label : 'copy Scene',
        children : this.menuCopy()
      }

    ]
  });
},
    menuCopy(){
        const cop = []

        this.selectedScenes.forEach(scene => cop.push({label : `Scene n° ${scene.numeroDsZone}`
                                                        , onClick : () => this.$emit('copyScene',scene.numeroDsZone)}))
                                                        return cop
    },
        saveImage() {
            console.log("caca",this.planImage)

            let stage = this.$refs.stage.getNode()
            let dataURL = stage.toDataURL()
            // console.log(dataURL)
            // console.log(this.planimage)
            this.$emit('updateImage',{
                planImage : {
                    formes : this.formes,
                    ellipses : this.ellipses,
                    squares : this.squares,
                    arrows : this.arrows,
                    lines : this.lines,
                    text : this.text

                },
                data : dataURL
            })
        },
        updateBoundingColorSelected(event) {
            var form = this.formes.find(truc => truc.name === this.selectedShapeName)
            if (form !== undefined) {

                form.stroke = event
            }
        },
        updateColorSelected(event) {
            var form = this.formes.find(truc => truc.name === this.selectedShapeName)
            if (form !== undefined) {
                if (form.type === "line" || form.type === "arrow") {
                    form.stroke = event
                } else {

                    form.fill = event
                }

            }
        },
        supprElem() {
            var find = this.formes.find(elem => elem.name === this.selectedShapeName)
            console.log(find)
            var index = this.formes.indexOf(find)
            this.formes.splice(index,1)
            this.updateTransformer()
            if(find === undefined){
                find = this.allforms.find(elem => elem.name === this.selectedShapeName)
                if (find !== undefined) {
                    switch (find.type) {
                        case "square":
                            var index = this.squares.indexOf(find)
                            this.squares.splice(index, 1)
                            this.selectedShapeName = ''
                            this.updateTransformer();
                            break;
                        case "ellipse":
                            var index = this.ellipses.indexOf(find)
                            this.ellipses.splice(index, 1)
                            this.selectedShapeName = ''
                            this.updateTransformer();
                            break;
                        case "line":
                            var index = this.lines.indexOf(find)
                            this.lines.splice(index, 1)
                            this.selectedShapeName = ''
                            this.updateTransformer();
                            break;
                        case "text":
                            var index = this.text.indexOf(find)
                            this.text.splice(index, 1)
                            this.selectedShapeName = ''
                            this.updateTransformer();
                            break;
                        case "arrow":
                            var index = this.arrows.indexOf(find)
                            this.arrows.splice(index, 1)
                            this.selectedShapeName = ''
                            this.updateTransformer();
                            break;
                    }
            }

            }
        },
        addArrow() {
            this.formes.push({
                points: [73, 70, 500, 20],
                    stroke: '#000000',
                    tension: 1,
                    pointerLength: 10,
                    pointerWidth: 12,
                    hitStrokeWidth: 30,
                    type: "arrow",
                    name: "arrow" + String(this.formes.length),
                    draggable: true,
            })
           
        },
        addSquare() {
            this.formes.push(


                {
                    type: "square",
                    rotation: 0,
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100,
                    scaleX: 1,
                    scaleY: 1,
                    fill: 'red',
                    name: "square" + String(this.formes.length),
                    draggable: true,
                })
            console.log("square added")
        },
        addText() {
            this.formes.push(


                {
                    type: "text",
                    x: 10,
                    y: 15,
                    text: this.textToAdd,
                    fontSize: 30,
                    fontFamily: 'Calibri',
                    fill: 'black',
                    name: "text" + String(this.formes.length),
                    draggable: true,
                })
            console.log("square added")
        },
        addCircle() {
            this.formes.push(
                {
                    type: "ellipse",

                    width: 100,
                    height: 100,
                    x: 100,
                    y: 100,
                    stroke: 'black',
                    draggable: true,
                    name: "circle" + String(this.formes.length)
                }
            )
            console.log("circle added")

        },
        addLine() {
            this.formes.push(
                {
                    type:"line",
                    x: 100,
                    y: 50,
                    scaleX: 1,
                    scaleY: 1,
                    rotation:0,
                    points: [20, 70, 80, 70],
                    name: 'line' + String(this.formes.length),
                    stroke: 'black',
                    draggable: true,
                    hitStrokeWidth: 30
                }
            )
        },
        handleDragMove(type,name,evt){

            var rect = null
            rect = this.formes.find(re => re.name === name)
            if(rect !== undefined){
                rect.rotation = evt.target.rotation();
            rect.scaleX = evt.target.scaleX();
            rect.scaleY = evt.target.scaleY();
                rect.x = evt.target.x();
                rect.y = evt.target.y();
                return
            }
            if(type === "line"){

                rect = this.lines.find(sq => sq.name === name)
                console.log(rect)
                rect.rotation = evt.target.rotation();
            rect.scaleX = evt.target.scaleX();
            rect.scaleY = evt.target.scaleY();
                rect.x = evt.target.x();
                rect.y = evt.target.y();
             
                return
            }
           
            switch (type) {
                    case "square":
                        rect = this.squares.find(sq => sq.name === name)
                        break;
                    case "ellipse":
                        rect = this.ellipses.find(sq => sq.name === name)
                        break;
                    case "text":
                        rect = this.text.find(sq => sq.name === name)
                        break;
                    case "arrow":
                        rect = this.arrows.find(sq => sq.name === name)
                        break;}
                        console.log(evt)
            rect.x = evt.target.x();
            rect.y = evt.target.y();
            rect.rotation = evt.target.rotation();
            rect.scaleX = evt.target.scaleX();
            rect.scaleY = evt.target.scaleY();
        },
        handleTransformEnd(e) {
            var rect = this.formes.find(r => r.name === this.selectedShapeName)
            if(rect !== undefined){
                rect.x = e.target.x();
                rect.y = e.target.y();
                rect.rotation = e.target.rotation();
                rect.scaleX = e.target.scaleX();
                rect.scaleY = e.target.scaleY();
                return
            }
            // shape is transformed, let us save new attrs back to the node
            // find element in our state


            rect = this.allforms.find(
                (r) => r.name === this.selectedShapeName
            );
            console.log(rect)
            // update the state
            rect.x = e.target.x();
            rect.y = e.target.y();
            rect.rotation = e.target.rotation();
            rect.scaleX = e.target.scaleX();
            rect.scaleY = e.target.scaleY();

          
            // change fill
            // rect.fill = Konva.Util.getRandomColor();
        },
        handleStageMouseDown(e) {
            // clicked on stage - clear selection
            if (e.target === e.target.getStage()) {
                this.selectedShapeName = '';
                this.updateTransformer();
                return;
            }

            // clicked on transformer - do nothing
            const clickedOnTransformer =
                e.target.getParent().className === 'Transformer';
            if (clickedOnTransformer) {
                return;
            }

            // find clicked rect by its name
            const name = e.target.name();
            var rect = this.allforms.find((r) => r.name === name);
            if (rect) {
                this.selectedShapeName = name;
                this.updateTransformer();
                return
            }   

            rect = this.formes.find((r) => r.name === name);
            if (rect) {
                this.selectedShapeName = name;
            } else {
                this.selectedShapeName = '';
            }
            this.updateTransformer();
        },
        updateTransformer() {
            // here we need to manually attach or detach Transformer node
            const transformerNode = this.$refs.transformer.getNode();
            const stage = transformerNode.getStage();
            const { selectedShapeName } = this;

            const selectedNode = stage.findOne('.' + selectedShapeName);
            // do nothing if selected node is already attached
            if (selectedNode === transformerNode.node()) {
                return;
            }

            if (selectedNode) {
                // attach to another node
                transformerNode.nodes([selectedNode]);
            } else {
                // remove transformer
                transformerNode.nodes([]);
            }
        },
    },
};
</script>
<style>
.containerCanvas {
    display: flex;
    width: 100%;
}

.column-left {
    flex-basis: 80%;
    background-color: #ccc;
}

.column-right {
    flex-basis: 20%;
    background-color: #eee;
}</style>