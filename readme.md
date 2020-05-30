# JAMK Web dev projekti

## Esittely

Sovellus peli, jossa pahat e-kirjaimet hyökkäävät ja pelaajan on
puolustettava muuria ampumalla nämä. Pelissä saa kuluneen ajan perusteella pisteitä, jotka tallennetaan tietokantaan, mikäli pelaaja on rekisteröitynyt käyttäjä. Rekisteröimättömien pelaajien pisteitä ei tallenetta, mutta he näkevät Top 5 -pelaajat.

## Teknologia

Angularilla toteutettu frontend. Useita eri komponentteja: itse peli, pistelistaus, kirjautuminen, infosivu ja käyttäjäsivu. Käyttäjäsivu on suojattu, sinne pyrkiessään kirjautumaton käyttäjä ohjataan automaattisesti kirjautumis/rekisteröitymissivulle. Sivun tyyleissä on käytetty hieman Bootstrappiä. Sivu on (jossain määrin) vaakasuunnassa responsiivinen, toteutettu flexboxilla. Sivun pitäisi siis toimia myös mobiilisti portrait-moodissa. Sovellus on PWA-kelpoinen ja se voidaan asentaa puhelimen kotinäyttöön tai Chrome-selaimen kautta myös tietokoneen työpöydälle.

Nodejs (express) backend. Vastaa tietojen hausta tietokannasta, mukaanlukien käyttäjien rekisteröiminen ja autentikointi. Autentikoinnissa käytetään JSON Web Tokenia.

MongoDB-tietokanta (hostattu MongoDB Atlaksessa). Tallentaa käyttäjien tiedot (nimi, salasana, pisteet, pelatut pelit), sekä listan korkeimmista pisteistä.

### Ulkopuolinen koodi

Projektissa on käytetty hieman koulutuksen kurssitehtävien koodia. Nämä tunnistaa suomenkielisistä kommenteista, siis vain nämä ovat ulkopuolista (tässä tapauksessa lienee Tuikan) koodia. Nämä koodit koskevat lähinnä autentikaatiota ja löytyvät tiedostoista `verifytoken.js` ja `createtoken.js` projektin juuressa sekä `auth.service.ts` src/app/ -kansiossa.

### Lokaali asennus

Kloonaa repo ja asenna: `npm install` projektihakemistossa.

Ennen suoritusta luo projektin juureen alla olevat muuttujat sisältävän `.env` tiedoston, jossa on oma MongoDB-yhteytesi sekä JWT-tokeniin käytettävä avain. Esimerkiksi

`DB_CONN='mongodb://root:password@localhost:27017/testdb'`\
`SECRET=todellasalainenavain`

Angular projekti buildataan ensin `ng build --prod`, jonka jälkeen voidaan käynnistää serveri `node server.js`.
Terminaalissa pitäisi näkyä mihin porttiin servataan.

## Reflektio

Olen suhteellisen tyytyväinen lopputulokseen. Eniten haasteita tuotti frontendin ja backendin yhdistäminen samaan projektiin, sekä responsiivisuutta tavoitteleva CSS. Aikaa käytin n. kaksi viikkoa, keskimäärin pari tuntia päivässä. Tähän sisältyy myös sittemin hylättyyn prototyyppi-projektiin käytetty aika. Eniten kehittämistarvetta lienee ulkoasun suunnittelussa (CSS), varsinkin kun tavoitellaan responsiivisuutta.
