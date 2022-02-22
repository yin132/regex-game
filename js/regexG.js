const match = document.getElementById("match");
const notMatch = document.getElementById("notMatch");
const textbox = document.getElementById("textbox");
const prompt = document.getElementById("prompt");
const counter = document.getElementById("counter");
const sub = document.getElementById("sub");

var inText = '';
var inRegex = /^$/;
var count = 0;

function readRegex() {
    inText = textbox.value;
    textbox.innerHTML = inText;
    inRegex = new RegExp('^' + inText + '$');
    
    count = inText.length;
    counter.innerHTML = count;


    console.log(inRegex.test("aaaabc"));

}