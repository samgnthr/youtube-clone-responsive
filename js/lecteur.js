/* ==========================================================
   YouTube clone · lecteur.js
   Relie une carte de l'accueil à la page vidéo, à partir de la
   liste de js/videos.js (c'est elle qu'on modifie, pas ce fichier).

   1. SUR index.html : chaque carte a un data-id. Ses liens deviennent
        video.html?id=ton-id

   2. SUR video.html : on lit l'id dans l'adresse, on cherche la vidéo
      dans la liste VIDEOS et on remplit la page avec ses informations.

   Sans id dans l'adresse (ou id inconnu), video.html reste la page d'origine.
   ========================================================== */


/* ---------- 1. index.html : écrire l'adresse de chaque carte ---------- */

document.querySelectorAll(".video-card[data-id]").forEach(function (carte) {
  const adresse = "video.html?id=" + encodeURIComponent(carte.dataset.id);

  carte.querySelectorAll('a[href="video.html"]').forEach(function (lien) {
    lien.setAttribute("href", adresse);
  });
});


/* ---------- 2. video.html : afficher la vidéo demandée ---------- */

const lecteur = document.querySelector(".lecteur");

if (lecteur && typeof VIDEOS !== "undefined") {
  const id = new URLSearchParams(window.location.search).get("id");
  const video = VIDEOS.find(function (v) {
    return v.id === id;
  });

  if (video) afficherVideo(video);
}

/* Identifiant YouTube (11 caractères) d'un lien youtube.com / youtu.be, sinon null */
function idYouTube(lien) {
  const trouve = lien.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return trouve ? trouve[1] : null;
}

function afficherVideo(video) {
  /* Titre de l'onglet et titre de la page */
  document.title = video.titre + " – YouTube";
  lecteur.querySelector("h1").textContent = video.titre;

  /* Lecteur */
  const cadre = lecteur.querySelector(".video-cadre");
  const iframe = cadre.querySelector("iframe");
  const idYt = video.video ? idYouTube(video.video) : null;

  if (idYt && iframe) {
    /* Lien YouTube : on garde le lecteur intégré, on change juste son adresse */
    iframe.src = "https://www.youtube.com/embed/" + idYt;
    iframe.title = video.titre;
  } else {
    /* Fichier vidéo (.mp4…) ou pas de vidéo : miniature en image d'attente */
    const balise = document.createElement("video");
    balise.title = video.titre;
    if (video.miniature) balise.poster = video.miniature;
    if (video.video) {
      balise.src = video.video;
      balise.controls = true;
      balise.autoplay = true;
      balise.playsInline = true;
      /* Le navigateur peut refuser le démarrage automatique :
         il suffit alors de cliquer sur lecture */
      balise.play().catch(function () {});
    }
    cadre.replaceChildren(balise);
  }

  /* Chaîne */
  lecteur.querySelector(".chaine-nom b").textContent = video.chaine;
  if (video.avatar) lecteur.querySelector(".avatar-chaine").src = video.avatar;

  const abonnes = lecteur.querySelector(".abonnes");
  abonnes.textContent = video.abonnes;
  abonnes.hidden = !video.abonnes;

  /* Description */
  const paragraphes = lecteur.querySelectorAll(".description > p");
  paragraphes[0].querySelector("b").textContent = video.vues;
  paragraphes[1].textContent =
    video.description || video.titre + " – une vidéo de " + video.chaine + ".";

  paragraphes[2].textContent = video.suite;
  lecteur.querySelector(".afficher-plus").hidden = !video.suite;
}
