import { authObj } from "./authorization.js";
import { socketObj } from "./socketClient.js";
import { randomUUID, hexToRgb, midPointBtw, distanceBetween, angleBetween, CanvasFloodfill, clamp } from "./utils.js";

import ReinventedColorWheel from "../module/reinvented-color-wheel.js";

export const drawObj = {
    selected: "brush",
    CANVAS: null,
    color: "#323232",
    size: 15,
    clickActive: false,
    lastKnwnPoint: {x:0,y:0},
    layerMapping:{},

    scale: 1,

    worldX: 0,
    worldY: 0,

    screenX: 0,
    screenY: 0,
    
    offsetX: 0,
    offsetY: 0,

    startPanX: 0,
    startPanY: 0,

    changeSize: function(val){
        this.size = val
        if (this.size > DesktopCanvas.sizeMax) {
            this.size = DesktopCanvas.sizeMax 
        } 
        else if(this.size < DesktopCanvas.sizeMin) {
            this.size = DesktopCanvas.sizeMin 
        }
        const canvas = $(".brushSizeViewer")
        if( canvas ){
            console.log("change view")
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width, canvas.height)
            ctx.strokeStyle = "grey";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, this.size / 2, 0, Math.PI*2);
            ctx.stroke();
        }
    }
}
const closeDrawBtn = $("#drawModal .closeDrawModal")
closeDrawBtn.addEventListener("click", closeDrawModal)
export function closeDrawModal(){
    $("#drawModal .contents").innerHTML = ""
    $("#drawModal").classList.add("hide")
    $("#drawModal").close();
}
export function clearcanvasTool(){
    console.log("clear canvas")

}
export function settingsTool(){
    console.log("settings")
}
export function undoTool(){
    console.log("undo")
    drawObj.CANVAS.undoAction();
}
export function redoTool(){
    console.log("redo")
}
export function panzoomTool(){
    console.log("panzoom")
    if(drawObj.selected == "pan&zoom"){
        drawObj.cScale = 1
        drawObj.cOffsetX = 0
        drawObj.cOffsetY = 0
        drawObj.CANVAS.updatePanZoom();
    }
    drawObj.selected = "pan&zoom"
}
export function brushTool(){
    console.log("brush")
    if(drawObj.selected != "brush"){
        drawObj.selected = "brush"
        return
    }
    // open draw modal
    $("#drawModal").classList.remove("hide")
    $("#drawModal").showModal();
    $("#drawModal .contents").innerHTML = ""

    const sizeSelection = document.createElement("div");
    const brushSelection = document.createElement("div");


    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    div1.style.display = "grid";
    div1.style.placeItems = "center";
    const input1 = document.createElement("input");
    input1.type = "range"
    input1.min = CanvasPlatform.sizeMin
    input1.max = CanvasPlatform.sizeMax
    input1.value = drawObj.size
    input1.oninput = (e)=>{drawObj.changeSize(e.target.value)}
    div1.appendChild(input1)
    
    const canvas1 = document.createElement("canvas")
    canvas1.classList = "brushSizeViewer"
    canvas1.width = CanvasPlatform.sizeMax + 2
    canvas1.height = CanvasPlatform.sizeMax + 2
    div2.appendChild(canvas1)

    sizeSelection.appendChild(div1)
    sizeSelection.appendChild(div2)

    sizeSelection.classList = "sizeSelection"
    Object.assign(sizeSelection.style,{
        display:"grid",
        gap:"20px",
        justifyContent:"center",
        gridTemplateColumns:`auto ${CanvasPlatform.sizeMax + 2}px`,
        height:`${CanvasPlatform.sizeMax + 2}px`,
        width:"100%"
    })

    $("#drawModal .contents").appendChild(sizeSelection);
    $("#drawModal .contents").appendChild(brushSelection);
    drawObj.changeSize(drawObj.size)
}
export function eraseTool(){
    console.log("erase")
    drawObj.selected = "erase"
}
export function paletteTool(){
    console.log("palette")
    $("#drawModal").classList.remove("hide")
    $("#drawModal").showModal();
    
    $("#drawModal .contents").innerHTML = ""

    const colorWheel = new ReinventedColorWheel({
        // appendTo is the only required property. specify the parent element of the color wheel.
        appendTo: $("#drawModal .contents"),
      
        // followings are optional properties and their default values.
      
        // initial color (can be specified in hsv / hsl / rgb / hex)
        // hsv: [0, 100, 100],
        // hsl: [0, 100, 50],
        // rgb: [255, 0, 0],
        hex: '#FF0000',
      
        // appearance
        wheelDiameter: 200,
        wheelThickness: 20,
        handleDiameter: 16,
        wheelReflectsSaturation: true,
      
        // handler
        onChange: function (color) {
          // the only argument is the ReinventedColorWheel instance itself.
          // console.log("hsv:", color.hsv[0], color.hsv[1], color.hsv[2]);
          drawObj.color = color.hex
        },
    });
}
export function colorpickerTool(){
    console.log("color picker")
}
export function bucketTool(){
    console.log("bucket")
    drawObj.selected = "bucket"
}
export function layersTool(){
    console.log("layers")
}
export function setBaseCanvas(canvas, canvasContainer){
    if(window.mobileAndTabletCheck()){
        drawObj.CANVAS = new MobileCanvas(canvas, canvasContainer) 
    }else{
        drawObj.CANVAS = new DesktopCanvas(canvas, canvasContainer)
    }
}

class CanvasPlatform{
    static sizeMax = 70;
    static sizeMin = 5;

    static zoomSpeed = 0.012;
    static zoomMax = 3;
    static zoomMin = 0.5;

    static panMax = 300;
    static panMin = -300;

    constructor(canvas,canvasContainer){
        this.canvas          = canvas
        this.canvasContainer = canvasContainer
        const rect0          = canvasContainer.getBoundingClientRect();
        this.canvasContainer.width = rect0.width
        this.canvasContainer.height = rect0.height

        // const dpr          = window.devicePixelRatio;
        const rect1         = canvas.getBoundingClientRect();
        this.canvas.width  = rect1.width * (1 || dpr);
        this.canvas.height = rect1.height * (1 || dpr);
        
        this.CONTEXTS        = []
        this.CONTEXTS.push( this.createLayer("layer 0") )
        drawObj.layerMapping[authObj.uid] = 0

        this.canvas.addEventListener('contextmenu', e=>{e.preventDefault();});
        this.DRAWHISTORY        = [];
        this.currentState   = -1;
        // {type:'brush', color, size, points:[{x,y},{x,y},{x,y},{x,y}...]}
        // {type:'erase', points:[{x,y},{x,y},{x,y},{x,y}...]}
        // {type:'fill',  color, x, y }
        // {type:''}
    }
    createLayer(name){
        const newlayer = this.canvas.cloneNode()
        newlayer.classList = name
        newlayer.id = "c" + randomUUID(6)
        newlayer.width = this.canvas.width
        newlayer.height = this.canvas.height
        $("#canvasContainer").prepend(newlayer)
        // this.ctx           = canvas.getContext("2d",{ alpha: true })
        return newlayer.getContext("2d")
    }
    getPointerPos({clientX, clientY}) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
            y: (clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
        };
    }
    drawQuadraticLine({x1,y1,x2,y2, color=drawObj.color, size=drawObj.size},ctxId=0){
        const ctx = this.CONTEXTS[ctxId]
        if(!ctx){console.error("no context available");return;}

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineWidth = size;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle = color

        var midPoint = midPointBtw({x1,y1,x2,y2});
        ctx.quadraticCurveTo(x1, y1, midPoint.x, midPoint.y);

        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    eraseQuadraticLine({x1,y1,x2,y2, size=drawObj.size},ctxId=0){
        const ctx = this.CONTEXTS[ctxId]
        if(!ctx){console.error("no context available");return;}

        const dist = distanceBetween({x1,y1, x2,y2});
        const angle = angleBetween({x1,y1, x2,y2});
        const halfSizeOfBrush = size / 2;

        for (let i = 0; i < dist; i += halfSizeOfBrush / 2) {
            const x = x1 + (Math.sin(angle) * i) - halfSizeOfBrush
            const y = y1 + (Math.cos(angle) * i) - halfSizeOfBrush
            this.erasePoint({x, y, size:halfSizeOfBrush},ctxId);
        }
    }
    erasePoint({x,y, size},ctxId=0){
        const ctx = this.CONTEXTS[ctxId]
        if(!ctx){console.error("no context available");return;}

        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.arc(x + size, y + size, size, 0, Math.PI*2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

    }
    fillPoint({x,y,color},ctxId=0){
        const ctx = this.CONTEXTS[ctxId]
        if(!ctx){console.error("no context available");return;}

        // setTimeout(() => {
            CanvasFloodfill(x,y, color,ctx);
        // }, 0);

    }
    applyAction2Canvas(action){
        switch(action.type){
            case "brush":
                if(action.points.length == 1){
                    action.points.push(action.points[0])
                }
                for(let i = 1; i < action.points.length; i++){
                    const prevpoint = action.points[i-1]
                    const point = action.points[i]
                    this.drawQuadraticLine({x1:prevpoint.x, y1:prevpoint.y,
                        x2:point.x,y2:point.y,
                        color:action.color,size:action.size, 
                    },drawObj.layerMapping[action.uid])
                }
                break;

            case "erase":
                for(let i = 1; i < action.points.length; i++){
                    const prevpoint = action.points[i-1]
                    const point = action.points[i]
                    this.eraseQuadraticLine({x1:prevpoint.x, y1:prevpoint.y,
                        x2:point.x,y2:point.y,
                        size:action.size, 
                    })
                }
                break;
            case "bucket":
                this.fillPoint(action)
                break;
        }
        this.DRAWHISTORY.push(action);
        this.currentState++;
    }
    // Requirements
    // - Must work for multiple layers
    // - Should affect all users
    // - Memory efficient
    undoAction(){
        //

    }
    redoAction(){
        //

    }

    updatePanZoom(scale=drawObj.scale,offsetX=drawObj.offsetX, offsetY=drawObj.offsetY){
        console.log("updating..", scale, offsetX, offsetY)
        scale = clamp(scale,CanvasPlatform.zoomMin, CanvasPlatform.zoomMax )
        drawObj.scale = scale

        function changeCSS(ele){
            ele.style.transform = `scale(${scale}) translate(${-offsetX / scale}px, ${-offsetY / scale}px)`;
        }

        changeCSS(this.canvas);
        this.CONTEXTS.forEach((context)=>{changeCSS(context.canvas);})
    }
}
class SocketPlatform extends CanvasPlatform{
    constructor(canvas,canvasContainer){
        super(canvas,canvasContainer)
        this.action = {}

        socketObj.io.emit("drawInit", authObj.uid);
    }
    resetActionObj(){
        this.action = {
            actionid:"",
            uid:authObj.uid,
            mode:"desktop",
            type:"",
            color:"",
            size:-1,
            points:[],
            x:-1,
            y:-1,
        }
    }
    
    fromServer(action){
        this.applyAction2Canvas(action);
    }
    pushServer(action){
        if(action.uid == authObj.uid){
            socketObj.io.emit("draw", Object.assign(action,{drawid:randomUUID(8)}))
            this.DRAWHISTORY.push(action)
            this.currentState++;
        }
    }

}
class DesktopCanvas extends SocketPlatform{

    constructor(canvas,canvasContainer){
        super(canvas,canvasContainer)
        this.createEvents()

        this.recordRate = 10;
        this.lastRecorded = Date.now();
    }
    createEvents(){
        this.canvasContainer.addEventListener("pointerdown", this.onPointerDown.bind(this), true)
        this.canvasContainer.addEventListener("pointermove", this.onPointerMove.bind(this), true)
        this.canvasContainer.addEventListener("pointerup",   this.onPointerUp.bind(this),   true)
        this.canvasContainer.addEventListener("pointerleave",this.onPointerLeave.bind(this))

        this.canvasContainer.addEventListener("wheel",       this.onWheel.bind(this))
        this.canvasContainer.addEventListener("keydown",     this.onKeyDown.bind(this))
    }

    onPointerDown({clientX, clientY, which}){
        if ( which != 1 ) return

        drawObj.clickActive = true
        this.resetActionObj()
        const {x,y} = this.getPointerPos({clientX,clientY})
        drawObj.lastKnwnPoint = {x,y}
        switch(drawObj.selected){
            case "brush":
                this.action.actionid = randomUUID(8)
                this.action.type = "brush";
                this.action.color = drawObj.color;
                this.action.size = drawObj.size;
                this.action.points = [{x,y}]
                
                this.drawQuadraticLine({x1:drawObj.lastKnwnPoint.x,y1:drawObj.lastKnwnPoint.y,x2:x,y2:y},drawObj.layerMapping[authObj.uid]);
                break;
            case "erase":
                this.action.actionid = randomUUID(8)
                this.action.type = "erase"
                this.action.size = drawObj.size;
                this.action.points = [{x,y}]

                this.eraseQuadraticLine({x1:drawObj.lastKnwnPoint.x,y1:drawObj.lastKnwnPoint.y, x2:x, y2:y}, drawObj.layerMapping[authObj.uid]);
                break;
            case "bucket":
                this.action.actionid = randomUUID(8)
                this.action.type = "bucket",
                this.action.color = drawObj.color
                this.action.x = x
                this.action.y = y
                this.fillPoint({x,y,color:drawObj.color},drawObj.layerMapping[authObj.uid]);
                break;
            case "pan&zoom":
                break;
        }
    }
    onPointerMove({clientX,clientY}){
        if(!drawObj.clickActive) return
        if(Date.now() - this.lastRecorded < this.recordRate){return}
        this.lastRecorded = Date.now();

        const {x,y} = this.getPointerPos({clientX,clientY})

        switch(drawObj.selected){
            case "brush":
                this.action.points.push({x,y})
                this.drawQuadraticLine({x1:drawObj.lastKnwnPoint.x,y1:drawObj.lastKnwnPoint.y,x2:x,y2:y},drawObj.layerMapping[authObj.uid]);
                break;
            case "erase":
                this.action.points.push({x,y})
                this.eraseQuadraticLine({x1:drawObj.lastKnwnPoint.x,y1:drawObj.lastKnwnPoint.y,x2:x,y2:y},drawObj.layerMapping[authObj.uid]);
                break;
            case "pan&zoom":
                break;
        }
        // Save current x,y to known point for
        // connection between next position
        drawObj.lastKnwnPoint = {x,y}
    }
    onPointerUp(){
        drawObj.clickActive = false
        if(this.action.actionid) this.pushServer(this.action)
        this.resetActionObj()
    }
    onPointerLeave(){
        drawObj.clickActive = false
        if(this.action.actionid) this.pushServer(this.action)
        this.resetActionObj()
    }
    onWheel({deltaY, clientX, clientY}){
        if(deltaY == 0) return;
        const direction = deltaY > 0 ? false : true;

        switch(drawObj.selected){
            case "brush":
            case "erase":
                if(drawObj.clickActive){break}
                if (direction) { drawObj.changeSize(drawObj.size + 2) }
                else { drawObj.changeSize(drawObj.size - 2) }
                
                break;
            case "pan&zoom":
                break;
        }

    }
    onKeyDown(){

    }
}
class MobileCanvas extends SocketPlatform{
    constructor(canvas,canvasContainer){
        super(canvas,canvasContainer)
    }
    createEvents(){
        this.canvas.addEventListener("touchstart",)
        this.canvas.addEventListener("touchmove",)
        this.canvas.addEventListener("touchend",)
        this.canvas.addEventListener("touchcancel",)
    }
}
export function drawInitReceive(drawHistory){
    const actionsCount = drawHistory.length;
    drawHistory.forEach((action,idx)=>{
        setTimeout(()=>{onDrawUpdateReceived(action)}, idx * (1000 / actionsCount));
    })
}
export function onDrawUpdateReceived(data){
    drawObj.CANVAS.fromServer(data);
}