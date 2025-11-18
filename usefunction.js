// Testscript for Webflow som tester NEON API-klienten



  console.log("🚀 Webflow testscript startet…");

   //GET
   //getNEON("tabelnavn", ["sesponsfeltnavn1", "sesponsfeltnavn2"], { feltnavn: inholderverdi }, "responsid");
 
   //hente alle felt i tabellen
    //getNEON("bbrunning",null, null, "test0", true); // cached
    // hente alle felt i tabellen, public tabell
    getNEON("bbrunning", null, null, "resp1", false, true);

  /*
    //Hente alle rader men kun spesifiserte felt i hver rad
    getNEON("bbrunning", ["id", "runnnr"], null, "test1");

    //Hente spesifikke rader basert på betingelse verdi i filter
    //getNEON("bbrunning", ["id", "runnnr"], { id: 1302 }, "test2");
     getNEON("bbrunning", ["id", "runnnr"], { runnnr: 777 });


      getNEON("bbrunning", ["id"], null, responsId, true);   // cached
      getNEON("bbrunning", ["id"], null, responsId, false);  // live
  */



   // 2️⃣ TEST: POST – legg til en eller flere rader
   /*
   postNEON("bbrunning", [
     { runnnr: 777, externalId: "webflow-test" },
      { runnnr: 888, externalId: "webflow-test" },
      { runnnr: 999, externalId: "webflow-test" }
   ]);
  */
   

   // 3️⃣ TEST: PATCH – oppdater én rad
   //patchNEON("tabellnavn", radid, { feltnavn: verdi });
   //patchNEON("bbrunning", 1, { runnnr: 88888 });
/*
   patchNEON("bbrunning", [
    { id: 1309, fields: { runnnr: 100 } },
    { id: 1310, fields: { externalId: "UPDATED" } }
  ]);
  */

   // 4️⃣ TEST: DELETE – slett rad
   /*
   console.log("🔴 Tester DELETE...");
   const deleted = await delNEON("bbrunning", 1);
   console.log("DELETE Resultat:", deleted);
   */


  


   