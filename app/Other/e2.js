
function tt (){
    console.log("sfd")
 }
//  tt()

 hhh =>{
    console.log("SDFS")
 }

 (a) => {
    return a + 100;
  };


  
  function add(existingObject, newKey, newValue) {
   return {
     ...existingObject,
     [newKey]: newValue,
   };
 }

 function remove(obj, value) {
   for (let key in obj) {
     if (obj[key] === value) {
       delete obj[key];
       break; // stop searching after the first match is found
     }
   }
 }