export const translations = {
  en: {
    // Navigation / Sidebar
    employees: "Employees",
    skills: "Skills",
    languages: "Languages",
    cvs: "CVs",
    settings: "Settings",

    // Settings
    appearance: "Appearance",
    language: "Language",
    deviceSettings: "Device settings",
    light: "Light",
    dark: "Dark",
    english: "English",
    russian: "Russian",

    // Common & Tables
    search: "Search",
    createCv: "CREATE CV",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    department: "Department",
    position: "Position",
    name: "Name",
    education: "Education",
    employee: "Employee",

    // Tabs & Profile
    profile: "Profile",
    uploadAvatar: "Upload avatar image",
    avatarRequirements: "png, jpg or gif no more than 0.5MB",
    update: "UPDATE",
    memberSince: "A member since",

    // Actions
    addSkill: "ADD SKILL",
    removeSkills: "REMOVE SKILLS",
    addLanguage: "ADD LANGUAGE",
    removeLanguages: "REMOVE LANGUAGES",
    edit: "Edit",
    delete: "Delete",
  },
  ru: {
    // Navigation / Sidebar
    employees: "Сотрудники",
    skills: "Навыки",
    languages: "Языки",
    cvs: "Резюме",
    settings: "Настройки",

    // Settings
    appearance: "Тема оформления",
    language: "Язык",
    deviceSettings: "Системная тема",
    light: "Светлая",
    dark: "Тёмная",
    english: "Английский",
    russian: "Русский",

    // Common & Tables
    search: "Поиск",
    createCv: "СОЗДАТЬ CV",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "Email",
    password: "Пароль",
    department: "Отдел",
    position: "Должность",
    name: "Имя",
    education: "Образование",
    employee: "Сотрудник",

    // Tabs & Profile
    profile: "Профиль",
    uploadAvatar: "Загрузить аватар",
    avatarRequirements: "png, jpg или gif не более 0.5 МБ",
    update: "ОБНОВИТЬ",
    memberSince: "На сайте с",

    // Actions
    addSkill: "ДОБАВИТЬ НАВЫК",
    removeSkills: "УДАЛИТЬ НАВЫКИ",
    addLanguage: "ДОБАВИТЬ ЯЗЫК",
    removeLanguages: "УДАЛИТЬ ЯЗЫКИ",
    edit: "Редактировать",
    delete: "Удалить",
  },
} as const;

export type Language = "en" | "ru";
export type TranslationKeys = keyof typeof translations.en;
