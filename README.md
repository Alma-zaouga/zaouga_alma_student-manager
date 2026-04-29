# 🎓 Student Manager

> Application web de gestion des étudiants — CRUD complet, dark mode, export CSV

**Auteure :** Zaouga Alma  
**Niveau :** PI2  
**Module :** Développement Web Front-End  
**Dépôt :** `zaouga_alma_student-manager`

---

## 🔗 Liens

| | Lien |
|---|---|
| 📁 Dépôt GitHub | `https://github.com/[votre-username]/zaouga_alma_student-manager` |
| 🌐 GitHub Pages | `https://[votre-username].github.io/zaouga_alma_student-manager/` |

---

## 📋 Description

**Student Manager** est une application web interactive permettant de gérer une liste d'étudiants directement depuis le navigateur. Les données sont sauvegardées localement grâce à `localStorage`, sans nécessiter de serveur.

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| **HTML5** | Structure sémantique de la page |
| **CSS3** | Design, animations, responsive design, dark mode |
| **JavaScript (ES6+)** | Logique CRUD, localStorage, validation, export |
| **Google Fonts (Inter)** | Typographie |
| **GitHub Pages** | Hébergement statique gratuit |

---

## ✨ Fonctionnalités principales

### CRUD complet
- ➕ **Ajouter** un étudiant (nom, prénom, date de naissance, email, niveau)
- ✏️ **Modifier** un étudiant existant avec pré-remplissage du formulaire
- 🗑️ **Supprimer** un étudiant avec confirmation
- 💾 **Persistance** des données via `localStorage`

### Recherche & tri
- 🔍 Recherche en temps réel par nom, prénom, email ou niveau
- 🔃 Tri alphabétique par nom, prénom ou niveau

### Interface utilisateur
- 🌙 **Dark mode** avec sauvegarde de la préférence
- 📊 **Statistiques en temps réel** (total étudiants, niveaux distincts, résultats affichés)
- 🔔 **Alertes animées** (succès / erreur)
- ✖️ **Bouton Annuler** en mode édition
- 📱 **Responsive** (mobile, tablette, desktop)

### Qualité & sécurité
- 📥 **Export CSV** de la liste complète
- 🛡️ **Protection XSS** (échappement HTML)
- ✅ **Validation** : format email, date future, email dupliqué
- ♿ **Accessibilité** : labels, aria-labels, rôles ARIA

---

## 🆕 Nouveautés explorées

Durant ce projet, j'ai découvert et appliqué plusieurs concepts nouveaux :

- **`localStorage`** pour persister les données sans back-end
- **Export CSV avec BOM UTF-8** (`\uFEFF`) pour un bon affichage des accents dans Excel
- **Protection XSS** avec une fonction `escapeHTML()` pour sécuriser les données affichées
- **Animations CSS** (`@keyframes rowIn`, `slideDown`) pour améliorer l'UX
- **GitHub Pages** pour héberger gratuitement un projet statique
- **ARIA** (Accessible Rich Internet Applications) pour l'accessibilité

---

## ⚠️ Difficultés rencontrées

1. **Décalage de date** : Les dates s'affichaient avec un jour de retard à cause du fuseau horaire UTC. `new Date("2003-05-15")` était interprété comme minuit UTC, soit la veille en heure locale.

2. **Index lors de la suppression en mode édition** : Supprimer un étudiant pendant qu'on en éditait un autre causait un décalage d'index.

3. **Caractères spéciaux dans l'export CSV** : Les accents n'étaient pas bien affichés dans Excel.

4. **Renommage du fichier principal** : GitHub Pages requiert un fichier `index.html` à la racine, alors que le fichier s'appelait `CRUD.html`.

---

## ✅ Solutions apportées

1. **Correction de la date** : Ajout de `T00:00:00` lors de la création de l'objet `Date` → `new Date(dt_nais + "T00:00:00")` pour forcer l'interprétation en heure locale.

2. **Gestion des index** : Lors de la suppression, vérification et mise à jour de `editIndex` si nécessaire (`if (editIndex > index) editIndex--`).

3. **Export CSV** : Ajout du BOM UTF-8 (`\uFEFF`) au début du fichier CSV pour forcer Excel à utiliser l'encodage correct.

4. **Renommage** : `CRUD.html` → `index.html` pour la compatibilité avec GitHub Pages.

---

## 📁 Structure du projet

```
zaouga_alma_student-manager/
├── index.html       # Structure HTML de l'application
├── style.css        # Styles CSS (design + dark mode + responsive)
├── js.js            # Logique JavaScript (CRUD + fonctionnalités)
└── README.md        # Documentation du projet
```

---

## 🚀 Lancer le projet en local

```bash
# Cloner le dépôt
git clone https://github.com/[votre-username]/zaouga_alma_student-manager.git

# Ouvrir index.html dans un navigateur
# Aucune installation requise — application 100% front-end
```

---

*© 2026 — Zaouga Alma | PI2*
