function loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.onload = resolve;
      s.onerror = () => reject("Failed: " + url);
      document.head.appendChild(s);
    });
  }
  
  const cdnScripts = [
    "https://kaibertelsen.github.io/neonclientframe/neonApiClient.umd.js",
    "https://kaibertelsen.github.io/neonclientframe/usefunction.js"
  ];
  
  cdnScripts.reduce((p, url) => p.then(() => loadScript(url)), Promise.resolve())
    .then(() => 
        console.log("⭐ All NEON-framework scripts loaded")
        //kan jeg kjøre en funksjon her etter at alt er lastet?
        
)
    .catch(console.error);
  