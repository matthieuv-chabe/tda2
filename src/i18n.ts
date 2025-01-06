import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "showImminentArrivals": "Show Imminent Arrivals",
      "showAllMissions": "Show All Bookings",
      "allMissions": "All Bookings",
      "imminentArrivals": "Imminent Arrivals",
      "search": "Search",
      "showGreetings": "Show Greetings",
      "showCompletedMissions": "Show Completed Bookings",
      "loadingMissions": "Loading missions...",
      "refreshPage": "Refresh Page",
      "connectionError": "Unable to connect to server",
      "apologize": "We apologize for the inconvenience.",
      "passenger": "PASSENGER",
      "time": "TIME",
      "pickup": "PICKUP", 
      "dropoff": "DROPOFF",
      "vehicle": "VEHICLE",
      "driver": "DRIVER",
      "status": "STATUS",
      "logout": "Logout",
      "loading": "Loading...",
      "checkingAuth": "Checking authorizations...",
      "initializing": "Initializing...",
      "loadingClients": "Loading client list...",
      "noGeolocationData": "No geolocation data",
      "arrivalPlaceUndefined": "Arrival location undefined",
      "transportNoGeolocation": "Transport - No geolocation",
      "notEnoughData": "Not enough data",
      "noDataYet": "No data yet",
      "fullExtrapolation": "Full extrapolation",
      "impossiblePath": "Impossible path",
      "unknownRouteToDestination": "Unknown route to destination",
      "transportLastGeolocation": "Transport - Last geolocation at",
      "calculatingExtrapolatedPosition": "Calculating extrapolated position...",
      "extrapolatedLastPosition": "Extrapolated (last position",
      "upToDatePosition": "Position up to date",
      "greeting": "Meet & Greet",
      "agoSuffix": "ago)",
      "missingDate": "Missing date",
      "comingMission": "Coming bookings",
      "unknown": "?",
      "plannedArrivalAt": "Planned arrival at",
      "unknownPassenger": "Unknown passenger",
    }
  },
  fr: {
    translation: {
      "showImminentArrivals": "Afficher les Arrivées imminentes",
      "showAllMissions": "Afficher toutes les missions", 
      "allMissions": "Toutes les missions",
      "imminentArrivals": "Arrivées imminentes",
      "search": "Rechercher",
      "showGreetings": "Afficher les accueils",
      "showCompletedMissions": "Afficher les missions terminées",
      "loadingMissions": "Chargement des missions...",
      "refreshPage": "Actualiser la page",
      "connectionError": "Impossible de se connecter au serveur",
      "apologize": "Nous vous prions de nous excuser pour la gêne occasionnée.",
      "passenger": "PASSAGER",
      "time": "HEURE",
      "pickup": "DÉPART",
      "dropoff": "ARRIVÉE", 
      "vehicle": "VÉHICULE",
      "driver": "CHAUFFEUR",
      "status": "STATUT",
      "logout": "Déconnexion",
      "loading": "Chargement...",
      "checkingAuth": "Vérification des autorisations...",
      "initializing": "Initialisation...",
      "loadingClients": "Chargement de la liste des clients...",
      "noGeolocationData": "Aucune donnée de géolocalisation",
      "arrivalPlaceUndefined": "Lieu d'arrivée non défini",
      "transportNoGeolocation": "Transport - Pas de géolocalisation",
      "notEnoughData": "Données insuffisantes",
      "noDataYet": "Pas encore de données",
      "fullExtrapolation": "Extrapolation complète",
      "impossiblePath": "Chemin impossible",
      "unknownRouteToDestination": "Itinéraire vers arrivée inconnu",
      "transportLastGeolocation": "Transport - Dernière géolocalisation à",
      "calculatingExtrapolatedPosition": "Calcul de la position extrapolée...",
      "extrapolatedLastPosition": "Extrapolé (dernière position il y a",
      "upToDatePosition": "Position à jour",
      "greeting": "Accueil",
      "agoSuffix": ")",
      "missingDate": "Date manquante",
      "comingMission": "Mission à venir",
      "unknown": "?",
      "plannedArrivalAt": "Arrivée prévue à",
      "unknownPassenger": "Passager inconnu",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;