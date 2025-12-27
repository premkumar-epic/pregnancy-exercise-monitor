import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            "nav.dashboard": "Dashboard",
            "nav.users": "Users",
            "nav.content": "Content",
            "nav.campaigns": "Campaigns",
            "nav.analytics": "Analytics",
            "nav.widgets": "Widgets",
            "nav.notifications": "Notifications",
            "nav.profile": "Profile",
            "nav.logout": "Logout",

            // Dashboard
            "dashboard.title": "Admin Dashboard",
            "dashboard.welcome": "Welcome to Admin Portal",
            "dashboard.overview": "System Overview",

            // Common
            "common.save": "Save",
            "common.cancel": "Cancel",
            "common.delete": "Delete",
            "common.edit": "Edit",
            "common.create": "Create",
            "common.search": "Search",
            "common.filter": "Filter",
            "common.export": "Export",
            "common.loading": "Loading...",
            "common.noData": "No data available",

            // Users
            "users.title": "User Management",
            "users.subtitle": "Manage users, roles, and permissions",
            "users.username": "Username",
            "users.email": "Email",
            "users.role": "Role",
            "users.lastLogin": "Last Login",
            "users.joined": "Joined",
            "users.actions": "Actions",

            // Analytics
            "analytics.title": "Analytics",
            "analytics.subtitle": "Data insights and metrics",
            "analytics.retention": "User Retention",
            "analytics.adoption": "Feature Adoption",
            "analytics.engagement": "Engagement Metrics",

            // Notifications
            "notifications.title": "Notification Center",
            "notifications.markAllRead": "Mark All as Read",
            "notifications.all": "All",
            "notifications.unread": "Unread",

            // Settings
            "settings.language": "Language",
            "settings.selectLanguage": "Select Language"
        }
    },
    es: {
        translation: {
            // Navigation
            "nav.dashboard": "Panel",
            "nav.users": "Usuarios",
            "nav.content": "Contenido",
            "nav.campaigns": "Campañas",
            "nav.analytics": "Analíticas",
            "nav.widgets": "Widgets",
            "nav.notifications": "Notificaciones",
            "nav.profile": "Perfil",
            "nav.logout": "Cerrar Sesión",

            // Dashboard
            "dashboard.title": "Panel de Administración",
            "dashboard.welcome": "Bienvenido al Portal de Administración",
            "dashboard.overview": "Resumen del Sistema",

            // Common
            "common.save": "Guardar",
            "common.cancel": "Cancelar",
            "common.delete": "Eliminar",
            "common.edit": "Editar",
            "common.create": "Crear",
            "common.search": "Buscar",
            "common.filter": "Filtrar",
            "common.export": "Exportar",
            "common.loading": "Cargando...",
            "common.noData": "No hay datos disponibles",

            // Users
            "users.title": "Gestión de Usuarios",
            "users.subtitle": "Administrar usuarios, roles y permisos",
            "users.username": "Nombre de Usuario",
            "users.email": "Correo Electrónico",
            "users.role": "Rol",
            "users.lastLogin": "Último Acceso",
            "users.joined": "Registrado",
            "users.actions": "Acciones",

            // Analytics
            "analytics.title": "Analíticas",
            "analytics.subtitle": "Información y métricas de datos",
            "analytics.retention": "Retención de Usuarios",
            "analytics.adoption": "Adopción de Funciones",
            "analytics.engagement": "Métricas de Compromiso",

            // Notifications
            "notifications.title": "Centro de Notificaciones",
            "notifications.markAllRead": "Marcar Todo como Leído",
            "notifications.all": "Todas",
            "notifications.unread": "No Leídas",

            // Settings
            "settings.language": "Idioma",
            "settings.selectLanguage": "Seleccionar Idioma"
        }
    },
    fr: {
        translation: {
            // Navigation
            "nav.dashboard": "Tableau de Bord",
            "nav.users": "Utilisateurs",
            "nav.content": "Contenu",
            "nav.campaigns": "Campagnes",
            "nav.analytics": "Analytique",
            "nav.widgets": "Widgets",
            "nav.notifications": "Notifications",
            "nav.profile": "Profil",
            "nav.logout": "Déconnexion",

            // Dashboard
            "dashboard.title": "Tableau de Bord Admin",
            "dashboard.welcome": "Bienvenue au Portail Admin",
            "dashboard.overview": "Aperçu du Système",

            // Common
            "common.save": "Enregistrer",
            "common.cancel": "Annuler",
            "common.delete": "Supprimer",
            "common.edit": "Modifier",
            "common.create": "Créer",
            "common.search": "Rechercher",
            "common.filter": "Filtrer",
            "common.export": "Exporter",
            "common.loading": "Chargement...",
            "common.noData": "Aucune donnée disponible",

            // Users
            "users.title": "Gestion des Utilisateurs",
            "users.subtitle": "Gérer les utilisateurs, rôles et permissions",
            "users.username": "Nom d'Utilisateur",
            "users.email": "Email",
            "users.role": "Rôle",
            "users.lastLogin": "Dernière Connexion",
            "users.joined": "Inscrit",
            "users.actions": "Actions",

            // Analytics
            "analytics.title": "Analytique",
            "analytics.subtitle": "Informations et métriques de données",
            "analytics.retention": "Rétention des Utilisateurs",
            "analytics.adoption": "Adoption des Fonctionnalités",
            "analytics.engagement": "Métriques d'Engagement",

            // Notifications
            "notifications.title": "Centre de Notifications",
            "notifications.markAllRead": "Tout Marquer comme Lu",
            "notifications.all": "Toutes",
            "notifications.unread": "Non Lues",

            // Settings
            "settings.language": "Langue",
            "settings.selectLanguage": "Sélectionner la Langue"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
