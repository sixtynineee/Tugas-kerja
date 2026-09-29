/* ============================================================
   PARSER BIODATA A4 — FASE 1 (Revisi 10)
   - Nomor input VALID: 1-28 (Kata-Kata & Pesan DIABAIKAN)
   - Field "No. HP" di posisi tampilan #4
   - Foto dikembalikan + tombol Galeri & Kamera terpisah
   - Auto-kapital huruf pertama setiap jawaban
   - Auto-fix ejaan Human Need, urutan tetap
   ============================================================ */

// ==== 1. DEFINISI FIELD TAMPILAN (28 item) ====
const FIELDS = [
  { no: 1,  label: "Nama",                                                    key: "nama",                type: "text" },
  { no: 2,  label: "Nama Panggilan",                                          key: "namaPanggilan",       type: "text" },
  { no: 3,  label: "Tempat, Tanggal Lahir",                                   key: "ttl",                 type: "text" },
  { no: 4,  label: "No. HP",                                                  key: "noHP",                type: "text" },
  { no: 5,  label: "Jumlah Saudara",                                          key: "jumlahSaudara",       type: "text" },
  { no: 6,  label: "Anak ke",                                                 key: "anakKe",              type: "text" },
  { no: 7,  label: "Status",                                                  key: "status",              type: "text" },
  { no: 8,  label: "Nama Pasangan (nikah)",                                   key: "namaPasangan",        type: "text" },
  { no: 9,  label: "Nama Anak",                                               key: "namaAnak",            type: "text" },
  { no: 10, label: "Jumlah Anak",                                             key: "jumlahAnak",          type: "text" },
  { no: 11, label: "Divisi",                                                  key: "divisi",              type: "text" },
  { no: 12, label: "Tanggal Masuk Kerja",                                     key: "tanggalMasuk",        type: "text" },
  { no: 13, label: "Hobi",                                                    key: "hobi",                type: "textarea" },
  { no: 14, label: "Makanan Kesukaan",                                        key: "makananSuka",         type: "textarea" },
  { no: 15, label: "Makanan Tidak Disukai",                                   key: "makananTidakSuka",    type: "textarea" },
  { no: 16, label: "Hal yang Disukai",                                        key: "halSuka",             type: "textarea" },
  { no: 17, label: "Hal yang Tidak Disukai",                                  key: "halTidakSuka",        type: "textarea" },
  { no: 18, label: "Ukuran Baju & LD",                                        key: "ukuranBaju",          type: "text" },
  { no: 19, label: "Ukuran Sepatu & inshole",                                 key: "ukuranSepatu",        type: "text" },
  { no: 20, label: "Zodiak",                                                  key: "zodiak",              type: "text" },
  { no: 21, label: "Warna Kesukaan",                                          key: "warnaSuka",           type: "text" },
  { no: 22, label: "Impian Terbesar",                                         key: "impian",              type: "textarea" },
  { no: 23, label: "Love Language",                                           key: "loveLanguage",        type: "text" },
  { no: 24, label: "Reptil",                                                  key: "reptil",              type: "text" },
  { no: 25, label: "Human Need",                                              key: "humanNeed",           type: "textarea" },
  { no: 26, label: "Golongan Darah",                                          key: "golDarah",            type: "text" },
  { no: 27, label: "Hal apa saja yang membuatmu semangat dalam hidup?",       key: "semangatHidup",       type: "textarea" },
  { no: 28, label: "Hal apa saja yang membuatmu kehilangan semangat dalam hidup?", key: "kehilanganSemangat", type: "textarea" }
];

// ==== 2. MAPPING NOMOR INPUT (1-29) → KEY ====
// Nomor 1-28 MASUK. Nomor 29 (Pesan) DIABAIKAN.
// Nomor 4 input (Jumlah Saudara) tetap, karena No. HP diambil dari baris bawah.
const INPUT_NUMBER_MAP = {
  1:  "nama",
  2:  "namaPanggilan",
  3:  "ttl",
  4:  "jumlahSaudara",
  5:  "anakKe",
  6:  "status",
  7:  "namaPasangan",
  8:  "namaAnak",
  9:  "jumlahAnak",
  10: "divisi",
  11: "tanggalMasuk",
  12: "hobi",
  13: "makananSuka",
  14: "makananTidakSuka",
  15: "halSuka",
  16: "halTidakSuka",
  17: "ukuranBaju",
  18: "ukuranSepatu",
  19: "zodiak",
  20: "warnaSuka",
  21: "impian",
  22: "loveLanguage",
  23: "reptil",
  24: "humanNeed",
  25: "golDarah",
  26: "semangatHidup",
  27: "kehilanganSemangat"
  // Nomor 28 (dulu = Kata-Kata) DIABAIKAN
  // Nomor 29 (dulu = Pesan) DIABAIKAN
};

// ==== 3. STATE ====
const state = {
  raw: "",
  data: {},
  photo: null
};

const DRAFT_KEY = "biodata_draft_v4";

// ==== 4. INIT ====
document.addEventListener("DOMContentLoaded", () => {
  renderForm();
  bindEvents();
  loadDraft();
});

function bindEvents() {
  document.getElementById("btnParse").addEventListener("click", handleParse);
  document.getElementById("btnClear").addEventListener("click", handleClear);

  // Foto — 2 sumber
  document.getElementById("btnPickGallery").addEventListener("click", () => {
    document.getElementById("photoGallery").click();
  });
  document.getElementById("btnPickCamera").addEventListener("click", () => {
    document.getElementById("photoCamera").click();
  });
  document.getElementById("photoGallery").addEventListener("change", handlePhoto);
  document.getElementById("photoCamera").addEventListener("change", handlePhoto);
  document.getElementById("btnRemovePhoto").addEventListener("click", handleRemovePhoto);

  document.getElementById("btnPreview").addEventListener("click", showPreview);
  document.getElementById("btnPrint").addEventListener("click", () => window.print());
  document.getElementById("btnBackToEdit").addEventListener("click", showAdd);
  document.getElementById("btnBack").addEventListener("click", showAdd);
  document.getElementById("btnList").addEventListener("click", showList);
}

/* ============================================================
   NORMALIZER UMUM
   ============================================================ */
function capitalizeFirst(str) {
  if (!str) return str;
  const trimmed = str.replace(/^\s+/, "");
  if (!trimmed) return trimmed;
  const first = trimmed.charAt(0);
  if (/[a-zA-Z]/.test(first)) {
    return first.toUpperCase() + trimmed.slice(1);
  }
  return trimmed;
}

const HUMAN_NEED_MAP = {
  "growh": "Growth",
  "growth": "Growth",
  "certainty": "Certainty",
  "certain": "Certainty",
  "significant": "Significance",
  "significance": "Significance",
  "controbusion": "Contribution",
  "contribution": "Contribution",
  "contribute": "Contribution",
  "connection/love": "Connection/Love",
  "connection / love": "Connection/Love",
  "connection/love/": "Connection/Love",
  "connection": "Connection/Love",
  "love": "Connection/Love",
  "uncerrtainy": "Uncertainty",
  "uncertainy": "Uncertainty",
  "uncertainty": "Uncertainty"
};

function normalizeHumanNeed(text) {
  if (!text) return text;
  let clean = text.replace(/\(\s*diurutkan\s*\)/gi, "").trim();
  const parts = clean.split(/\s*-\s*/).map(p => p.trim()).filter(Boolean);
  const fixed = parts.map(p => {
    const key = p.toLowerCase().replace(/\s+/g, " ").replace(/[.,;]+$/, "").trim();
    return HUMAN_NEED_MAP[key] || p;
  });
  return fixed.join(", ");
}

function extractPhoneNumber(line) {
  const trimmed = line.trim();
  if (!/^[\+\(\)\d\s\-\.]{9,20}$/.test(trimmed)) return null;
  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, "");
  if (/^(\+?62|0)8\d{7,13}$/.test(cleaned)) return cleaned;
  return null;
}

/* ============================================================
   PARSER
   ============================================================ */
function parseRaw(text) {
  const result = {};
  const lines = text.split(/\r?\n/);
  const LINE_RE = /^\s*(\d+)\s*[\.\)]\s*(.+?)\s*[:\?]\s*(.*)$/;
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) continue;

    const m = line.match(LINE_RE);
    if (m) {
      const no = parseInt(m[1], 10);
      const value = m[3].trim();
      const key = INPUT_NUMBER_MAP[no];
      if (key) {
        result[key] = value;
        currentKey = key;
        continue;
      } else {
        // Nomor 28 & 29 lama (Kata-Kata, Pesan) → diabaikan
        currentKey = null;
        continue;
      }
    }

    // Baris nomor HP standalone
    if (!result.noHP) {
      const phone = extractPhoneNumber(line);
      if (phone) {
        result.noHP = phone;
        currentKey = null;
        continue;
      }
    }

    // Baris lanjutan
    if (currentKey) {
      result[currentKey] = (result[currentKey] ? result[currentKey] + " " : "") + line.trim();
    }
  }

  // ==== Post-processing ====
  FIELDS.forEach(f => {
    let v = result[f.key];
    if (typeof v !== "string" || !v) return;

    if (f.key === "humanNeed") v = normalizeHumanNeed(v);
    if (f.key === "noHP") { result[f.key] = v.trim(); return; }

    v = capitalizeFirst(v);
    result[f.key] = v;
  });

  return result;
}

/* ============================================================
   HANDLERS
   ============================================================ */
function handleParse() {
  const text = document.getElementById("rawInput").value;
  if (!text.trim()) {
    alert("Tempel teks biodata dulu ya 😊");
    return;
  }
  state.raw = text;

  const parsed = parseRaw(text);

  let filled = 0, empty = 0;
  FIELDS.forEach(f => {
    const v = (parsed[f.key] || "").trim();
    state.data[f.key] = v;
    if (v) filled++; else empty++;
  });

  FIELDS.forEach(f => {
    const input = document.querySelector(`.field-input[data-key="${f.key}"]`);
    if (!input) return;
    input.value = state.data[f.key] || "";
    updateRowStatus(input.closest(".field-row"), input.value);
  });

  const status = document.getElementById("parseStatus");
  status.hidden = false;
  status.className = "parse-status" + (empty > 0 ? " warn" : "");
  status.textContent = `✅ Berhasil parse ${filled} dari ${FIELDS.length} field` +
    (empty > 0 ? ` — 🟡 ${empty} field kosong, boleh diisi manual.` : " 🎉");

  saveDraft();
  document.getElementById("formFields").scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleClear() {
  if (!confirm("Hapus semua data yang sedang diisi?")) return;
  state.raw = "";
  state.data = {};
  state.photo = null;
  localStorage.removeItem(DRAFT_KEY);

  document.getElementById("rawInput").value = "";
  document.getElementById("parseStatus").hidden = true;
  document.getElementById("photoGallery").value = "";
  document.getElementById("photoCamera").value = "";
  renderPhotoPreview();

  FIELDS.forEach(f => {
    const input = document.querySelector(`.field-input[data-key="${f.key}"]`);
    if (!input) return;
    input.value = "";
    updateRowStatus(input.closest(".field-row"), "");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handlePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w >= h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      else if (h > w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }

      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      state.photo = canvas.toDataURL("image/jpeg", 0.85);
      renderPhotoPreview();
      saveDraft();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function handleRemovePhoto() {
  state.photo = null;
  document.getElementById("photoGallery").value = "";
  document.getElementById("photoCamera").value = "";
  renderPhotoPreview();
  saveDraft();
}

function renderPhotoPreview() {
  const el = document.getElementById("photoPreview");
  if (state.photo) {
    el.innerHTML = `<img src="${state.photo}" alt="Foto">`;
  } else {
    el.innerHTML = `<span class="photo-empty">Belum ada foto</span>`;
  }
}

/* ============================================================
   RENDER FORM
   ============================================================ */
function renderForm() {
  const container = document.getElementById("formFields");
  container.innerHTML = "";

  FIELDS.forEach(f => {
    const row = document.createElement("div");
    row.className = "field-row empty";
    row.dataset.key = f.key;

    const label = document.createElement("label");
    label.className = "field-label";
    label.innerHTML = `<span class="num">${f.no}.</span>${f.label}`;
    label.htmlFor = `input_${f.key}`;

    let input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 2;
    } else {
      input = document.createElement("input");
      input.type = "text";
    }
    input.className = "field-input";
    input.id = `input_${f.key}`;
    input.dataset.key = f.key;

    input.addEventListener("input", (e) => {
      state.data[f.key] = e.target.value;
      updateRowStatus(row, e.target.value);
      saveDraft();
    });

    row.appendChild(label);
    row.appendChild(input);
    container.appendChild(row);
  });
}

function updateRowStatus(row, value) {
  if (!row) return;
  if (value && value.trim()) row.classList.remove("empty");
  else row.classList.add("empty");
}

/* ============================================================
   NAVIGASI HALAMAN
   ============================================================ */
function showPreview() {
  renderA4();
  document.getElementById("pageAdd").hidden = true;
  document.getElementById("pagePreview").hidden = false;
  document.getElementById("pageList").hidden = true;
  document.getElementById("pageTitle").textContent = "Preview A4";
  document.getElementById("btnBack").hidden = false;
  window.scrollTo(0, 0);
}

function showAdd() {
  document.getElementById("pageAdd").hidden = false;
  document.getElementById("pagePreview").hidden = true;
  document.getElementById("pageList").hidden = true;
  document.getElementById("pageTitle").textContent = "Parse Biodata";
  document.getElementById("btnBack").hidden = true;
  window.scrollTo(0, 0);
}

function showList() {
  document.getElementById("pageAdd").hidden = true;
  document.getElementById("pagePreview").hidden = true;
  document.getElementById("pageList").hidden = false;
  document.getElementById("pageTitle").textContent = "Daftar Biodata";
  document.getElementById("btnBack").hidden = true;
}

/* ============================================================
   RENDER A4
   ============================================================ */
function renderA4() {
  const a4 = document.getElementById("a4Page");
  a4.innerHTML = "";

  // Foto
  const photoWrap = document.createElement("div");
  photoWrap.className = "a4-photo-wrap";
  if (state.photo) {
    photoWrap.innerHTML = `<img src="${state.photo}" alt="Foto">`;
  } else {
    photoWrap.innerHTML = `<div class="a4-photo-placeholder">FOTO</div>`;
  }
  a4.appendChild(photoWrap);

  // Judul
  const title = document.createElement("div");
  title.className = "a4-title";
  title.textContent = "BIODATA";
  a4.appendChild(title);

  // Tabel 28 field
  const table = document.createElement("table");
  table.className = "a4-table";

  FIELDS.forEach(f => {
    const value = (state.data[f.key] || "").trim();

    const tr = document.createElement("tr");
    if (!value) tr.classList.add("empty");

    const td1 = document.createElement("td");
    td1.className = "col-label";
    td1.textContent = `${f.no}. ${f.label}`;

    const td2 = document.createElement("td");
    td2.className = "col-sep";
    td2.textContent = ":";

    const td3 = document.createElement("td");
    td3.className = "col-val";
    td3.textContent = value || "-";

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
  });

  a4.appendChild(table);
}

/* ============================================================
   DRAFT (localStorage)
   ============================================================ */
function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      raw: state.raw,
      data: state.data,
      photo: state.photo
    }));
  } catch (e) {
    console.warn("saveDraft failed:", e);
  }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    state.raw = d.raw || "";
    state.data = d.data || {};
    state.photo = d.photo || null;

    document.getElementById("rawInput").value = state.raw;
    renderPhotoPreview();

    FIELDS.forEach(f => {
      const input = document.querySelector(`.field-input[data-key="${f.key}"]`);
      if (!input) return;
      input.value = state.data[f.key] || "";
      updateRowStatus(input.closest(".field-row"), input.value);
    });
  } catch (e) {
    console.warn("loadDraft failed:", e);
  }
}
