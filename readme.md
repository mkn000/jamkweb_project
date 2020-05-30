# JAMK Web dev projekti

Angular frontend, nodejs (express) backend, mongodb-tietokanta (hostattu mongodb-atlaksessa).
Asennus: `npm install`

Ennen suoritusta luo projektin juureen alla olevat muuttujat sisältävän `.env` tiedoston, jossa on oma mongodb-yhteytesi sekä jwt-tokeniin käytettävä avain. Esimerkiksi

`DB_CONN='mongodb://root:password@localhost:27017/testdb'`\
`SECRET=todellasalainenavain`

Angular projekti buildataan ensin `ng build --prod`, jonka jälkeen voidaan käynnistää serveri `node server.js`.
Terminaalissa pitäisi näkyä mihin porttiin servataan.
