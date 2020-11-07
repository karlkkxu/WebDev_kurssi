"use strict";
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */


$(document).ready(function() {
    console.log(data);
    luoKartta();
    var joukkueet = data.joukkueet.sort(function(a, b) {
        if (a.nimi.toLowerCase() < b.nimi.toLowerCase()) {return -1;}
        return 1;
    });
    lisaaJoukkueet(joukkueet);
    lisaaRastit();
    setDrags();
});

function luoKartta() {
    let div = $("#map");
	div.css("width", "100%");
	div.css("height", "50%");
    let myMap = new L.map('map', {
        crs: L.TileLayer.MML.get3067Proj()
       }).setView([62.2333, 25.7333], 11);
    L.tileLayer.mml_wmts({ layer: "maastokartta" }).addTo(myMap);
    
    drawRastit(myMap);
}

function drawRastit(kartta) {
    let bounds = [];
    $.each(data.rastit, function(i, rasti) {
        bounds.push(L.latLng(rasti.lat, rasti.lon));
        let circle = L.circle(
            [rasti.lat, rasti.lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 100
            }
            ).addTo(kartta);
    });
    kartta.fitBounds(L.latLngBounds(bounds));
}

function lisaaJoukkueet(joukkueet) {
    let ul = document.getElementById("joukkueet");
    for (let i in joukkueet) {
        let lisa = document.createElement('div');
        lisa.setAttribute("draggable", "true");
        lisa.setAttribute("id", 'j'+i);
        lisa.addEventListener("dragstart", dragStart);
        lisa.style.backgroundColor = ''+ rainbow(joukkueet.length, i);
        lisa.style.color = 'black';
        lisa.textContent += joukkueet[i].nimi;
        ul.appendChild(lisa);
    }
}

function dragStart(e) {
    
    e.dataTransfer.setData("text/plain", this.getAttribute("id"));
    e.dataTransfer.effectAllowed = "all";
    //console.log(this.getAttribute("id"));
    
}

function lisaaRastit() {
    let rastit = data.rastit.sort(function(a, b) {
        if (a.koodi < b.koodi) {return 1;}
        return -1;
    });

    let ul = document.getElementById("rastit");
    for (let i in rastit) {
        let lisa = document.createElement('div');
        lisa.setAttribute("draggable", "true");
        lisa.setAttribute("id", 'r'+i);
        lisa.addEventListener("dragstart", dragStart);
        lisa.style.color = 'black';
        lisa.style.backgroundColor = ''+ rainbow(rastit.length, i);
        lisa.textContent += rastit[i].koodi;
        ul.appendChild(lisa);
    }
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

function setDrags() {

    let karttaBox = document.getElementById("kartalla");
    karttaBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });
    karttaBox.addEventListener('drop', function(e) {
        e.preventDefault();
        e.target.appendChild(document.getElementById(e.dataTransfer.getData("text")));
    });
}