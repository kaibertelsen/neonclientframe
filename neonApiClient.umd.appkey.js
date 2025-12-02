/* --------------------------------------------
   UMD module for Neon API Client (API + MS)
--------------------------------------------- */

const API_BASE = "https://attentiocloud-api.vercel.app";

/* -------------------------------------------------------
   API-MODUS: Lagra appId + apiKey (frivilligt)
-------------------------------------------------------- */
function setApiCredentials(appId, apiKey) {
  localStorage.setItem("neon_appId", appId);
  localStorage.setItem("neon_apiKey", apiKey);
}

function clearApiCredentials() {
  localStorage.removeItem("neon_appId");
  localStorage.removeItem("neon_apiKey");
}

function getApiCredentials() {
  return {
    appId: localStorage.getItem("neon_appId"),
    apiKey: localStorage.getItem("neon_apiKey"),
  };
}

/* -------------------------------------------------------
   MEMBERSTACK-MODUS (fallback)
-------------------------------------------------------- */
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
    return (obj.planConnections || []).map((p) => p.planId);
  } catch (e) {
    console.warn("Invalid _ms-mem JSON", e);
    return [];
  }
}

/* -------------------------------------------------------
   HOVED-BYGGING AV HEADERS
   PRIORITET:
   1. API-MODUS hvis appId + apiKey finnes
   2. Ellers Memberstack
-------------------------------------------------------- */
function buildHeaders() {
  const { appId, apiKey } = getApiCredentials();

  // --- API MODE ---
  if (appId && apiKey) {
    return {
      "Content-Type": "application/json",
      "X-APP-ID": appId,
      Authorization: `Bearer ${apiKey}`,
    };
  }

  // --- MEMBERSTACK MODE ---
  const token = getToken();
  if (!token) throw new Error("Missing Memberstack token (_ms-mid)");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-MS-Plans": getPlans().join(","),
  };
}

  

/* -------------------------------------------------------
   GET
-------------------------------------------------------- */
function getNEON({
    table,
    fields = null,
    where = null,
    responsId,
    cache = false,
    public: isPublic = false,
    pagination = null
  }) {
    let url = `${API_BASE}/api/${table}`;
    const params = new URLSearchParams();
  
    // Fjern authId / Memberstack junk
    const safeWhere = where;
  
    // fields
    if (fields?.length) params.set("fields", fields.join(","));
  
    // where → kun “rene” kolonner
    if (safeWhere) {
      Object.entries(safeWhere).forEach(([k, v]) => params.set(k, v));
    }
  
    // cache
    if (cache) params.set("cache", "1");
  
    // pagination
    if (pagination) {
      if (pagination.limit != null) params.set("limit", String(pagination.limit));
      if (pagination.offset != null) params.set("offset", String(pagination.offset));
    }
  
    // build URL
    if ([...params].length > 0) url += `?${params.toString()}`;
  
    // headers
    const options = isPublic ? {} : { headers: buildHeaders() };
  
    fetch(url, options)
      .then((res) => res.json())
      .then((json) =>
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
  

/* -------------------------------------------------------
   POST
-------------------------------------------------------- */
async function postNEON({ table, data, responsId, public: isPublic = false }) {
  const url = `${API_BASE}/api/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: isPublic ? {} : buildHeaders(),
    body: JSON.stringify(Array.isArray(data) ? data : [data]),
  });

  if (!res.ok) throw new Error(`POST failed: ${res.status}`);

  const json = await res.json();
  apiresponse(
    {
      inserted: json.inserted,
      insertedCount: json.insertedCount,
      user: json.user,
    },
    responsId
  );
}

/* -------------------------------------------------------
   PATCH
-------------------------------------------------------- */
async function patchNEON({ table, data, responsId, public: isPublic = false }) {
  const url = `${API_BASE}/api/${table}`;

  let payload;
  if (!Array.isArray(data)) {
    if (data.id && data.fields) {
      payload = { id: data.id, data: data.fields };
    } else {
      const { id, ...rest } = data;
      payload = { id, data: rest };
    }
  } else {
    payload = data.map((item) => {
      if (item.fields) return { id: item.id, fields: item.fields };
      const { id, ...rest } = item;
      return { id, fields: rest };
    });
  }

  const res = await fetch(url, {
    method: "PATCH",
    headers: isPublic ? {} : buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);

  const json = await res.json();
  apiresponse(
    {
      rows: json.rows,
      updatedCount: json.updatedCount,
      mode: json.mode,
    },
    responsId
  );
}

/* -------------------------------------------------------
   DELETE
-------------------------------------------------------- */
async function deleteNEON({ table, data, responsId }) {
  const ids = Array.isArray(data) ? data : [data];
  const value = ids.join(",");

  const url = `${API_BASE}/api/${table}?field=id&value=${value}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);

  const json = await res.json();

  apiresponse(
    {
      deleted: json.deleted,
      ids,
    },
    responsId
  );
}
