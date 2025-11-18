// Testscript for Webflow som tester NEON API-klienten



  console.log("🚀 Webflow testscript startet…");

   // 1️⃣ TEST: GET – hent hele radenèr
    //getNEON("bbrunning",null,"webflow-gettest");

    //For testing med spesifiserte responsfelt
    //getNEON("bbrunning", ["id", "runnnr"]);

    //For testing med where-klausul
    getNEON("bbrunning", ["id", "runnnr"], { id: 1302 });
   // getNEON("bbrunning", ["id", "runnnr"], { runnnr: 777 });



/*
   // 2️⃣ TEST: POST – legg til en eller flere rader
   postNEON("bbrunning", [
     { runnnr: 777, externalId: "webflow-test" },
      { runnnr: 888, externalId: "webflow-test" },
      { runnnr: 999, externalId: "webflow-test" }
   ]);
  */ 
   

   // 3️⃣ TEST: PATCH – oppdater én rad
   /*
   console.log("🟡 Tester PATCH...");
   const updated = await patchNEON("bbrunning", 1, { runnnr: 4444 });
   console.log("PATCH Resultat:", updated);
   */

   // 4️⃣ TEST: DELETE – slett rad
   /*
   console.log("🔴 Tester DELETE...");
   const deleted = await delNEON("bbrunning", 1);
   console.log("DELETE Resultat:", deleted);
   */


  


   