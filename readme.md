# JAMK Web dev projekti, serveri

NodeJS + Express RESTapi backend. \
Asennus: `npm install`

Ennen suoritusta luo projektin juureen alla olevat muuttujat sisältävän `.env` tiedoston, jossa on oma mongodb-yhteytesi sekä jwt-tokeniin käytettävä avain. Esimerkiksi

`DB_CONN='mongodb://root:password@localhost:27017/testdb'`\
`SECRET=todellasalainenavain`

Serveri käynnistetään komennolla `npm start`
