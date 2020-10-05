"use strict";
//@ts-check 
// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 
console.log(data);
//console.dir(data);
let pre = document.getElementById("log");


let joukkue = { 
    "nimi": "Mallijoukkue",
    "jasenet": [
      "Lammi Tohtonen",
      "Matti Meikäläinen"
    ],
    "leimaustapa": [0,2],
    "rastit": [],
    "sarja": null,
    "id": 99999
};

lisaaJoukkue(data, joukkue, "8h");

muutaSarjanNimi(data, "8h", "10h");


tulostaJoukkueet(data);
pre.textContent += "\n";
tulostaRastit(data);


pre.textContent += "\n\n----------\nTaso 3\n----------\n\n";

poistaJoukkue(data, "Vara 1");
poistaJoukkue(data, "Vara 2");
poistaJoukkue(data, "Vapaat");

laskePisteetKaikille(data);


// Muodostaa datan perusteella Map-olion joka on muotoa [Joukkoeen nimi, (sarjaolio)]
// Map järjestetään uudestaan joukkueen nimen perusteella aakkosjärjestykseen, ja järjestetty Map iteroidaan tulostettavaksi "log" tunnisteella löydettävään
// tekstikenttään, joka tulostetaan selaimeen pohjatiedostossa
function tulostaJoukkueet(data) {
    let joukkueet = new Map();

    //Iteroidaan datasta kaikki joukkueiksi nimetyt oliot, ja lisätään ne Mappiin parituksella [nimi, (sarjaolio)]
    //joukkuiden nimet trimmataan ja muutetaan lowercaseen seuraavaa aakkosjärjestämisetä varten
    for (let i in data.joukkueet) {
        joukkueet.set(data.joukkueet[i].nimi.trim().toLowerCase(), data.joukkueet[i].sarja);
    }

    //Luodaan uusi Map edellisen pohjalta, tällä kertaa nimen mukaisesti aakkosjärjestyksessä
    let tulostettavat = new Map([...joukkueet.entries()].sort());

    //console.log(tulostettavat);

    //Haetaan muokattava tekstikenttä IDn mukaan
    let pre = document.getElementById("log");
    //Iteroidaan tulostettava Map ja lisätään jokainen avainpari tekstikenttään
    for (let [key, value] of tulostettavat) {
        pre.textContent += (key.charAt(0).toUpperCase() + key.slice(1) + ' ' + value.nimi);
        pre.textContent += "\n";
    }
}

//Lisää parametrina tuodun joukkueen tietorakenteeseen ja liittää siihen annetun sarjan. Ei tee mitään ellei sarjaa löydy nimen perusteella tietorakenteesta
function lisaaJoukkue(data, joukkue, sarja) {
    //Käydään läpi kaikki datan sarjat nimen perusteella. Jos parametrina tuotu sarjan nimi löytyy, asetetaan joukkueen sarjaksi löydetty sarja
    for (let i in data.sarjat) {
        if (data.sarjat[i].nimi == sarja) {joukkue.sarja = data.sarjat[i]; break;}
    }
    //Jos sarjaa ei löydetty, lopetetaan
    if (joukkue.sarja == null) {return;}

    //Lisätään joukkue tietorakenteeseen joukkueiden alle
    data.joukkueet[data.joukkueet.length] = joukkue;
}

//Muuttaa sarjan nimen
function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    for (let i in data.sarjat) {
        if (data.sarjat[i].nimi == vanhanimi) {
            data.sarjat[i].nimi = uusinimi;
            return;
        }
    }
}
//Tulostaa kaikki kokonaisluvulla alkavat rastit tietorakenteesta aakkosjärjestyksessä
function tulostaRastit(data) {
    let rastiKoodit = [];
    //Taulukkoon lisätään kaikki rastit joiden koodin ensimmäinen merkki on kirjain
    for (let i in data.rastit) {
        if (isNaN(data.rastit[i].koodi.charAt(0)) == false) {
            rastiKoodit.push(data.rastit[i].koodi);
        }
    }
    //Järjestys aakkosjärjestykseen ja tulostus
    rastiKoodit.sort();
    let pre = document.getElementById("log");
    for (let i in rastiKoodit) {
        pre.textContent += rastiKoodit[i];
        pre.textContent += ';';
    }
}

//Poistaa annetun joukkueen rakenteesta nimen perusteella
function poistaJoukkue(data, joukkue) {
    let index = -1;
    //Etsitään rakenne läpi nimen perusteella, ja jos samanniminen joukkue löytyy, merkitään sen taulukkoindeksi
    for (let i in data.joukkueet) {
        if (data.joukkueet[i].nimi == joukkue) {index = i; break;}
    }
    //Poistetaan taulukkoindeksin mukaan rakenteesta yksi joukkue
    if (index > -1) { data.joukkueet.splice(index, 1);}
}

//Laskee kaikkien joukkueiden pisteet ja tulostaa ne pistejärjestyksessä
function laskePisteetKaikille(data) {
    let joukkueetPisteet = new Map();
    //Haetaan lähtö- ja maalirastin ID nyt, ettei niitä tarvitse hakea loopin sisällä koko ajan
    var lahdonID;
    var maalinID;
    for (let i in data.rastit) {
        if (data.rastit[i].koodi == "LAHTO") {lahdonID = data.rastit[i].id;};
        if (data.rastit[i].koodi == "MAALI") {maalinID = data.rastit[i].id;};
    }
    //Käydään läpi kaikki joukkueet, asetetaan nimi ja saadut pisteet avain-arvopareina Mappiin. funktio laskePisteetYhdelle palauttaa aina yhden joukkueen pisteet
    for (let i in data.joukkueet) {
        
        joukkueetPisteet.set(data.joukkueet[i].nimi.trim().toLowerCase(), laskePisteetYhdelle(data.joukkueet[i], data.rastit, lahdonID, maalinID));

    }
    //Järjestetään mappi pistejärjestykseen
    let tulostettavat = new Map([...joukkueetPisteet.entries()].sort((a, b) => b[1] - a[1]));
    //Tulostus
    for (let [key, value] of tulostettavat) {
        pre.textContent += (key.charAt(0).toUpperCase() + key.slice(1) + " (" + value + " p)");
        pre.textContent += "\n";
    }
}

//Laskee ja palauttaa yhden joukkueen saamat pisteet
function laskePisteetYhdelle(joukkue, rastit, lahdonID, maalinID) {
    //Ensin käydään joukkueen rastit läpi ja karsitaan turhat rastit pois yhtälöstä
    //Turha tässä kontekstissa tarkoittaa kaikkia rasteja joiden ID arvo on 0, kaikki rastit ennen viimeisintä "LÄHTÖ" rastia, ja kaikki rastit viimeisintä "LÄHTÖ"ä seuraavan "MAALI"n jälkeen
    let relevantitRastit = [];
    //Etsitään joukkueen viimeisimmän lähdön indeksi. Onneksi tietorakenne on järjestetty ajan mukaan
    let lahtoIndeksi = -1;
    for (let i in joukkue.rastit) {
        if (joukkue.rastit[i].rasti == lahdonID) {lahtoIndeksi = i;}
    }
    if (lahtoIndeksi < 0) {return 0;}

    //Käydään läpi rastit järjestyksessä alkaen viimeisesta "LÄHTÖ" rastista siihen asti, kunnes tulee "MAALI," lisätään kaikki rastit relevantitRastit taulukkoon
    for (let i = lahtoIndeksi; i < joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti != "0") {relevantitRastit.push(joukkue.rastit[i].rasti);};
        if (joukkue.rastit[i].rasti == maalinID) {break;};
    }
    //Poistetaan relevanteista rasteista useasti merkityt rastit ettei niitä pisteytetä useammin
    let laskettavat = new Set(relevantitRastit);
    //console.log(joukkue.nimi)
    //console.log(laskettavat)
    //Iteroidaan valmiin laskettavien rastien listan läpi ja etsitään jokaiselle rastille mahdollinen vastaavuus oikeasta rastilistasta, lasketaan pisteet yhteen
    let summa = 0;
    for (let item of laskettavat) {
        for (let j in rastit) {
            if (rastit[j].id == item) {
                if (isNaN(rastit[j].koodi.charAt(0)) == false) {summa += Number(rastit[j].koodi.charAt(0));}
            }
        }
    }
    return summa;
}