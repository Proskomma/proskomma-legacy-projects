//golang webassembly startup
const go = new Go();
WebAssembly.instantiateStreaming(fetch("poc_mapverse.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});

var proskommaUtils = require('proskomma-utils');

function startMapVerseTests(vrsFileString) {
    document.getElementById('timingsTableDiv').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'block';
    setTimeout(function(){
        mapVerseTests(vrsFileString);
     }, 0);
}

function mapVerseTests(vrsFileString) {
    var iterations = 20;

    //golang tests
    var goVrsTimeTotal = 0;
    var goForwardSvmTimeTotal = 0;
    var goForwardMapVerseTimeTotal = 0;
    var goReverseVersificationTimeTotal = 0;
    var goReverseSvmTimeTotal = 0;
    var goReverseMapVerseTimeTotal = 0;
    for (i=0; i<iterations; i++) {
        const goVrsStart = Date.now();
        let goForwardMappings = vrs2json(vrsFileString);
        goVrsTimeTotal += (Date.now() - goVrsStart);
    
        const goForwardSvmStart = Date.now();
        let goForwardSvm = succinctifyVerseMappings(goForwardMappings.mappedVerses);
        goForwardSvmTimeTotal += (Date.now() - goForwardSvmStart);

        const goForwardMapVerseStart = Date.now();
        mapVerse(goForwardSvm["GEN"]["31"], "GEN", 31, 55);
        goForwardMapVerseTimeTotal += (Date.now() - goForwardMapVerseStart);

        const goReverseVersificationStart = Date.now();
        let goReverseMappings = reverseVersification(goForwardMappings);
        goReverseVersificationTimeTotal += (Date.now() - goReverseVersificationStart);

        const goReverseSvmStart = Date.now();
        let goReverseSvm = succinctifyVerseMappings(goReverseMappings.reverseMappedVerses);
        goReverseSvmTimeTotal += (Date.now() - goReverseSvmStart);
    
        const goReverseMapVerseStart = Date.now();
        mapVerse(goReverseSvm["GEN"]["32"], "GEN", 32, 1);
        goReverseMapVerseTimeTotal += Date.now() - goReverseMapVerseStart;
    }

    var jsVrsTimeTotal = 0;
    var jsForwardSvmTimeTotal = 0;
    var jsForwardMapVerseTimeTotal = 0;
    var jsReverseVersificationTimeTotal = 0;
    var jsReverseSvmTimeTotal = 0;
    var jsReverseMapVerseTimeTotal = 0;
    for (i=0; i<iterations; i++) {
        const jsVrsStart = Date.now();
        let jsForwardMappings = proskommaUtils.vrs2json(vrsFileString)
        jsVrsTimeTotal += (Date.now() - jsVrsStart);
        
        const jsForwardSvmStart = Date.now();
        let jsForwardSvm = proskommaUtils.succinctifyVerseMappings(jsForwardMappings.mappedVerses);
        jsForwardSvmTimeTotal += (Date.now() - jsForwardSvmStart);
        
        const jsForwardMapVerseStart = Date.now();
        proskommaUtils.mapVerse(jsForwardSvm["GEN"]["31"], "GEN", 31, 55);
        jsForwardMapVerseTimeTotal += (Date.now() - jsForwardMapVerseStart);
    
        const jsReverseVersificationStart = Date.now();
        let jsReverseMappings = proskommaUtils.reverseVersification(jsForwardMappings);
        jsReverseVersificationTimeTotal += (Date.now() - jsReverseVersificationStart);
    
        const jsReverseSvmStart = Date.now();
        let jsReverseSvm = proskommaUtils.succinctifyVerseMappings(jsReverseMappings.reverseMappedVerses);
        jsReverseSvmTimeTotal += (Date.now() - jsReverseSvmStart);

        const jsReverseMapVerseStart = Date.now();
        proskommaUtils.mapVerse(jsReverseSvm["GEN"]["32"], "GEN", 32, 1);
        jsReverseMapVerseTimeTotal += (Date.now() - jsReverseMapVerseStart);
    }
    
    //add all the timings to a table
    let table = createTable(["", "golang webassembly", "javascript"], iterations);
    addRow(table, ["vrs2json", (goVrsTimeTotal / iterations), (jsVrsTimeTotal / iterations)]);
    addRow(table, ["succinctifyVerseMappings (forward)", (goForwardSvmTimeTotal / iterations), (jsForwardSvmTimeTotal / iterations)]);
    addRow(table, ["mapVerse (forward)", (goForwardMapVerseTimeTotal / iterations), (jsForwardMapVerseTimeTotal / iterations)]);
    addRow(table, ["reverseVersification", (goReverseVersificationTimeTotal / iterations), (jsReverseVersificationTimeTotal / iterations)]);
    addRow(table, ["succinctifyVerseMappings (reverse)", (goReverseSvmTimeTotal / iterations), (jsReverseSvmTimeTotal / iterations)]);
    addRow(table, ["mapVerse (reverse)", (goReverseMapVerseTimeTotal / iterations), (jsReverseMapVerseTimeTotal / iterations)]);
    document.getElementById('loadingDiv').style.display = 'none';
    showTable(table, 'timingsTableDiv');
}

function createTable(headerData, iterations) {
    var table = document.createElement("table");
    table.style.border = "1";
    table.style.margin = "0";
    let caption = table.createCaption();
    caption.innerHTML = "Average time in milliseconds over " + iterations + " runs.";    
    var headerRow = table.insertRow(-1);
    for (var i = 0; i < headerData.length; i++) {
        var headerCell = document.createElement("th");
        headerCell.innerHTML = headerData[i];
        headerRow.appendChild(headerCell);
    }
    return table;
}

function addRow(table, data) {
    let row = table.insertRow(-1);
    for (i=0; i<data.length; i++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = data[i];
    }
}

function showTable(table, tableId) {
    let documentTable = document.getElementById(tableId);
    documentTable.innerHTML = "";
    documentTable.appendChild(table);
    document.getElementById(tableId).style.display = 'block';
}
