"use strict";
//@ts-check 
// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 
console.log(data);
//console.dir(data);

var joukkue = { 
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
tulostaRastit(data);

// huomaa, että joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

// Muodostaa datan perusteella Map-olion joka on muotoa [Joukkoeen nimi, (sarjaolio)]
// Map järjestetään uudestaan joukkueen nimen perusteella aakkosjärjestykseen, ja järjestetty Map iteroidaan tulostettavaksi "log" tunnisteella löydettävään
// tekstikenttään, joka tulostetaan selaimeen pohjatiedostossa
function tulostaJoukkueet(data) {
    var joukkueet = new Map();

    //Iteroidaan datasta kaikki joukkueiksi nimetyt oliot, ja lisätään ne Mappiin parituksella [nimi, (sarjaolio)]
    //joukkuiden nimet trimmataan ja muutetaan lowercaseen seuraavaa aakkosjärjestämisetä varten
    for (let i in data.joukkueet) {
        joukkueet.set(data.joukkueet[i].nimi.trim().toLowerCase(), data.joukkueet[i].sarja);
    }

    //Luodaan uusi Map edellisen pohjalta, tällä kertaa nimen mukaisesti aakkosjärjestyksessä
    var tulostettavat = new Map([...joukkueet.entries()].sort());

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

//TODO
function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    for (let i in data.sarjat) {
        if (data.sarjat[i].nimi == vanhanimi) {
            data.sarjat[i].nimi = uusinimi;
            return;
        }
    }
}

function tulostaRastit(data) {
    var rastiKoodit = [];
    for (let i in data.rastit) {
        if (isNaN(data.rastit[i].koodi.charAt(0)) == false) {
            rastiKoodit.push(data.rastit[i].koodi);
        }
    }
    rastiKoodit.sort();
    let pre = document.getElementById("log");
    pre.textContent += "\n";
    for (let i in rastiKoodit) {
        pre.textContent += rastiKoodit[i];
        pre.textContent += ';';
    }
}
