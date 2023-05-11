<template>
    <div style="height:100%;width:100%;background-color: blue;">

        <div class="containerCanvas">
            <div class="column-left">
                <div ref="outterDiv" style="width : 100%;height:100%;background-color: grey;">

                    <v-stage style="border : 5px solid black" ref="stage" :config="stageSize"
                        @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown">
                        <v-layer ref="layer">
                            <v-rect v-for="item in squares" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.name" :config="item"
                                @transformend="handleTransformEnd" />
                            <v-text v-for="item in text" :key="item.id" @dragmove="handleDragMove(item.type,item.name,$evt)" :config="item" @transformend="handleTransformEnd" />
                            <v-arrow v-for="item in arrows" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.id" :config="item"
                                @transformend="handleTransformEnd" />

                            <v-line v-for="item in lines" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.id" :config="item" @transformend="handleTransformEnd">

                            </v-line>
                            <v-ellipse v-for="item in ellipses" @dragmove="handleDragMove(item.type,item.name,$event)" :key="item.id" :config="item"
                                @transformend="handleTransformEnd">

                            </v-ellipse>
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
                <button @click="addText()">
                    add Text
                </button>
                <p></p>
                <button @click="saveImage()">save</button>
                <button @click="supprElem()"> Suppr elem</button>

            </div>
        </div>




        <div style="margin:20px">

            <button @click="addCircle()">
                add Circle
            </button>
            <button @click="addLine()">
                add Line
            </button>
            <button @click="addSquare()">
                add Square
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
        planImage : { required: true, type: Object }
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
            return this.squares.concat(this.lines).concat(this.ellipses).concat(this.text).concat(this.arrows)
        }
    },
    data() {
        return {
            textToAdd: "",
            stageSize: {
                width: width,
                height: height,
                backgroundColor : this.planImage.backgroundColor
            },
            ellipses: this.planImage.ellipses,
            squares: this.planImage.squares,
            arrows: this.planImage.arrows,
            lines:this.planImage.lines,
            text: this.planImage.text,
            selectedShapeName: '',
        };
    },
    methods: {
        saveImage() {
            console.log("caca",this.planImage)

            let stage = this.$refs.stage.getNode()
            let dataURL = stage.toDataURL()
            // console.log(dataURL)
            // console.log(this.planimage)
            this.$emit('updateImage',{
                ellipses : this.ellipses,
                squares : this.squares,
                arrows : this.arrows,
                lines : this.lines,
                text : this.text
            })
        },
        updateBoundingColorSelected(event) {
            var form = this.allforms.find(truc => truc.name === this.selectedShapeName)
            if (form !== undefined) {

                form.stroke = event
            }
        },
        updateColorSelected(event) {
            var form = this.allforms.find(truc => truc.name === this.selectedShapeName)
            if (form !== undefined) {
                if (form.type === "line" || form.type === "arrow") {
                    form.stroke = event
                } else {

                    form.fill = event
                }

            }
        },
        supprElem() {
            var find = this.allforms.find(elem => elem.name === this.selectedShapeName)
            console.log(find)
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
        },
        addArrow() {
            this.arrows.push(
                {
                    points: [73, 70, 500, 20],
                    stroke: '#000000',
                    tension: 1,
                    pointerLength: 10,
                    pointerWidth: 12,
                    hitStrokeWidth: 10,
                    type: "arrow",
                    name: "arrow" + String(Math.floor(Math.random() * 1000)),
                    draggable: true,
                }

            )
        },
        addSquare() {
            this.squares.push(


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
                    name: "square" + String(Math.floor(Math.random() * 1000)),
                    draggable: true,
                })
            console.log("square added")
        },
        addText() {
            this.text.push(


                {
                    type: "text",
                    x: 10,
                    y: 15,
                    text: this.textToAdd,
                    fontSize: 30,
                    fontFamily: 'Calibri',
                    fill: 'black',
                    name: "text" + String(Math.floor(Math.random() * 1000)),
                    draggable: true,
                })
            console.log("square added")
        },
        addCircle() {
            this.ellipses.push(
                {
                    type: "ellipse",

                    width: 100,
                    height: 100,
                    x: 100,
                    y: 100,
                    stroke: 'black',
                    draggable: true,
                    name: "circle" + String(Math.floor(Math.random() * 1000))
                }
            )
            console.log("circle added")

        },
        addLine() {
            this.lines.push(
                {
                    type:"line",
                    x: 100,
                    y: 50,
                    scaleX: 1,
                    scaleY: 1,
                    rotation:0,
                    points: [73, 70, 500, 20],
                    name: 'line' + String(Math.floor(Math.random() * 1000)),
                    stroke: 'black',
                    draggable: true,
                    hitStrokeWidth: 10
                }
            )
        },
        handleDragMove(type,name,evt){

            var rect = null
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
                    rect = this.arrow.find(sq => sq.name === name)
                        break;}
                        console.log(evt)
            rect.x = evt.target.x();
            rect.y = evt.target.y();
            rect.rotation = evt.target.rotation();
            rect.scaleX = evt.target.scaleX();
            rect.scaleY = evt.target.scaleY();
        },
        handleTransformEnd(e) {
            // shape is transformed, let us save new attrs back to the node
            // find element in our state
            const rect = this.allforms.find(
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
            const rect = this.allforms.find((r) => r.name === name);
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