# work-logger-qr-web-app

### Podjetje **ANFI d.o.o.**

Spletna aplikacija namenjena podjetju ANFI d.o.o., ki omogoča upravljanje s uporabniki. V spletno aplikacijo se lahko prijavita dva tipa uporabnikov:
- skrbnik, ki ima dostop do segmenta upravljanja s uporabniki in 
- poseben uporabnik, kateri ima omogočen dostop samo do podstrani na spletnem naslovu ```/qr```, ki generira in prikazuje novo generirano QR kodo glede na časovni interval. 

Ta spletna aplikacija komunicira z API-jem (dostopen na GitHub repozitoriju: https://github.com/akatarov007/work-logger-api.git, branch *anfi*), s katerim prav tako komunicira tudi mobilna aplikacija za beleženje delovnega časa.

S pomočjo QR kode uporabniki mobilne aplikacije za beleženje delovnega časa (dostopna na GitHub repozitoriju: https://github.com/akatarov007/work-logger-mob-app.git, branch *anfi*) le-to skenirajo za beleženje začetka ali konca delovne izmene.