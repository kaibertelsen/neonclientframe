function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load script: ${url}`);
        document.head.appendChild(script);
    });
}

// Liste over CDN-URL-er som skal lastes inn
const cdnScripts = [

    "https://kaibertelsen.github.io/neonclientframe/neonApiClient.js",
    "https://kaibertelsen.github.io/neonclientframe/usefunction.js"
    
];

// Laste inn alle skriptene sekvensielt
cdnScripts.reduce((promise, script) => {
    return promise.then(() => loadScript(script));
}, Promise.resolve()).then(() => {
    console.log("All scripts loaded");



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


}).catch(error => {
    console.error(error);
});
