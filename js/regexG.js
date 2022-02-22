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

var promptCat = [];
var promptDir = [[]];
var curr = [0, -1];
var promptStr = '';
var toMatch = [];
var toNotMatch = [];

init();

function init() {
    loadPromptDir();

    $('#textbox').keypress(function (e) {
        if (e.which == 13) { // Enter key
            readRegex();
            return false;
        }
    });
}

function readRegex() {
    inText = textbox.value;
    textbox.innerHTML = inText;
    inRegex = new RegExp('^' + inText + '$');

    count = inText.length;
    counter.innerHTML = count;

    clearCase();
    for (var s of toMatch) {
        (inRegex.test(s)) ? s = '\u2713 ' + s : s = '\u274C' + s;
        addCase(s, match);
    }

    for (var s of toNotMatch) {
        (inRegex.test(s)) ? s = '\u2713 ' + s : s = '\u274C' + s;
        addCase(s, notMatch);
    }
}

function loadNext() {
    // select next prompt
    if (curr[1] + 1 >= promptDir[curr[0]].length) {
        curr[0]++;
        curr[1] = -1;
    }
    if(curr[0] >= promptCat.length){
        curr[0] = 0;
        curr[1] = -1;
    }
    curr[1]++;

    // load next prompt
    // doGetPrompt('https://raw.githubusercontent.com/yin132/regex-game/main/prompts/binary/binary-1.txt');
    doGetPrompt('https://raw.githubusercontent.com/yin132/regex-game/main/prompts/' +
        promptCat[curr[0]] + '/' + promptDir[[curr[0]]][curr[1]] + '.txt');
    promptText.innerHTML = 'Loading next prompt...';
}

function loadingNext(pfile) {
    pfile = pfile.replaceAll('[\r]','');
    var buf = pfile.split('\n');
    promptStr = buf[0];
    var i;
    toMatch = [];
    toNotMatch = [];
    for (i = 2; i < buf.length; i++) {
        buf[i] = buf[i].replaceAll('\r','');
        if (/NOT/.test(buf[i])) {
            break;
        }
        toMatch.push(buf[i]);
    }
    for (++i; i < buf.length; i++) {
        buf[i] = buf[i].replaceAll('\r','');
        toNotMatch.push(buf[i]);
    }

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

function clearCase() {
    $('#' + notMatch.id).children('div').remove();
    $('#' + match.id).children('div').remove();
}

function addCase(str, table) {
    $('#' + table.id).append('<div>' + str + '</div>');
}

function doGetPrompt(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status); // Rejects the promise
        }
        return response.text();
    }).then(text => {
        loadingNext(text);
    });
}

function loadPromptDir() {
    return fetch('https://raw.githubusercontent.com/yin132/regex-game/main/prompts/promptList.txt').then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status); // Rejects the promise
        }
        return response.text();
    }).then(text => {
        text = text.replaceAll('\r','');
        var buf = text.split('\n');
        var cat = -1;
        console.log(buf);
        for (var i = 0; i < buf.length; i++) {
            if (buf[i] === '') {
                continue;
            }
            buf[i] = buf[i].replaceAll('\r','');
            if (/CATEGORY/.test(buf[i])) {
                cat++;
                promptCat.push(buf[++i]);
                promptDir.push([]);
                continue;
            }
            promptDir[cat].push(buf[i]);
        }
    });
}