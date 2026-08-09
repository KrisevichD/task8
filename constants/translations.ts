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
    details: "Details",
    projects: "Projects",
    preview: "Preview",

    // Actions
    addSkill: "ADD SKILL",
    removeSkills: "REMOVE SKILLS",
    addLanguage: "ADD LANGUAGE",
    removeLanguages: "REMOVE LANGUAGES",
    edit: "Edit",
    delete: "Delete",
    add: "add",
    cancel: "cancel",
    skill: "Skill",
    remove: "remove",
    continue: "continue",

    // Skills
    novise: "Novice",
    advanced: "Advanced",
    competent: "Competent",
    proficient: "Proficient",
    expert: "Expert",
    skillMastery: "skill mastery",
    toastErrorSkill: "Choose skill",

    // Languages
    native: "Native",
    languageProficiency: "Language proficiency",
    toastErrorLanguage: "Choose language",

    // Alert
    alertWarning: "Are you absolutely sure?",
    alertSkills: "This will clear list of skills!",
    alertLanguages: "This will clear list of languages!",

    // CV Details
    description: "Description",

    // CV Projects
    project: "Project",
    domain: "Domain",
    startDate: "Start date",
    endDate: "End date",
    environment: "Environment",
    responcibilities: "Responcibilities",
    noMatchesFound: "No matches found",

    // CV Preview
    exportPdf: "Export PDF",
    languagesProficiency: "Languages proficiency",
    domains: "Domains",
    projectRoles: "Project roles",
    period: "Period",
    professionalSkills: "Professional skills",
    experienceInYears: "Experience in years",
    lastUsed: "Last used",

    // Toast
    isRequired: " is requiered!",
    adding: "Adding",
    deleting: "Deleting",
    updating: "Updating",
    successfully: "succsessfully",
    errorMessage: "Error: ",
    added: "added",
    deleted: "deleted",
    updated: "updated",
    cv: "CV",
    downloading: "Downloading",
    downloaded: "Downloaded",
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
    details: "Детали",
    projects: "Проекты",
    preview: "Предпросмотр",

    // Actions
    addSkill: "ДОБАВИТЬ НАВЫК",
    removeSkills: "УДАЛИТЬ НАВЫКИ",
    addLanguage: "ДОБАВИТЬ ЯЗЫК",
    removeLanguages: "УДАЛИТЬ ЯЗЫКИ",
    edit: "Редактировать",
    delete: "Удалить",
    add: "добавить",
    cancel: "отменить",
    skill: "Навык",
    remove: "удалить",
    continue: "продолжить",

    // Skills
    novise: "Начинающий",
    advanced: "Продвинутый",
    competent: "Компетентный",
    proficient: "Опытный",
    expert: "Эксперт",
    skillMastery: "Владение навыком",
    toastErrorSkill: "Выберите навык",

    // Languages
    native: "Родной",
    languageProficiency: "Знание языка",
    toastErrorLanguage: "Выберите язык",

    // Alert
    alertWarning: "Вы точно уверены?",
    alertSkills: "Это действие полностью очистит весь список навыков!",
    alertLanguages: "Это действие полностью очистит весь список языков!",

    // CV Details
    description: "Описание",

    // CV Projects
    project: "Проект",
    domain: "Сфера",
    startDate: "Дата начала",
    endDate: "Дата конца",
    environment: "Стек",
    responcibilities: "Ответственности",
    noMatchesFound: "Совпадений не найдено",

    // CV Preview
    exportPdf: "Экспортировать PDF",
    languagesProficiency: "Знание языков",
    domains: "Сферы",
    projectRoles: "Роли в проекте",
    period: "Период",
    professionalSkills: "Профессиональные навыки",
    experienceInYears: "Опыт в годах",
    lastUsed: "Последний опыт",

    // Toast
    isRequired: " - обязательное поле!",
    adding: "Добавляем",
    deleting: "Удаляем",
    updating: "Обновляем",
    downloading: "Экспортируем",
    successfully: "успешно",
    added: "добавлен",
    deleted: "удален",
    updated: "обновлен",
    downloaded: "экспортирован",
    errorMessage: "Ошибка: ",
  },
} as const;

export type Language = "en" | "ru";
export type TranslationKeys = keyof typeof translations.en;
