export type Language = 'en' | 'ru' | 'uk' | 'es' | 'fr';

export const translations = {
    en: {
        // Language code for date formatting
        language: 'en',
        // Header
        gameTitle: "Sliding Puzzle",
        gameSubtitle: "Classic number puzzle game",
        size: "Size",
        mainMenu: "Main Menu",

        // Game UI
        time: "Time",
        moves: "Moves",
        score: "Score",
        newGame: "New Game",
        pause: "Pause",
        resume: "Resume",
        leaderboard: "Leaderboard",

        // Size Selector
        chooseSize: "Choose Game Size",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        sizeDescription: {
            3: "Perfect for beginners",
            4: "Classic sliding puzzle",
            5: "Challenge for experts"
        },
        startGame: "Start Game",

        // Win Modal
        congratulations: "Congratulations!",
        youWon: "You solved the puzzle!",
        yourTime: "Your time",
        yourMoves: "Your moves",
        yourScore: "Your score",
        enterName: "Enter your name",
        saveScore: "Save Score",
        playAgain: "Play Again",

        // Leaderboard
        leaderboardTitle: "Leaderboard",
        filterBySize: "Filter by size",
        allSizes: "All sizes",
        filterByPeriod: "Filter by period",
        thisWeek: "This week",
        thisMonth: "This month",
        allTime: "All time",
        rank: "Rank",
        name: "Name",
        period: "Period",
        close: "Close",

        // Instructions
        mobileInstructions: "Tap on a tile or use swipes to move",
        instructions: "Use arrow keys, mouse clicks or swipes on mobile devices",

        // Footer
        footerText: "Sliding Puzzle Game • Arrange numbers from 1 to",
        footerInorder: "in order",

        // Demo mode
        demoMode: "Server not connected",
        demoDescription: "Scores are saved locally. Cloud leaderboard server not connected.",

        // Game status
        pausedMessage: "⏸️ Game Paused",
        pausedDescription: "Press \"Resume\" to continue the game",
        howToPlay: "How to Play",
        gameInstructions: "• Click on tiles next to empty space to move them•• Use arrow keys on keyboard for control•• Use swipes on mobile devices•• Arrange numbers in order from 1 to•• Faster time and fewer moves = more points!",
        // Empty state messages
        noResults: "No results found for selected filters",
        playFirst: "Play first and become a leader!"
    },

    ru: {
        // Language code for date formatting
        language: 'ru',
        // Header
        gameTitle: "Пятнашки",
        gameSubtitle: "Классическая головоломка с числами",
        size: "Размер",
        mainMenu: "Главное меню",

        // Game UI
        time: "Время",
        moves: "Ходы",
        score: "Очки",
        newGame: "Новая игра",
        pause: "Пауза",
        resume: "Продолжить",
        leaderboard: "Таблица лидеров",

        // Size Selector
        chooseSize: "Выберите размер игры",
        easy: "Легко",
        medium: "Средне",
        hard: "Сложно",
        sizeDescription: {
            3: "Идеально для новичков",
            4: "Классические пятнашки",
            5: "Вызов для экспертов"
        },
        startGame: "Начать игру",

        // Win Modal
        congratulations: "Поздравляем!",
        youWon: "Вы решили головоломку!",
        yourTime: "Ваше время",
        yourMoves: "Ваши ходы",
        yourScore: "Ваши очки",
        enterName: "Введите ваше имя",
        saveScore: "Сохранить результат",
        playAgain: "Играть снова",

        // Leaderboard
        leaderboardTitle: "Таблица лидеров",
        filterBySize: "Фильтр по размеру",
        allSizes: "Все размеры",
        filterByPeriod: "Фильтр по периоду",
        thisWeek: "Эта неделя",
        thisMonth: "Этот месяц",
        allTime: "Все время",
        rank: "Место",
        name: "Имя",
        period: "Период",
        close: "Закрыть",

        // Instructions
        mobileInstructions: "Нажмите на плитку или используйте свайпы для перемещения",
        instructions: "Используйте клавиши стрелок, клики мышью или свайпы на мобильных устройствах",

        // Footer
        footerText: "Игра \"Пятнашки\" • Расставьте числа от 1 до",
        footerInOrder: "по порядку",

        // Demo mode
        demoMode: "Сервер не подключен",
        demoDescription: "Результаты сохраняются локально. Не подключено сервер облачного хранения данных (таблица лидеров).",

        // Game status
        pausedMessage: "⏸️ Игра на паузе",
        pausedDescription: "Нажмите \"Продолжить\" для возобновления игры",
        howToPlay: "Как играть",
        gameInstructions: "• Нажимайте на плитки рядом с пустой клеткой для их перемещения•• Используйте стрелки на клавиатуре для управления•• На мобильных устройствах используйте свайпы•• Расставьте числа по порядку от 1 до•• Чем быстрее и меньше ходов — тем больше очков!",
        chooseSizeDescription: "Выберите размер поля перед началом новой игры",

        // Empty state messages
        noResults: "Пока нет результатов для выбранных фильтров",
        playFirst: "Сыграйте первым и станьте лидером!"
    },

    uk: {
        // Language code for date formatting
        language: 'uk',
        // Header
        gameTitle: "П'ятнашки",
        gameSubtitle: "Класична головоломка з числами",
        size: "Розмір",
        mainMenu: "Головне меню",

        // Game UI
        time: "Час",
        moves: "Ходи",
        score: "Очки",
        newGame: "Нова гра",
        pause: "Пауза",
        resume: "Продовжити",
        leaderboard: "Таблиця лідерів",

        // Size Selector
        chooseSize: "Оберіть розмір гри",
        easy: "Легко",
        medium: "Середньо",
        hard: "Складно",
        sizeDescription: {
            3: "Ідеально для початківців",
            4: "Класичні п'ятнашки",
            5: "Виклик для експертів"
        },
        startGame: "Почати гру",

        // Win Modal
        congratulations: "Вітаємо!",
        youWon: "Ви розв'язали головоломку!",
        yourTime: "Ваш час",
        yourMoves: "Ваші ходи",
        yourScore: "Ваші очки",
        enterName: "Введіть ваше ім'я",
        saveScore: "Зберегти результат",
        playAgain: "Грати знову",

        // Leaderboard
        leaderboardTitle: "Таблиця лідерів",
        filterBySize: "Фільтр за розміром",
        allSizes: "Всі розміри",
        filterByPeriod: "Фільтр за періодом",
        thisWeek: "Цей тиждень",
        thisMonth: "Цей місяць",
        allTime: "Весь час",
        rank: "Місце",
        name: "Ім'я",
        period: "Період",
        close: "Закрити",

        // Instructions
        mobileInstructions: "Натисніть на плитку або використовуйте свайпи для переміщення",
        instructions: "Використовуйте клавіші стрілок, кліки мишею або свайпи на мобільних пристроях",

        // Footer
        footerText: "Гра \"П'ятнашки\" • Розставте числа від 1 до",
        footerInOrder: "за порядком",

        // Demo mode
        demoMode: "Сервер не підключено",
        demoDescription: "Результати зберігаються локально. Не підключено сервер хмарного зберігання даних (таблиця лідерів).",

        // Game status
        pausedMessage: "⏸️ Гра на паузі",
        pausedDescription: "Натисніть \"Продовжити\" для відновлення гри",
        howToPlay: "Як грати",
        gameInstructions: "• Натискайте на плитки поруч з порожньою клітинкою для їх переміщення•• Використовуйте стрілки на клавіатурі для керування•• На мобільних пристроях використовуйте свайпи•• Розставте числа за порядком від 1 до•• Швидший час і менше ходів — більше очок!",
        chooseSizeDescription: "Оберіть розмір поля перед початком нової гри"
    },

    es: {
        // Language code for date formatting
        language: 'es',
        // Header
        gameTitle: "Puzzle Deslizante",
        gameSubtitle: "Juego clásico de rompecabezas numérico",
        size: "Tamaño",
        mainMenu: "Menú Principal",

        // Game UI
        time: "Tiempo",
        moves: "Movimientos",
        score: "Puntuación",
        newGame: "Nuevo Juego",
        pause: "Pausar",
        resume: "Reanudar",
        leaderboard: "Tabla de Líderes",

        // Size Selector
        chooseSize: "Elige el Tamaño del Juego",
        easy: "Fácil",
        medium: "Medio",
        hard: "Difícil",
        sizeDescription: {
            3: "Perfecto para principiantes",
            4: "Puzzle deslizante clásico",
            5: "Desafío para expertos"
        },
        startGame: "Comenzar Juego",

        // Win Modal
        congratulations: "¡Felicidades!",
        youWon: "¡Has resuelto el rompecabezas!",
        yourTime: "Tu tiempo",
        yourMoves: "Tus movimientos",
        yourScore: "Tu puntuación",
        enterName: "Ingresa tu nombre",
        saveScore: "Guardar Puntuación",
        playAgain: "Jugar de Nuevo",

        // Leaderboard
        leaderboardTitle: "Tabla de Líderes",
        filterBySize: "Filtrar por tamaño",
        allSizes: "Todos los tamaños",
        filterByPeriod: "Filtrar por período",
        thisWeek: "Esta semana",
        thisMonth: "Este mes",
        allTime: "Todo el tiempo",
        rank: "Posición",
        name: "Nombre",
        period: "Período",
        close: "Cerrar",

        // Instructions
        mobileInstructions: "Toca una ficha o usa deslizamientos para mover",
        instructions: "Usa las teclas de flecha, clics del ratón o deslizamientos en dispositivos móviles",

        // Footer
        footerText: "Juego de Puzzle Deslizante • Ordena los números del 1 al",
        footerInOrder: "en orden",

        // Demo mode
        demoMode: "Servidor no conectado",
        demoDescription: "Las puntuaciones se guardan localmente. Servidor de clasificación en la nube no conectado.",

        // Game status
        pausedMessage: "⏸️ Juego Pausado",
        pausedDescription: "Presiona \"Reanudar\" para continuar el juego",
        howToPlay: "Cómo Jugar",
        gameInstructions: "• Haz clic en las fichas junto al espacio vacío para moverlas•• Usa las teclas de flecha del teclado para control•• Usa deslizamientos en dispositivos móviles•• Ordena los números en orden del 1 al•• ¡Tiempo más rápido y menos movimientos = más puntos!",
        chooseSizeDescription: "Elige el tamaño del campo antes de comenzar un nuevo juego"
    },

    fr: {
        // Language code for date formatting
        language: 'fr',
        // Header
        gameTitle: "Taquin",
        gameSubtitle: "Jeu de puzzle numérique classique",
        size: "Taille",
        mainMenu: "Menu Principal",

        // Game UI
        time: "Temps",
        moves: "Mouvements",
        score: "Score",
        newGame: "Nouveau Jeu",
        pause: "Pause",
        resume: "Reprendre",
        leaderboard: "Classement",

        // Size Selector
        chooseSize: "Choisissez la Taille du Jeu",
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile",
        sizeDescription: {
            3: "Parfait pour les débutants",
            4: "Taquin classique",
            5: "Défi pour les experts"
        },
        startGame: "Commencer le Jeu",

        // Win Modal
        congratulations: "Félicitations!",
        youWon: "Vous avez résolu le puzzle!",
        yourTime: "Votre temps",
        yourMoves: "Vos mouvements",
        yourScore: "Votre score",
        enterName: "Entrez votre nom",
        saveScore: "Sauvegarder le Score",
        playAgain: "Rejouer",

        // Leaderboard
        leaderboardTitle: "Classement",
        filterBySize: "Filtrer par taille",
        allSizes: "Toutes les tailles",
        filterByPeriod: "Filtrer par période",
        thisWeek: "Cette semaine",
        thisMonth: "Ce mois",
        allTime: "Tout le temps",
        rank: "Rang",
        name: "Nom",
        period: "Période",
        close: "Fermer",

        // Instructions
        mobileInstructions: "Appuyez sur une tuile ou utilisez des balayages pour déplacer",
        instructions: "Utilisez les touches fléchées, clics de souris ou balayages sur appareils mobiles",

        // Footer
        footerText: "Jeu de Taquin • Arrangez les nombres de 1 à",
        footerInOrder: "dans l'ordre",

        // Demo mode
        demoMode: "Serveur non connecté",
        demoDescription: "Les scores sont sauvegardés localement. Serveur de classement cloud non connecté.",

        // Game status
        pausedMessage: "⏸️ Jeu en Pause",
        pausedDescription: "Appuyez sur \"Reprendre\" pour continuer le jeu",
        howToPlay: "Comment Jouer",
        gameInstructions: "• Cliquez sur les tuiles à côté de l'espace vide pour les déplacer•• Utilisez les touches fléchées du clavier pour le contrôle•• Utilisez des balayages sur appareils mobiles•• Arrangez les nombres dans l'ordre de 1 à•• Temps plus rapide et moins de mouvements = plus de points!",
        chooseSizeDescription: "Choisissez la taille du terrain avant de commencer un nouveau jeu"
    }
};

export function detectBrowserLanguage(): Language {
    if (typeof window === 'undefined') return 'en';

    const browserLang = window.navigator.language.toLowerCase();

    if (browserLang.startsWith('ru')) return 'ru';
    if (browserLang.startsWith('uk')) return 'uk';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';

    return 'en'; // Default to English
}

export function getTranslation(lang: Language, key: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}