import { drawObj } from "./drawscript.js";
import { MEMBERS } from "./sidebarscript.js";
import { updateMovieState } from "./frameState.js";

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

export const tempPfp = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_v437iy1U9932C6L6Jzi8HBjgbzH4huC6rA&usqp=CAU"

export function randomUUID(n){
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < n) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function getTime(timestamp){
  const time = new Date(timestamp)  
  const hrs = time.getHours()%12 == 0 ? 12 : time.getHours()%12;
  let mins = time.getMinutes();
  mins = mins > 9 ? mins : "0" + mins;
  const suffix = time.getHours() >= 12 ? " PM" : " AM";
  return `${hrs}:${mins} ${suffix}`;
}

export function getTimePrefix(timestamp){
  if(timestamp == 0){return ""}
  
  const time = new Date(timestamp);
  const currenttime = Date.now();
  let prefix = "";
  if( currenttime - timestamp >  86400000 ){
    prefix = "Yesterday at";
    if( currenttime - timestamp >  86400000 * 2 ){
      return time.getDate()+"/"+(time.getMonth()+1)+"/"+time.getFullYear(); 
    }
  }
  else{
    prefix = "Today at";
  }
  
  const hrs = time.getHours()%12 == 0 ? 12 : time.getHours()%12;
  let mins = time.getMinutes();
  mins = mins > 9 ? mins : "0" + mins;
  const suffix = time.getHours() >= 12 ? " PM" : " AM";
  return `${prefix} ${hrs}:${mins} ${suffix}`; 
}

export async function showLoader(){
  $("#loaderContainer").classList.add("active")
}
export function closeLoader(){
  $("#loaderContainer").classList.remove("active")
}

$("#devCheck").addEventListener("click", ()=>{
  console.log("dev checking..");
  console.log(MEMBERS)
})


export function isValidImage(url) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}
export function isValidName(name){
  if (!name) return false
  return true
}

export function distanceBetween({x1,y1, x2,y2}) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}
export function angleBetween ({x1,y1, x2,y2}) {
  return Math.atan2(x2 - x1, y2 - y1)
}
export function midPointBtw({x1,y1,x2,y2}) {
  return {
    x: x1 + (x2 - x1) / 2,
    y: y1 + (y2 - y1) / 2
  };
}

export function devCommand(command){

  const cmd = command.split(" ")
  if (cmd[0] == "/d"){
    console.log(drawObj)
    return true;
  }
  else if (cmd[0] == "/size"){
    console.log(cmd)
    drawObj.size = Number(cmd[1])
    console.log(drawObj)
    return true;
  }
  else if (cmd[0] == "/check"){
    console.log(drawObj)
    return true;
  }
  else if(cmd[0] == "/stream"){
    updateMovieState(cmd[1],cmd[2])
    return true;
  }
}
export function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : null;
}
function reverseHex(val){
  const parts = val.split("")
  const r = parts[0] + parts[1];
  const g = parts[2] + parts[3];
  const b = parts[4] + parts[5];
  return b+g+r;
}
export function CanvasFloodfill(x, y, newColor, ctx) {
  newColor = "0xFF"+ reverseHex(newColor.split("#")[1].toUpperCase());
  var left, right, leftEdge, rightEdge;
  const w = ctx.canvas.width, h = ctx.canvas.height, pixels = w * h;
  const imgData = ctx.getImageData(0, 0, w, h);
  const p32 = new Uint32Array(imgData.data.buffer);
  const stack = [x + y * w]; // add starting pos to stack
  const targetColor = p32[stack[0]];
  console.log(targetColor, newColor)
  if (targetColor === newColor || targetColor === undefined) { return } // avoid endless loop
  while (stack.length) {
      let idx = stack.pop();
      while(idx >= w && p32[idx - w] === targetColor) { idx -= w }; // move to top edge
      right = left = false;   
      leftEdge = (idx % w) === 0;          
      rightEdge = ((idx +1) % w) === 0;
      while (p32[idx] === targetColor) {
          p32[idx] = newColor;
          if(!leftEdge) {
              if (p32[idx - 1] === targetColor) { // check left
                  if (!left) {        
                      stack.push(idx - 1);  // found new column to left
                      left = true;  // 
                  }
              } else if (left) { left = false }
          }
          if(!rightEdge) {
              if (p32[idx + 1] === targetColor) {
                  if (!right) {
                      stack.push(idx + 1); // new column to right
                      right = true;
                  }
              } else if (right) { right = false }
          }
          idx += w;
      }
  }
  ctx.putImageData(imgData,0, 0);
  return;
}

