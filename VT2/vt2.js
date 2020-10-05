"use strict";
//@ts-check 
// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//


//Tulee ongelmia latausjärjestyksen kanssa ellei odota ikkunan latautumista
//"PÄÄOHJELMA"
window.onload = function() {
    //console.log(data);

    //Lisätään joukkueet datasta tulostaulukkoon
    tulostaJoukkueet(data);

    //muokkaaForm lisää sivulle kaikki vaadittavat tietokentät samalla kun palauttaa "lisää rasti" painikkeen
    var nappi = muokkaaForm();
    nappi.addEventListener("click", lisays);
};

//---------------------------------------------------------------
//Funktiot

//Muokkaa sivulla olevaa tulostaulukkoa ja tulostaa siihen järjestetyn listan joukkueista sarjoittain
function tulostaJoukkueet(data) {

    //Luodaan lista jota lähdetään tulostamaan
    let jarjestettyLista = jarjestaJoukkueet(data);

    //Haetaan muokattava elementti
    let table = document.getElementById("tupa").getElementsByTagName('table')[0];

    //Poistaa "Pisteet" sarakkeen taulukosta, ei tarvita kun 1 pisteen palautus
    table.getElementsByTagName('tr')[0].removeChild(table.getElementsByTagName('tr')[0].getElementsByTagName('th')[2]);

    //Iteroidaan lista läpi ja luodaan jokaiselle joukkueelle elementti, tallennetaan tiedot lapsittain, ja lisätään taulukkoon
    for (let i in jarjestettyLista) {
        let tr = document.createElement('tr');

        let tdNimi  = document.createElement('td');
        let tdSarja = document.createElement('td');

        let nimiSisalto  = document.createTextNode(jarjestettyLista[i].joukkue.nimi);
        let sarjaSisalto = document.createTextNode(jarjestettyLista[i].sarja);

        tdNimi .appendChild(nimiSisalto);
        tdSarja.appendChild(sarjaSisalto);
        tr.appendChild(tdSarja);
        tr.appendChild(tdNimi);
        table.appendChild(tr);
    }
    //console.log(table);
}

//Perus järjestysfunktio, palauttaa järjestetyn listan
//Järjestysperusteena ensisijaisesti sarja, toissijaisesti aakkoset
function jarjestaJoukkueet(data) {
    let lista = [];
    for (let i in data.joukkueet) {
        let sarjaByID;
        for (let j in data.sarjat) {
            if (data.joukkueet[i].sarja == data.sarjat[j].id) {sarjaByID = data.sarjat[j].nimi; break;}
        }
        lista.push({"joukkue":data.joukkueet[i], "sarja":sarjaByID});
    }

    return lista.sort(function(a,b) {
        if (a.sarja < b.sarja) {return -1;}
        if (a.sarja > b.sarja) {return  1;}

        if(a.joukkue.nimi.toLowerCase().trim() < b.joukkue.nimi.toLowerCase().trim()) {return -1;}
        return 1;
    });
}

//Rakentaa rastinlisäysformin uudestaan haluttuun muotoon
function muokkaaForm() {

    //Haetaan muokattava elementti
    let muokattava = document.getElementById("rastilomake").getElementsByTagName("fieldset")[0];

    //Tuhotaan sen lapset. Kaikki niistä. Ne ovat oikeasti tiellä, väitti lehtori mitä tahansa
    while (muokattava.firstChild) {
        muokattava.removeChild(muokattava.firstChild);
    }

    //Luodaan legend-kenttä elementille ja liitetään se lapseksi
    let legend = document.createElement('legend');
    legend.appendChild(document.createTextNode("Rastin Tiedot"));
    muokattava.appendChild(legend);

    //Luodaan kaikki halutut 'p' kentät elementtiin, nimetään ne taulukon mukaan ja liitetään elementtiin järjestyksessä
    let lisattavat = ["Lat", "Lon", "Koodi"];
    //Looppi lisää lisattavat(-^) taulukon alkioiden mukaisen määrän 'p' elementtejä 
    for (let i in lisattavat) {
        let p = document.createElement('p');
        let label = document.createElement('label');
        label.appendChild(document.createTextNode(lisattavat[i]));
        let input = document.createElement('input'); input.type = "text"; input.value = "";
        //Oma lisäys; jokaiselle riville oma ID
        input.id = ("TekstiKentta" + i);

        label.appendChild(input);
        p.appendChild(label);
        muokattava.appendChild(p);
    }

    //Luodaan loppuun "lisää rasti" nappi
    let p = document.createElement('p');
    var nappi = document.createElement('button');
    nappi.name = "rasti"; nappi.id = "rasti";
    nappi.appendChild(document.createTextNode("Lisää rasti"));

    p.appendChild(nappi); muokattava.appendChild(p);

    //Palautetaan nappi, sen eventhandler luodaan pääohjelmassa
    return nappi;

}

//Eventhandler "lisää rasti" napille. Lisää tekstikenttien mukaisen rastin data-tietorakenteeseen ja tulostaa konsoliin kaikki rastit. Ei tee mitään jos yksikään tekstikenttä on tyhjä
function lisays(e) {
    e.preventDefault();
    let tekstiKentat = [];
    //Haetaan kaikki rastinlisäyslomakkeessa olevat tekstikentät IDn mukaan
    for (let j = 0; j < 3; j++) {
        tekstiKentat.push(document.getElementById("TekstiKentta"+j));
    }
    //Katsotaan ettei mikään kenttä ole tyhjä
    if (tarkistaKentat(tekstiKentat) == false) {return;}
    //console.log("Tarkistettu");
    lisaaRasti(tekstiKentat);
    tulostaRastit();
}

//Iteroi saamansa taulukon tekstikentistä, jos mikään ei ole tyhjä palauttaa true
function tarkistaKentat(tekstiKentat) {
    for (let i in tekstiKentat) {
        if (tekstiKentat[i].value == "") {return false;}
    }
    return true;
}

//Lisää tekstikenttien sisällön mukaisen rastin data-rakenteeseen
function lisaaRasti(tekstiKentat) {
    let uusiRasti = {};
    //Jos tekisin pitkäkestoisempaa ohjelmaa, laittaisin tähänkin kohtaan varmistuksen siitä missä järjestyksessä tekstikenttien dataa tallennetaan
    //Nyt on mahdollisuus että jos ohjelman kehittämistä jatkaisi, jossain vaiheessa tekstiKentät-taulukko ei enää olisi tässä järjestyksessä, ja tämä menisi rikki
    uusiRasti.lon = tekstiKentat[1].value;
    uusiRasti.koodi = tekstiKentat[2].value;
    uusiRasti.lat = tekstiKentat[0].value;
    uusiRasti.id = etsiID();

    data.rastit.push(uusiRasti);
}

//Palauttaa data-rakenteesta etsityn suurimman rastin id-arvon +1
function etsiID() {
    let suurinID = 0;
    for (let i in data.rastit) {
        if (data.rastit[i].id > suurinID) {suurinID = data.rastit[i].id;}
    }
    suurinID++;
    return suurinID;
}

//Järjestää kaikki datan rastit koodin mukaan aakkosjärjestyksessä konsoliin
function tulostaRastit() {
    let jarjestetyt = [];
    for (let i in data.rastit) {jarjestetyt.push(data.rastit[i]);}
    jarjestetyt.sort(function(a,b) {
        if (a.koodi < b.koodi) {return -1;}
        else {return 1;}
    });
    console.log("Rasti  Lat  Lon");
    for (let i in jarjestetyt) {
        console.log(jarjestetyt[i].koodi + " " + jarjestetyt[i].lat + "  " + jarjestetyt[i].lon);
    }
    console.log(data);
}