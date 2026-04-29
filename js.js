// ============================================================
//  Student Manager — js.js
//  Auteur : Zaouga Alma | PI2
//  Fonctionnalités : CRUD, recherche, tri, dark mode,
//                   export CSV, validation, localStorage
// ============================================================

// ─── État global ─────────────────────────────────────────────
let students  = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// ─── Références DOM ──────────────────────────────────────────
const form      = document.getElementById("student-form");
const list      = document.getElementById("student-list");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");

// ============================================================
//  ✅ SOUMISSION DU FORMULAIRE (Ajout / Modification)
// ============================================================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name         = document.getElementById("Prenom").value.trim();
  const lastName     = document.getElementById("Nom").value.trim();
  const dt_nais      = document.getElementById("DateNaissance").value;
  const email        = document.getElementById("Email").value.trim();
  const studentClass = document.getElementById("Niveau").value.trim();

  // Validation : champs vides
  if (!name || !lastName || !dt_nais || !email || !studentClass) {
    showAlert("⚠️ Veuillez remplir tous les champs.", "error");
    return;
  }

  // Validation : format email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAlert("⚠️ Adresse email invalide.", "error");
    document.getElementById("Email").focus();
    return;
  }

  // Validation : date de naissance dans le futur
  if (new Date(dt_nais) > new Date()) {
    showAlert("⚠️ La date de naissance ne peut pas être dans le futur.", "error");
    document.getElementById("DateNaissance").focus();
    return;
  }

  // Validation : email dupliqué
  const duplicate = students.some((s, i) =>
    s.email.toLowerCase() === email.toLowerCase() && i !== editIndex
  );
  if (duplicate) {
    showAlert("⚠️ Cet email existe déjà.", "error");
    document.getElementById("Email").focus();
    return;
  }

  const student = { name, last_name: lastName, dt_nais, email, class: studentClass };

  if (editIndex === -1) {
    // ➕ Ajout
    students.push(student);
    showAlert("✅ Étudiant ajouté avec succès !", "success");
  } else {
    // ✏️ Modification
    students[editIndex] = student;
    resetEditMode();
    showAlert("✏️ Étudiant modifié avec succès !", "success");
  }

  saveData();
  renderStudents();
  form.reset();
  document.getElementById("Nom").focus();
});

// ============================================================
//  ❌ SUPPRESSION
// ============================================================
function deleteStudent(index) {
  const s = students[index];
  if (confirm(`Supprimer ${s.name} ${s.last_name} ?`)) {
    students.splice(index, 1);
    // Si on était en train d'éditer cet étudiant, annuler l'édition
    if (editIndex === index) resetEditMode();
    else if (editIndex > index) editIndex--;
    saveData();
    renderStudents();
    showAlert("🗑️ Étudiant supprimé.", "error");
  }
}

// ============================================================
//  ✏️ ÉDITION
// ============================================================
function editStudent(index) {
  const student = students[index];

  document.getElementById("Prenom").value        = student.name;
  document.getElementById("Nom").value           = student.last_name;
  document.getElementById("DateNaissance").value = student.dt_nais;
  document.getElementById("Email").value         = student.email;
  document.getElementById("Niveau").value        = student.class;

  editIndex = index;
  submitBtn.textContent = "💾 Enregistrer";
  submitBtn.classList.add("editing");
  cancelBtn.style.display = "inline-block";
  formTitle.textContent = "✏️ Modifier l'étudiant";

  // Scroll vers le formulaire + focus
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("Nom").focus();
}

// ─── Annuler l'édition ────────────────────────────────────────
cancelBtn.addEventListener("click", () => {
  form.reset();
  resetEditMode();
  showAlert("ℹ️ Modification annulée.", "success");
});

function resetEditMode() {
  editIndex = -1;
  submitBtn.textContent = "➕ Ajouter";
  submitBtn.classList.remove("editing");
  cancelBtn.style.display = "none";
  formTitle.textContent = "➕ Ajouter un étudiant";
}

// ============================================================
//  💾 SAUVEGARDE localStorage
// ============================================================
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ============================================================
//  🔄 RENDU DU TABLEAU
// ============================================================
function renderStudents() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const sortValue   = document.getElementById("sort").value;

  // Copie avec index d'origine
  let data = students.map((s, i) => ({ ...s, originalIndex: i }));

  // 🔍 Filtrage
  if (searchValue !== "") {
    data = data.filter(s =>
      s.name.toLowerCase().includes(searchValue) ||
      s.last_name.toLowerCase().includes(searchValue) ||
      s.email.toLowerCase().includes(searchValue) ||
      s.class.toLowerCase().includes(searchValue)
    );
  }

  // 🔃 Tri
  if (sortValue === "name")      data.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  if (sortValue === "last_name") data.sort((a, b) => a.last_name.localeCompare(b.last_name, "fr"));
  if (sortValue === "class")     data.sort((a, b) => a.class.localeCompare(b.class, "fr"));

  // 🎯 Affichage
  list.innerHTML = "";
  const emptyState = document.getElementById("empty-state");

  if (data.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    data.forEach((student) => {
      const tr = document.createElement("tr");

      // Formatage date en français
      const dateAff = student.dt_nais
        ? new Date(student.dt_nais + "T00:00:00").toLocaleDateString("fr-FR")
        : "—";

      tr.innerHTML = `
        <td>${escapeHTML(student.last_name)}</td>
        <td>${escapeHTML(student.name)}</td>
        <td>${dateAff}</td>
        <td><a href="mailto:${escapeHTML(student.email)}">${escapeHTML(student.email)}</a></td>
        <td><span class="badge">${escapeHTML(student.class)}</span></td>
        <td>
          <button class="btn-edit"   onclick="editStudent(${student.originalIndex})"   aria-label="Modifier ${student.name}">✏️ Modifier</button>
          <button class="btn-delete" onclick="deleteStudent(${student.originalIndex})" aria-label="Supprimer ${student.name}">🗑️ Supprimer</button>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  updateStats(data.length);
}

// ============================================================
//  📊 STATISTIQUES
// ============================================================
function updateStats(filtered) {
  const total  = students.length;
  const levels = new Set(students.map(s => s.class)).size;

  document.getElementById("stat-total").textContent    = total;
  document.getElementById("stat-levels").textContent   = levels;
  document.getElementById("stat-filtered").textContent = filtered;
}

// ============================================================
//  📥 EXPORT CSV
// ============================================================
document.getElementById("export-btn").addEventListener("click", () => {
  if (students.length === 0) {
    showAlert("⚠️ Aucun étudiant à exporter.", "error");
    return;
  }

  const headers = ["Nom", "Prénom", "Date de naissance", "Email", "Niveau"];
  const rows = students.map(s => [
    `"${s.last_name}"`,
    `"${s.name}"`,
    `"${s.dt_nais}"`,
    `"${s.email}"`,
    `"${s.class}"`
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href     = url;
  a.download = "etudiants.csv";
  a.click();
  URL.revokeObjectURL(url);

  showAlert("📥 Export CSV réussi !", "success");
});

// ============================================================
//  🔍 ÉVÉNEMENTS RECHERCHE / TRI
// ============================================================
document.getElementById("search").addEventListener("input", renderStudents);
document.getElementById("sort").addEventListener("change", renderStudents);

// ============================================================
//  🌙 DARK MODE
// ============================================================
const darkBtn = document.getElementById("darkModeToggle");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkBtn.textContent = "☀️";
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  darkBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("darkMode", isDark);
});

// ============================================================
//  🔔 ALERTES
// ============================================================
function showAlert(msg, type = "success") {
  const box = document.getElementById("alert-box");
  box.textContent = msg;
  box.className = `alert-box ${type}`;
  clearTimeout(box._t);
  box._t = setTimeout(() => { box.className = "alert-box"; }, 3500);
}

// ============================================================
//  🛡️ SÉCURITÉ — échapper HTML pour éviter XSS
// ============================================================
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================================
//  🚀 INITIALISATION
// ============================================================
renderStudents();
document.getElementById("Nom").focus();