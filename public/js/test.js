let arr = [1, 2 ,3 ,4];
let index = 1;

console.log(arr)

const temparr = arr.concat();
// console.log(temparr)
// temparr = arr;
let a2 = temparr.splice(index+1, arr.length);
let a1 = temparr.splice(0, index);


console.log("concat : "+a1.concat(a2));

console.log("main array   " + arr)
console.log("copy array   " + temparr)
