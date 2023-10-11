export const getFormatedTime=sec=>{
    console.log("sec")
    console.log(sec);
    return Math.floor(sec/60).toString().padStart(2,'0')+':'+Math.floor(sec%60).toString().padStart(2,'0');

}