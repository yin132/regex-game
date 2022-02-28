const match = document.getElementById("match");
const notMatch = document.getElementById("notMatch");
const textbox = document.getElementById("textbox");
const promptText = document.getElementById("prompt");
const counter = document.getElementById("counter");
const sub = document.getElementById("subBtn");
const nxt = document.getElementById("nxtBtn");
const sbar = document.getElementById("sidebar");
const main = document.getElementById("mainArea");
const nMenu = document.getElementById("navMenu");
const ref = document.getElementById('ref')
const refBtn = document.getElementById('refBtn')
const custFile = document.getElementById('formFile');
const custUrl = document.getElementById('urlText');


let inText = '';
let inRegex = /^$/;
let count = 0;

let promptCat = [];
let promptDir = [
    []
];
let curr = [0, 0];
let promptStr = '';
let toMatch = [];
let toNotMatch = [];

init();

function init() {
    loadPromptDir();

    $('#textbox').keypress(function(e) {
        if (e.which == 13) { // Enter key
            readRegex();
            console.log(inText);
            return false;
        }
    });

    $('#textbox').keyup(function(e) {
        readRegex();
        console.log(inText);
    });

    ref.addEventListener('shown.bs.modal', function() {
        refBtn.focus()
    })
}

function readRegex() {
    inText = textbox.value;
    textbox.innerHTML = inText;
    inRegex = new RegExp('^' + inText + '$');

    count = inText.length;
    counter.innerHTML = count;

    clearCase();
    for (let s of toMatch) {
        (inRegex.test(s)) ? s = '\u2713 ' + s: s = '\u274C' + s;
        addCase(s, match);
    }

    for (let s of toNotMatch) {
        (inRegex.test(s)) ? s = '\u2713 ' + s: s = '\u274C' + s;
        addCase(s, notMatch);
    }
}

function onPrev() {
    setPrevPrompt();
    loadCurr();
}

function onNext() {
    setNextPrompt();
    loadCurr();
}

function setPrevPrompt() {
    deselect();
    // select previous prompt
    curr[1]--;

    if (curr[1] < 0) {
        curr[0]--;
        if (curr[0] < 0) {
            curr[0] = promptCat.length - 1;
        }
        curr[1] = promptDir[curr[0]].length - 1;
    }
}

function setNextPrompt() {
    deselect();
    // select next prompt
    if (curr[1] + 1 >= promptDir[curr[0]].length) {
        curr[0]++;
        curr[1] = -1;
    }
    if (curr[0] >= promptCat.length) {
        curr[0] = 0;
        curr[1] = -1;
    }
    curr[1]++;
}

function loadCurr() {
    select();
    // load current prompt
    doGetPrompt('https://raw.githubusercontent.com/yin132/regex-game/main/prompts/' +
        promptCat[curr[0]] + '/' + promptDir[[curr[0]]][curr[1]] + '.txt');
    promptText.innerHTML = 'Loading next prompt...';
}

function loadingCurr(pfile) {
    pfile = pfile.replaceAll('\r', '');
    let buf = pfile.split('\n');
    console.log(buf);
    promptStr = buf[0];
    toMatch = [];
    toNotMatch = [];
    for (var i = 2; i < buf.length; i++) {
        if (/NOT/.test(buf[i])) {
            break;
        }
        toMatch.push(buf[i]);
    }
    for (++i; i < buf.length; i++) {
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
        loadingCurr(text);
    });
}

function loadPromptDir() {
    return fetch('https://raw.githubusercontent.com/yin132/regex-game/main/prompts/promptList.txt').then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status); // Rejects the promise
        }
        return response.text();
    }).then(text => {
        text = text.replaceAll('\r', '');
        var buf = text.split('\n');
        var cat = -1;
        console.log(buf);
        for (var i = 0; i < buf.length; i++) {
            if (buf[i] === '') {
                continue;
            }
            if (/CATEGORY/.test(buf[i])) {
                cat++;
                promptCat.push(buf[++i]);
                promptDir.push([]);
                continue;
            }
            promptDir[cat].push(buf[i]);
        }
        loadNav();
        loadCurr();
    });
}

function loadPrompt(c, p) {
    deselect();
    curr = [c, p];
    loadCurr();
}

function select() {
    // document.getElementById("p-" + curr[0] + "-" + curr[1]).style.backgroundColor = '#fff';
    document.getElementById("p-" + curr[0] + "-" + curr[1]).style.color = '#fff';
}

function deselect() {
    document.getElementById("p-" + curr[0] + "-" + curr[1]).style.color = '#212519';
    // document.getElementById("p-" + curr[0] + "-" + curr[1]).style.backgroundColor = 'rgb(187, 205, 255)';
}

function toggleNav() {
    if (sbar.style.width < '250px') {
        sbar.style.width = '250px';
        main.style.marginLeft = '250px';
    } else {
        sbar.style.width = '0px';
        main.style.marginLeft = '0px';
    }
}

function loadNav() {
    $('#' + nMenu.id).children('li').remove();
    for (let i = 0; i < promptCat.length; i++) {
        $('#' + nMenu.id).append(`<li class="mb-1">
        <a href="#` + promptCat[i] + `" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
            <span class="ms-1 d-none d-sm-inline">` + promptCat[i] + `</span> </a>
        <ul class="collapse nav flex-column ms-1" id="` + promptCat[i] + `">
        </ul>
    </li>`);
        for (let k = 0; k < promptDir[i].length; k++) {
            $('#' + promptCat[i]).append(`<li style="padding-left: 15px">
                    <a href="#" onclick="loadPrompt(` + i + `,` + k + `)" id="p-` + i + `-` + k + `"
                    class="nav-link px-0"> <span class="d-none d-sm-inline" >` + promptDir[i][k] + `</span></a>
                </li>`);
        }
    }
}

function subFile() {

}