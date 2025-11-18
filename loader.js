
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
        "https://kaibertelsen.github.io/neonclientframe/neonApiClient.umd.js",
        "https://kaibertelsen.github.io/neonclientframe/usefunction.js"
        
    ];
    
    // Laste inn alle skriptene sekvensielt
    cdnScripts.reduce((promise, script) => {
        return promise.then(() => loadScript(script));
    }, Promise.resolve()).then(() => {
        console.log("All scripts loaded");
        document.addEventListener("DOMContentLoaded", async () => { 
            console.log("🚀 Webflow testscript startet…");
          
             // 1️⃣ TEST: GET – hent rader
             console.log("🔵 Tester GET...");
             const rows = await getNEON("bbrunning", ["id", "runnnr"]);
             console.log("GET Resultat:", rows);}
            );
            
    }).catch(error => {
        console.error(error);
    });
    
    