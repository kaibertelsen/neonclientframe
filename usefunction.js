document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Webflow testscript startet…");
  
    try {
      // 1️⃣ TEST: GET – hent rader
      console.log("🔵 Tester GET...");
      const rows = await getNEON("bbrunning", ["id", "runnnr"]);
      console.log("GET Resultat:", rows);
  
      // 2️⃣ TEST: POST – legg til en rad
      /*
      console.log("🟢 Tester POST...");
      const newRows = await postNEON("bbrunning", [
        { runnnr: 777, externalId: "webflow-test" }
      ]);
      console.log("POST Resultat:", newRows);
      */
  
      // 3️⃣ TEST: PATCH – oppdater én rad
      /*
      console.log("🟡 Tester PATCH...");
      const updated = await patchNEON("bbrunning", 1, { runnnr: 4444 });
      console.log("PATCH Resultat:", updated);
      */
  
      // 4️⃣ TEST: DELETE – slett rad etter ID
      /*
      console.log("🔴 Tester DELETE...");
      const deleted = await delNEON("bbrunning", 1);
      console.log("DELETE Resultat:", deleted);
      */
  
    } catch (err) {
      console.error("❌ FEIL I TESTSCRIPT:", err);
    }
  });