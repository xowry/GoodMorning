# 🌅 Good Morning Dashboard - Bus C13 & Météo Lycée

Dashboard interactif du matin spécialement conçu pour un lycéen se rendant à Voiron depuis Voreppe.

## 🚌 Fonctionnalités Transport (Ligne Chrono Péri C13)
- **Départ en temps réel** depuis l'arrêt **Avenue du 11 Novembre** (Voreppe).
- **Heure d'arrivée précise** calculée à l'arrêt **Edgar Kofler** (Voiron / Lycée).
- **Grand compte à rebours** dynamique avec estimation du temps restant (ex: *Départ dans 8 min*).
- **Statut en direct** : À l'heure, en avance, retard en minutes (données temps réel SMMAG / Mobilités M).
- **Conseils de départ intelligents** :
  - `> 15 min` : *Tu as le temps de te préparer tranquillement ☕*
  - `8 - 15 min` : *Prépare tes affaires, départ bientôt 🎒*
  - `3 - 8 min` : *C'est le moment d'aller à l'arrêt 👟*
  - `< 3 min` : *Dépêche-toi, le bus approche 🏃‍♂️*
- **Tableau des prochains départs** de la matinée et de l'après-midi.
- **Bouton Aller ➔ Retour** : Permet de basculer en un clic sur le trajet du retour (*Voiron Edgar Kofler ➔ Voreppe 11 Novembre*).

---

## 🌤️ Météo & Recommandations Lycée
- **Météo en direct** pour la zone Voreppe / Voiron (Open-Meteo).
- **Température actuelle & ressentie**, Min / Max du jour, probabilité de pluie, vitesse du vent.
- **Conseils Lycée automatiques** :
  - Détection automatique du besoin de parapluie / imperméable en cas de risque de pluie.
  - Conseil de veste / pull si la matinée est fraîche (< 16°C).
  - Alerte hydratation (gourde d'eau) en cas de chaleur l'après-midi (> 26°C).
- **Prévisions heure par heure** pour la journée de cours (07h à 18h).

---

## 🎒 Checklist & Alertes
- **Checklist Sac de Cours** sauvegardée automatiquement :
  - Pass OùRA / Carte M réso
  - Carnet de correspondance / Badge Lycée
  - Trousse, calculatrice & cahiers
  - Gourde d'eau & encas
  - Clés de la maison
  - Téléphone & écouteurs
- **Alerte Sonore 5 min** (optionnelle) : Joue un carillon doux 5 minutes avant l'arrivée du bus.
- **Rafraîchissement automatique** toutes les 30 secondes avec barre de progression.

---

## 🚀 Comment lancer l'application

### Méthode 1 : Avec le serveur local Python (Recommandé)
Ouvrez un terminal ou double-cliquez sur `start_server.py` :
```bash
python start_server.py
```
L'application s'ouvrira automatiquement à l'adresse [http://localhost:8080/index.html](http://localhost:8080/index.html).

### Méthode 2 : Directement dans le navigateur
Faites un double-clic sur le fichier `index.html` pour l'ouvrir dans Google Chrome, Edge ou Firefox.

---

## 📱 Utilisation sur Smartphone / Tablette
Pour l'avoir comme une application sur le téléphone de votre fils :
1. Lancez le serveur local ou hébergez les fichiers sur un serveur local / GitHub Pages.
2. Ouvrez le lien sur Safari (iOS) ou Chrome (Android).
3. Cliquez sur **Partager** ➔ **Sur l'écran d'accueil** (Ajouter à l'écran d'accueil).
