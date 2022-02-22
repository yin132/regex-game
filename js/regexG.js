const match = document.getElementById("match");
const notMatch = document.getElementById("notMatch");
const textbox = document.getElementById("textbox");
const promptText = document.getElementById("prompt");
const counter = document.getElementById("counter");
const sub = document.getElementById("subBtn");
const nxt = document.getElementById("nxtBtn");

var inText = '';
var inRegex = /^$/;
var count = 0;

var promptStr = '';
var toMatch = [];
var toNotMatch = [];

init();

function init() {
    // TODO
}

function readRegex() {
    inText = textbox.value;
    textbox.innerHTML = inText;
    inRegex = new RegExp('^' + inText + '$');

    count = inText.length;
    counter.innerHTML = count;

    clearCase();
    for (var s of toMatch) {
        (inRegex.test(s)) ? s = '\u2713 ' + s: s = '\u274C' + s;
        addCase(s, match);
    }

    for (var s of toNotMatch) {
        (inRegex.test(s)) ? s = '\u2713 ' + s: s = '\u274C' + s;
        addCase(s, notMatch);
    }
}

function loadNext() {
    // select next prompt
    
    // load next prompt
    promptStr = 'Match a binary number only';
    toMatch = ['1', '0', '100110'];
    toNotMatch = ['abc', '012', '1 0'];

    // render prompt
    promptText.innerHTML = promptStr;

    clearCase();
    for (var s of toMatch) {
        addCase(s, match);
    }

    for (var s of toNotMatch) {
        addCase(s, notMatch);
    }
}

function readCsv(csvName) {

}

function clearCase(){
    $('#' + notMatch.id).children('div').remove();
    $('#' + match.id).children('div').remove();
}

function addCase(str, table) {
    $('#' + table.id).append('<div>'+str+'</div>');
}