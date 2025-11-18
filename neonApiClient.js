/************************************************************
 *  Neon API Client (for Webflow / standard JS frontends)
 *  ---------------------------------------------------------
 *  Funksjoner:
 *   - getNEON(table, fields)
 *   - postNEON(table, data)
 *   - postNEONmulti(table, dataArray)
 *   - patchNEON(table, rowId, fields)
 *   - patchNEONmulti(table, updatesArray)
 *   - delNEON(table, rowId)
 ************************************************************/

const API_BASE = "https://attentiocloud-api.vercel.app";   // ← sett riktig URL

//---------------------------------------------------------
// INTERNAL HELPERS
//---------------------------------------------------------

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1] || null;
}

function getToken() {
  return (
    getCookie("_ms-mid") ||
    localStorage.getItem("_ms-mid") ||
    null
  );
}

/**
 * _ms-mem (JSON) → hente aktive planId
 */
function getPlans() {
  const raw = localStorage.getItem("_ms-mem") || getCookie("_ms-mem");
  if (!raw) return [];

  try {
    const obj = JSON.parse(decodeURIComponent(raw));
    if (!obj.planConnections) return [];

    return obj.planConnections
      .filter((p) => p.status === "active")
      .map((p) => p.planId);
  } catch (e) {
    console.warn("Could not parse _ms-mem:", e);
    return [];
  }
}

/**
 * Standard headers til API
 */
function buildHeaders() {
  const token = getToken();
  if (!token) throw new Error("Missing Memberstack token (_ms-mid)");

  const plans = getPlans();
  if (plans.length === 0) {
    console.warn("⚠ No plans found in _ms-mem");
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "X-MS-Plans": plans.join(","),
  };
}

//---------------------------------------------------------
// MAIN API METHODS
//---------------------------------------------------------

/**
 * GET rows
 * fields = array av felt du vil ha ut
 */
export async function getNEON(table, fields = null) {
  let url = `${API_BASE}/api/${table}`;

  if (fields && fields.length > 0) {
    const list = fields.join(",");
    url += `?fields=${list}`;
  }

  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) throw new Error(`GET failed: ${res.status}`);
  const json = await res.json();
  return json.rows;
}

/**
 * POST: Insert single record
 */
export async function postNEON(table, data) {
  const res = await fetch(`${API_BASE}/api/${table}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify([data]), // backend forventer array
  });

  if (!res.ok) throw new Error(`POST failed: ${res.status}`);
  return res.json();
}

/**
 * POST multiple
 */
export async function postNEONmulti(table, dataArray) {
  const res = await fetch(`${API_BASE}/api/${table}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(dataArray),
  });

  if (!res.ok) throw new Error(`POST multi failed: ${res.status}`);
  return res.json();
}

/**
 * PATCH update one row by ID
 */
export async function patchNEON(table, rowId, fields) {
  const res = await fetch(`${API_BASE}/api/${table}/${rowId}`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(fields),
  });

  if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
  return res.json();
}

/**
 * PATCH multiple rows
 * updatesArray = [{ id: 1, fields: {...}}, { id: 2, fields: {...}}]
 */
export async function patchNEONmulti(table, updatesArray) {
  const res = await fetch(`${API_BASE}/api/${table}`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(updatesArray),
  });

  if (!res.ok) throw new Error(`PATCH multi failed: ${res.status}`);
  return res.json();
}

/**
 * DELETE row
 */
export async function delNEON(table, rowId) {
  const res = await fetch(
    `${API_BASE}/api/${table}?field=id&value=${rowId}`,
    {
      method: "DELETE",
      headers: buildHeaders(),
    }
  );

  if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
  return res.json();
}
