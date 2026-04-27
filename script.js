
window.onload = function () {

    const tableau = document.getElementById("tab");
     // --- RESTAURATION DU TOTAL (localStorage) ---
    // Permet de garder le total même après rechargement de la page
    const memoire = localStorage.getItem("montantTotal");
    if (memoire && tableau) {
        let lignes = tableau.getElementsByTagName("tr");
        lignes[lignes.length - 1].cells[1].innerText = memoire + " dt";
    }
        // RECHERCHE  PRODUITS
     const recherche = document.getElementById("recherche");

if (recherche) {
    recherche.addEventListener("input", function () {

        let mot = this.value.toLowerCase();
        let lignes = document.getElementById("tab").rows;
        let trouve = false;

        for (let i = 1; i < lignes.length - 1; i++) {

            let nom = lignes[i].cells[0].innerText.toLowerCase();

            lignes[i].classList.remove("highlight");
             // affichage / masquage selon recherche

            if (nom.includes(mot)) {
                lignes[i].style.display = "";
                lignes[i].classList.add("highlight");// surlignage résultat
                trouve = true;
            } else {
                lignes[i].style.display = "none";
            }
        }
        // message si aucun résultat trouvé

        document.getElementById("noResult").style.display = trouve ? "none" : "block";
    });
}
        // VALIDATION FORMULAIRE CLIENT
    const form = document.getElementById("formCommande");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();// empêcher rechargement page

            const nom = document.getElementById("nom").value.trim();
            const prenom = document.getElementById("prenom").value.trim();
            const tel = document.getElementById("tel").value.trim();
            const adresse = document.getElementById("adresse").value.trim();

            const regexNom = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
            const regexTel = /^\+216\d{8}$/;

            if (!regexNom.test(nom) || !regexNom.test(prenom)) {
                alert("Nom ou prénom invalide");
                return;
            }

            if (!regexTel.test(tel)) {
                alert("Téléphone invalide (+216XXXXXXXX)");
                return;
            }

            if (adresse.length < 5) {
                alert("Adresse invalide");
                return;
            }

            let total = localStorage.getItem("montantTotal") || "0";

            afficherResume(nom, prenom, tel, adresse, total);
        });
    }
};

// CALCUL DU PANIER
function calculer() {
    let total = 0;
    let lignes = document.getElementById("tab").getElementsByTagName("tr");

    for (let i = 1; i < lignes.length - 1; i++) {
        // calcul uniquement si produit visible (filtrage actif)

        if (lignes[i].style.display !== "none") { 

            let qte = parseInt(lignes[i].querySelector("input").value) || 0;
            let prix = parseFloat(lignes[i].cells[2].innerText.replace(" dt", "")) || 0;

            let res = qte * prix;

            lignes[i].cells[3].innerText = res + " dt";
            total += res;
        }
    }
     // mise à jour total général

    lignes[lignes.length - 1].cells[1].innerText = total + " dt";

    localStorage.setItem("montantTotal", total);// sauvegarde du total
  
}
// --- SUPPRESSION ---
function supprimerLigne(btn) {
    btn.closest("tr").remove();
    calculer();//recalcul automatique après suppression
}


// --- BOUTON RETOUR HAUT ---
function remonter() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" 
    });
}

// afficher / cacher bouton selon scroll
window.addEventListener("scroll", function () {
    let btn = document.getElementById("btnTop");

    if (window.scrollY > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});
//  RESET
function resetPanier() {

    let lignes = document.getElementById("tab").rows;

    for (let i = 1; i < lignes.length - 1; i++) {
        lignes[i].querySelector("input").value = 0;
        lignes[i].cells[3].innerText = 0;
        lignes[i].style.display = "";
    }

    document.getElementById("total").innerText = 0;
    document.getElementById("recherche").value = "";

    localStorage.removeItem("total");
}

//  RESUME
function afficherResume(nom, prenom, tel, adresse, total) {
    document.getElementById("r_nom").innerText = nom;
    document.getElementById("r_prenom").innerText = prenom;
    document.getElementById("r_tel").innerText = tel;
    document.getElementById("r_adresse").innerText = adresse;
    document.getElementById("r_total").innerText = total + " dt";
}