document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ evaluation.js chargé");

    const TOTAL_QUESTIONS = 35;
    const POINT_PAR_QUESTION = 0.25;
    const TOTAL_POINTS = TOTAL_QUESTIONS * POINT_PAR_QUESTION;

    /* =====================================================
       1. CALCUL DU SCORE
    ===================================================== */

    function calculerScore() {

        let score = 0;
        let bonnes = 0;
        let repondues = 0;

        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {

            const reponse = document.querySelector(
                `input[name="q${i}"]:checked`
            );

            if (reponse) {

                repondues++;

                const valeur = parseFloat(reponse.value) || 0;

                score += valeur;

                if (valeur === POINT_PAR_QUESTION) {
                    bonnes++;
                }
            }
        }

        return {
            score: score,
            bonnes: bonnes,
            repondues: repondues,
            total: TOTAL_QUESTIONS,
            totalPoints: TOTAL_POINTS
        };
    }


    /* =====================================================
       2. APPRECIATION
    ===================================================== */

    function obtenirAppreciation(score) {

        const pourcentage = (score / TOTAL_POINTS) * 100;

        if (pourcentage >= 90) {
            return "🏆 Excellent travail !";
        }

        if (pourcentage >= 80) {
            return "👏 Très bon travail !";
        }

        if (pourcentage >= 60) {
            return "👍 Bon travail !";
        }

        if (pourcentage >= 50) {
            return "🙂 Travail satisfaisant.";
        }

        return "📚 Il faut encore réviser.";
    }


    /* =====================================================
       3. AFFICHER RESULTAT
    ===================================================== */

    function afficherResultat(resultat) {

        let zoneResultat = document.getElementById("resultat");

        if (!zoneResultat) {

            zoneResultat = document.createElement("div");

            zoneResultat.id = "resultat";

            document
                .getElementById("zonePDF")
                .appendChild(zoneResultat);
        }

        const appreciation =
            obtenirAppreciation(resultat.score);

        const pourcentage =
            ((resultat.score / resultat.totalPoints) * 100).toFixed(0);

        zoneResultat.innerHTML = `

            <div class="resultat-box">

                <h2>📊 Résultat du QCM</h2>

                <p>
                    <strong>Score :</strong>
                    ${resultat.score.toFixed(2)}
                    / ${resultat.totalPoints.toFixed(2)}
                </p>

                <p>
                    <strong>Pourcentage :</strong>
                    ${pourcentage} %
                </p>

                <p>
                    <strong>Bonnes réponses :</strong>
                    ${resultat.bonnes}
                    / ${resultat.total}
                </p>

                <p>
                    <strong>Questions répondues :</strong>
                    ${resultat.repondues}
                    / ${resultat.total}
                </p>

                <p>
                    <strong>Appréciation :</strong>
                    ${appreciation}
                </p>

                <button
                    type="button"
                    id="btnPDFResultat">
                    📄 Télécharger mon résultat PDF
                </button>

            </div>
        `;

        const boutonPDF =
            document.getElementById("btnPDFResultat");

        if (boutonPDF) {

            boutonPDF.addEventListener(
                "click",
                function () {

                    genererPDFResultat(resultat);

                }
            );
        }

        zoneResultat.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    /* =====================================================
       4. BOUTON VALIDER
    ===================================================== */

    function installerBoutonValidation() {

        const bouton =
            document.querySelector(
                "#btnValider, #valider"
            );

        if (!bouton) {

            console.warn(
                "⚠️ Bouton #btnValider ou #valider introuvable."
            );

            return;
        }

        bouton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const resultat =
                    calculerScore();

                if (
                    resultat.repondues <
                    TOTAL_QUESTIONS
                ) {

                    alert(
                        `⚠️ Vous avez répondu à ${resultat.repondues}/${TOTAL_QUESTIONS} questions.\n\n` +
                        `Veuillez répondre à toutes les questions avant de valider.`
                    );

                    return;
                }

                afficherResultat(resultat);
            }
        );
    }


    /* =====================================================
       5. PDF DU RESULTAT
    ===================================================== */

    function genererPDFResultat(resultat) {

        if (
            typeof window.jspdf === "undefined"
        ) {

            alert(
                "❌ jsPDF n'est pas chargé."
            );

            return;
        }

        const {
            jsPDF
        } = window.jspdf;

        const doc = new jsPDF();

        const nom =
            document.querySelector("#nom")?.value ||
            document.querySelector("[name='nom']")?.value ||
            "Eleve";

        const prenom =
            document.querySelector("#prenom")?.value ||
            document.querySelector("[name='prenom']")?.value ||
            "";

        const date =
            new Date().toLocaleDateString("fr-FR");

        const appreciation =
            obtenirAppreciation(resultat.score);

        const pourcentage =
            (
                resultat.score /
                resultat.totalPoints *
                100
            ).toFixed(0);


        /* TITRE */

        doc.setFontSize(18);

        doc.text(
            "Gi.Code Formation",
            105,
            20,
            {
                align: "center"
            }
        );

        doc.setFontSize(14);

        doc.text(
            "ÉVALUATION MICROSOFT WORD",
            105,
            30,
            {
                align: "center"
            }
        );

        doc.line(
            20,
            35,
            190,
            35
        );


        /* INFORMATIONS */

        doc.setFontSize(11);

        doc.text(
            `Nom : ${nom}`,
            20,
            48
        );

        doc.text(
            `Prénom : ${prenom}`,
            20,
            56
        );

        doc.text(
            `Date : ${date}`,
            20,
            64
        );


        /* RESULTAT */

        doc.setFontSize(15);

        doc.text(
            "RÉSULTAT",
            20,
            82
        );

        doc.setFontSize(12);

        doc.text(
            `Score : ${resultat.score.toFixed(2)} / ${resultat.totalPoints.toFixed(2)}`,
            25,
            94
        );

        doc.text(
            `Pourcentage : ${pourcentage} %`,
            25,
            102
        );

        doc.text(
            `Bonnes réponses : ${resultat.bonnes} / ${resultat.total}`,
            25,
            110
        );

        doc.text(
            `Appréciation : ${appreciation}`,
            25,
            118
        );


        /* DETAIL */

        doc.setFontSize(14);

        doc.text(
            "Détail des réponses",
            20,
            135
        );

        doc.setFontSize(10);

        let y = 145;

        for (
            let i = 1;
            i <= TOTAL_QUESTIONS;
            i++
        ) {

            const reponse =
                document.querySelector(
                    `input[name="q${i}"]:checked`
                );

            if (!reponse) {
                continue;
            }

            const correcte =
                parseFloat(reponse.value) ===
                POINT_PAR_QUESTION;

            const texte =
                `Question ${i} : ${
                    correcte
                        ? "✓ Bonne réponse"
                        : "✗ Mauvaise réponse"
                }`;

            doc.text(
                texte,
                25,
                y
            );

            y += 7;

            if (y > 275) {

                doc.addPage();

                y = 20;
            }
        }


        /* PIED DE PAGE */

        doc.setFontSize(9);

        doc.text(
            "Gi.Code Formation – Bureautique",
            105,
            290,
            {
                align: "center"
            }
        );


        /* NOM DU FICHIER */

        const nomPropre =
            nom
                .replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");

        const prenomPropre =
            prenom
                .replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");

        doc.save(
            `Resultat_Word_${nomPropre}_${prenomPropre}.pdf`
        );
    }


    /* =====================================================
       6. TELECHARGER TOUTE LA REVISION
    ===================================================== */

    window.telechargerPDF = function () {

        const zone =
            document.getElementById("zonePDF");

        if (!zone) {

            alert(
                "❌ La zone PDF est introuvable."
            );

            return;
        }

        if (
            typeof html2pdf === "undefined"
        ) {

            alert(
                "❌ La bibliothèque html2pdf.js n'est pas chargée."
            );

            return;
        }


        /* Cacher temporairement les boutons */

        const boutons =
            zone.querySelectorAll("button");

        boutons.forEach(
            bouton => {
                bouton.style.display = "none";
            }
        );


        /* Cacher le résultat si présent */

        const resultat =
            document.getElementById("resultat");

        if (resultat) {
            resultat.style.display = "none";
        }


        const options = {

            margin: [
                10,
                10,
                10,
                10
            ],

            filename:
                "GiCode_Revision_WORD.pdf",

            image: {
                type: "jpeg",
                quality: 0.98
            },

            html2canvas: {

                scale: 1.5,

                useCORS: true,

                allowTaint: true,

                logging: false,

                scrollX: 0,

                scrollY: 0,

                windowWidth:
                    document.documentElement
                        .scrollWidth
            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation: "portrait"
            },

            pagebreak: {

                mode: [
                    "css",
                    "legacy"
                ],

                avoid: [
                    ".box-reponse",
                    "li",
                    "h3"
                ]
            }
        };


        html2pdf()
            .set(options)
            .from(zone)
            .save()
            .then(
                function () {

                    console.log(
                        "✅ PDF complet généré."
                    );

                    /* Restaurer */

                    boutons.forEach(
                        bouton => {
                            bouton.style.display = "";
                        }
                    );

                    if (resultat) {
                        resultat.style.display = "";
                    }
                }
            )
            .catch(
                function (erreur) {

                    console.error(
                        "❌ Erreur PDF :",
                        erreur
                    );

                    alert(
                        "❌ Impossible de générer le PDF."
                    );

                    boutons.forEach(
                        bouton => {
                            bouton.style.display = "";
                        }
                    );

                    if (resultat) {
                        resultat.style.display = "";
                    }
                }
            );
    };


    /* =====================================================
       7. INITIALISATION
    ===================================================== */

    installerBoutonValidation();

});