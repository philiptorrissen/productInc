// bruker ekspress 
var express = require('express');

// bruker "router" som er en del av express for å knytte urler til funksjoner. Slik at en funksjon
// kalles når brukeren skriver en url 
var router = express.Router();

// Når brukeren kaller /items kjører denne funksjone. 
// Den er "async" fordi vi må lese en fil fra internett
router.get('/', async function(req, res){
   let products = await getProducts();

   // Henter ut sortering, søk og limit fra URLen (?s=apple&sortOrder=1&limit=50)
   let s = req.query.s 
   let limit = req.query.limit
   let sortOrder = req.query.sortOrder

 

   // logger litt da jeg hadde noen feil jeg ikke skjønte
   console.log(s, limit, sortOrder)
   
   // hvis brukeren har skrevet et søkeord, tar vi bare med de som passer.
   let searchInfo 
   if (s){
      // bruker filtermetoden og en hjepefunksjon som sjekker alle attributtene i produktet
      products = products.filter(prod => containsSearchWord(prod, s))
      // oppdaterer en tekst som vises til brukeren slik at de husker hva de har søkt på. 
      searchInfo = "Viser resultater for: " + s
   }

   // Hvis brukeren har oppgitt antall produkter, plukker vi ut riktig antall produkter her
   // Jeg burde ha laget støtte for sider, og det burde blitt løst her også. (delt antall produkter
   // på limit, så finner du antall sider.  
   if (limit){
      products = products.slice(0, limit);
   }

   // Hvis brukern har oppgitt en sorteringsrekkefølge, sorterer vi produktene. Dette gjøres i en 
   // hjelpefunksjon 
   if (sortOrder){
      products = sortProducts(products, sortOrder)
   }

   // når vi har fikset på produktlista (sortert, limit, søk) sender vi den til malen "items" som viser siden
   // med produktene 
   res.render("items", { title: 'Items!',  products: products, searchString: searchInfo})
});

// funksjon som sorterer produkter. Tar in en produktliste og sorteringsrekkefølge fra URL.
// Returnerer sorterte produkter.
function sortProducts(products, sortOrder){
   // Sjekker hvilke sorteringsrekkefølge som er valgt 
   switch(sortOrder){
      // 1 tilvarer pris lav til høy i dropdown på siden 
      case '1':{
         console.log("sortOrder 1");
         // funksjonen sort tar en funksjon som sammenlikner produker som parameter. 
         // For pris, så bestemmes rekkefølgen av differansen mellom prisene. 
         return products.sort((prod1, prod2) => prod1.price - prod2.price)
      }
      // 2 tilvarer pris høy til lav i dropdown på siden 
      case '2': {
         console.log("sortOrder 2");
         // Motsatt rekkefølge av den over (prod2-prod1)
         return products.sort((prod1, prod2) => prod2.price - prod1.price)
      }
      // 1 tilvarer pris lav til høy i dropdown på siden 
      case '3': {
         console.log("sortOrder 3");
         // til å sortere tekster, bruker jeg localeCompare som gir sorteringsrekkefølge 
         // for tekst. Det er en metode på String. 
         return products.sort((prod1, prod2) => prod1.title.localeCompare(prod2.title))
      }
      case '4': {
         console.log("sortOrder 4");
         // som over, men i motsatt rekkefølge
         return products.sort((prod1, prod2) => prod2.title.localeCompare(prod1.title))
      }
   }
}

// Når brukeren spør om et spesielt produkt (items/10 for eksempel) kjører denne funksjonen.
router.get('/:id', async function(req, res){
   // Sjekker om det som kommer etter items i URL er et nummer. 
   if (!isNaN(req.params.id)){

      // Hvis det er et nummer, henter vi alle produktene 
      const products = await getProducts();

      // så finner vi det produktet som har riktig id. 
      let product = products.find(prod => prod.id == req.params.id )

      // bruker item.pug som mal for å vise detaljer for ett produkt
      res.render("item", { title: 'Item!',  product: product})
   }else {
      // hvis det som kommer etter items i urlen ikke er et tall, viser vi feilsiden. 
      // Det finnes ikke andre sider under items
      res.render("error", { title: '404 - Siden Finnes Ikke', message: 'Du har forsøkt å navigere til en side som ikke finnes. (404)'})
   }
});

// hjelpemetode som brukes av søk. Returnerer "true" hvis produktet sin tittel, merke eller beskrivelse 
// inneholder teksten som det søkes på (s)
function containsSearchWord(product, s){
   // lager en tekst som inneholder alt vi ønsker å søke på. 
   let concatString = product.brand + product.title + product.description
   // Sjekker om søketeksten finnes i den sammensatte "produktteksten" over 
   // returnerer "true" hvis det er treff. False hvis ikke 
   return concatString.toLowerCase().includes(s.toLowerCase())
}

// henter produktinformasjon (i en json array) fra dummyjson.com
// Tjenesten lar deg egentlig søke, sette limits osv, men jeg ville helst 
// kode selv og bruker ikke det. Har bare satt opp til maks antall produkter 
async function getProducts(){
   const url = 'https://dummyjson.com/products?skip=0&limit=100'
    
return await fetch(url)
   .then((response) => response.json())
   .then((json) => json.products)
   .catch(function (err) {
      console.log("Unable to fetch -", err);
   });   
}

module.exports = router;