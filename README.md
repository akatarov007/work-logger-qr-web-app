# work-logger-qr-web-app

### Podjetje **RESORT KNEZ d.o.o.**

Spletna aplikacija namenjena podjetju RESORT KNEZ d.o.o., ki omogoča upravljanje s uporabniki. V spletno aplikacijo se lahko prijavita dva tipa uporabnikov:
- skrbnik, ki ima dostop do segmenta upravljanja s uporabniki in 
- poseben uporabnik, kateri ima omogočen dostop samo do podstrani na spletnem naslovu ```/qr```, ki generira in prikazuje novo generirano QR kodo glede na časovni interval. 

Ta spletna aplikacija komunicira z RESORT KNEZ API-jem (dostopen na prod url: https://api.resort-knez.si/), s katerim prav tako komunicira tudi mobilna aplikacija za beleženje delovnega časa kot tudi VAV8 mobilna aplikacija za RESORT KNEZ.

S pomočjo QR kode uporabniki mobilne aplikacije za beleženje delovnega časa le-to skenirajo za beleženje začetka ali konca delovne izmene.