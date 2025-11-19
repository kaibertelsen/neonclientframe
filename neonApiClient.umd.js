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
function getNEON(
  table,
  fields = null,
  where = null,
  responsId,
  useCache = false,
  isPublic = false,
  pagination = null 
) {
  let url = `${API_BASE}/api/${table}`;
  const params = new URLSearchParams();

  if (fields?.length) params.set("fields", fields.join(","));
  if (where) Object.entries(where).forEach(([k, v]) => params.set(k, v));
  if (useCache) params.set("cache", "1");

  // Pagination
  if (pagination && typeof pagination === "object") {
    if (pagination.limit != null) params.set("limit", String(pagination.limit));
    if (pagination.offset != null) params.set("offset", String(pagination.offset));
  }

  if ([...params].length > 0) url += `?${params.toString()}`;

  const options = isPublic ? {} : { headers: buildHeaders() };

  fetch(url, options)
    .then(res => res.json())
    .then(json =>
      apiresponse(
        {
          rows: json.rows,
          cached: json.cached,
          limit: json.limit,
          offset: json.offset,
          count: json.count,
          total: json.total,
          hasMore: json.hasMore,
        },
        responsId
      )
    );
}

  
  
  
  
  

  /* ------------------ POST ------------------ */
  async function postNEON(table, data,responsId) {
    const res = await fetch(`${API_BASE}/api/${table}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(Array.isArray(data) ? data : [data]),
    });

    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    const json = await res.json();
  
    apiresponse(json.inserted,responsId);
  }

  /* ----------------- PATCH ------------------ */
  async function patchNEON(table, idOrList, fields, responsId) {
    let payload;
  
    // --- 1️⃣ Single update ---
    if (typeof idOrList === "number") {
      payload = {
        id: idOrList,
        data: fields
      };
    } 
    
    // --- 2️⃣ Bulk update ---
    else if (Array.isArray(idOrList)) {
      // Format: [{ id, fields }, ...]
      payload = idOrList.map(item => ({
        id: item.id,
        fields: item.fields
      }));
    } 
    
    else {
      throw new Error("Invalid patch arguments");
    }
  
    const res = await fetch(`${API_BASE}/api/${table}`, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
  
    const json = await res.json();
    apiresponse(json.rows, responsId);
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


