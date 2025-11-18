// UMD module for Neon API Client

  const API_BASE = "https://attentiocloud-api.vercel.app";

  function getToken() {
    return (
      localStorage.getItem("_ms-mid") ||
      document.cookie
        .split("; ")
        .find((r) => r.startsWith("_ms-mid="))
        ?.split("=")[1] ||
      null
    );
  }

  function getPlans() {
    const raw = localStorage.getItem("_ms-mem");
    if (!raw) return [];
    try {
      const obj = JSON.parse(raw);
      return (obj.planConnections || []).map(p => p.planId);
    } catch (e) {
      console.warn("Invalid _ms-mem JSON", e);
      return [];
    }
  }

  function buildHeaders() {
    const token = getToken();
    if (!token) throw new Error("Missing Memberstack token (_ms-mid)");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-MS-Plans": getPlans().join(","),
    };
  }

  /* ------------------ GET ------------------ */
  async function getNEON(table, fields = null,responsId) {
    let url = `${API_BASE}/api/${table}`;

    if (fields && fields.length > 0) {
      url += `?fields=${fields.join(",")}`;
    }

    const res = await fetch(url, { headers: buildHeaders() });
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);

    const json = await res.json();
    
    apiresponse(json.rows,responsId); // Call apiresponse with the fetched data and responsId
  }

  /* ------------------ POST ------------------ */
  async function postNEON(table, data,responsId) {
    const res = await fetch(`${API_BASE}/api/${table}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(Array.isArray(data) ? data : [data]),
    });

    if (!res.ok) throw new Error(`POST failed: ${res.status}`);

  
    apiresponse(res.json(),responsId);
  }

  /* ----------------- PATCH ------------------ */
  async function patchNEON(table, rowId, fields,responsId) {
    const res = await fetch(`${API_BASE}/api/${table}?id=${rowId}`, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(fields),
    });

    if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);

   
    apiresponse(res.json(),responsId);
  }

  /* ----------------- DELETE ----------------- */
  async function delNEON(table, rowId,responsId) {
    const res = await fetch(
      `${API_BASE}/api/${table}?field=id&value=${rowId}`,
      {
        method: "DELETE",
        headers: buildHeaders(),
      }
    );

    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);

    apiresponse(res.json(),responsId);
  }


