export const translations = {
  en: {
    routing: {
      invalidServer: 'Invalid server address in URL. Fallback to default server.',
      invalidTab: 'Invalid tab in URL. Fallback to Bots tab.',
      invalidBot: 'Invalid bot identifier in URL.'
    },
    auth: {
      title: 'Crypto Arbitrage',
      subtitle: 'Bots Control',
      login: 'Login',
      password: 'Password',
      loginPlaceholder: 'Enter login',
      passwordPlaceholder: 'Enter password',
      signIn: 'Sign In',
      invalidCredentials: 'Enter login and password'
    },
    header: {
      title: 'SERVER MANAGER',
      language: 'Language',
      theme: 'Theme',
      refresh: 'Refresh',
      logout: 'Logout',
      lightTheme: 'Light',
      darkTheme: 'Dark',
      administrator: 'Administrator',
      manager: 'Manager',
      viewer: 'Viewer'
    },
    tabs: {
      bots: 'Bots',
      rules: 'Rules',
      serverData: 'Server Data'
    },
    botsTab: {
      title: 'Bots info',
      apiInfo: 'API info',
      actions: 'Actions',
      startAll: 'Start all',
      stopAll: 'Stop all',
      restartAll: 'Restart all',
      startSelected: 'Start selected',
      stopSelected: 'Stop selected',
      restartSelected: 'Restart selected',
      deleteSelected: 'Delete selected',
      deleteAll: 'Delete all',
      applyingAll: 'Applying action to all bots...',
      startSelectedSuccess: 'Started {count} bot(s)',
      startSelectedError: 'Failed to start selected bots',
      stopSelectedSuccess: 'Stopped {count} bot(s)',
      stopSelectedError: 'Failed to stop selected bots',
      restartSelectedSuccess: 'Restarted {count} bot(s)',
      restartSelectedError: 'Failed to restart selected bots',
      startAllSuccess: 'All bots started',
      startAllError: 'Failed to start all bots',
      stopAllSuccess: 'All bots stopped',
      stopAllError: 'Failed to stop all bots',
      restartAllSuccess: 'All bots restarted',
      restartAllError: 'Failed to restart all bots',
      active: 'Active',
      running: 'Running',
      stopped: 'Stopped',
      openBotHint: 'Click a row to open bot details',
      loading: 'Loading...',
      port: 'Port',
      toConfig: 'To Config',
      workingServers: 'Working servers',
      notWorkingServers: 'Not working servers',
      noWorkingServers: 'No working servers',
      noNotWorkingServers: 'No offline servers',
      table: {
        id: 'ID',
        description: 'Description',
        created: 'Created',
        jobs: 'Jobs',
        arbitrages: 'Arbitrages',
        errors: 'Errors',
        avgRequestTime: 'Avg Request Time',
        lastRequestTime: 'Last Request Time',
        status: 'Status',
        control: 'Start/Stop',
        copy: 'Copy',
        delete: 'Delete'
      },
      botDescriptions: {
        'BOT-001': 'Trading bot for BTC/USD',
        'BOT-002': 'Arbitrage scanner ETH markets',
        'BOT-003': 'Market maker SOL/USDT',
        'BOT-004': 'Price aggregator',
        'BOT-005': 'Liquidity provider BNB chain'
      },
      setBot: {
        button: 'Set bot',
        title: 'Bot config',
        hint: 'Paste JSON with id, botParams and jobParams. Sends POST /setBotsRulesList to the active server and merges with existing rules.',
        back: 'Back',
        save: 'Save',
        invalidJson: 'Invalid JSON config',
        saveSuccess: 'Bot config applied on server',
        saveError: 'Failed to apply bot config on server',
        copyHint: 'Bot copy config. Change id if needed and save to create a new bot.',
        copyError: 'Bot config not found in server rules'
      },
      getConfigServer: {
        button: 'Config server',
        title: 'Config server',
        hint: 'Edit botsRulesList JSON from the active server. Save changes sends POST /setBotsRulesList and restarts updated bots.',
        cancel: 'Cancel',
        reset: 'Reset',
        copyConfig: 'Copy config',
        saveChanges: 'Save changes',
        invalidJson: 'Invalid JSON config',
        copySuccess: 'Config copied to clipboard',
        copyError: 'Failed to copy config',
        loadError: 'Failed to load server config',
        saveSuccess: 'Server config saved and bots restarted',
        saveError: 'Failed to save server config'
      },
      removeBot: {
        button: 'Remove bot',
        confirm: 'Removing {label}',
        confirmBulk: 'Removing {count} bot(s): {labels}',
        cancel: 'Cancel',
        success: 'Removed: {label}',
        successBulk: 'Removed {count} bot(s) from server rules',
        error: 'Failed to remove bot from server rules',
        errorBulk: 'Failed to remove selected bots from server rules'
      }
    },
    apiInfo: {
      title: 'Available API Endpoints',
      method: 'Type',
      path: 'Address API',
      description: 'Description',
      loading: 'Loading API list...',
      errorLoad: 'Failed to load API list'
    },
    rulesTab: {
      title: 'RULES',
      subtitle: 'Rules info',
      copyConfig: 'Copy',
      copySuccess: 'Copied to clipboard',
      copyError: 'Failed to copy',
      copyRuleConfig: 'Copy full rule config',
      copyBotRule: 'Copy bot rule',
      copyJobRule: 'Copy job rule',
      table: {
        id: 'ID',
        botRule: 'Bot Rule',
        jobRule: 'Job Rule',
        copyConfig: 'Config'
      }
    },
    serverDataTab: {
      title: 'SERVER DATA',
      serverData: {
        title: 'Server data',
        ip: 'IP',
        port: 'Port',
        status: 'Status',
        statusOnline: 'Online',
        statusOffline: 'Offline',
        statusLoading: 'Checking...'
      },
      botTypes: {
        title: 'Types of bots',
        type: 'Type',
        description: 'Description',
        types: {
          trading: 'Trading Bot',
          arbitrage: 'Arbitrage Bot',
          marketMaker: 'Market Maker',
          scanner: 'Scanner Bot',
          liquidityProvider: 'Liquidity Provider'
        },
        descriptions: {
          trading: 'Automated trading execution based on predefined strategies',
          arbitrage: 'Identifies and exploits price differences across exchanges',
          marketMaker: 'Provides liquidity by placing buy and sell orders',
          scanner: 'Monitors market conditions and sends alerts',
          liquidityProvider: 'Manages liquidity pools on DEX platforms'
        }
      },
      jobTypes: {
        title: 'Types of jobs',
        type: 'Type',
        description: 'Description',
        types: {
          priceFetch: 'Price Fetch',
          orderExecution: 'Order Execution',
          balanceCheck: 'Balance Check',
          riskAnalysis: 'Risk Analysis',
          reportGeneration: 'Report Generation',
          alertNotification: 'Alert Notification'
        },
        descriptions: {
          priceFetch: 'Retrieves current market prices from exchanges',
          orderExecution: 'Places and manages trading orders',
          balanceCheck: 'Monitors account balances and positions',
          riskAnalysis: 'Evaluates portfolio risk and exposure',
          reportGeneration: 'Creates trading reports and analytics',
          alertNotification: 'Sends notifications on market events'
        }
      }
    },
    botDetail: {
      refreshSuccess: 'Bot tab refreshed',
      refreshError: 'Failed to refresh bot tab',
      subTabs: {
        controlAndParams: 'Control and paramtrs',
        errors: 'Errors',
        chart: 'Chart',
        liveChart: 'Live Chart'
      },
      controlTab: {
        title: 'Bot control',
        status: 'Running',
        sendDataOn: 'Send data: ON',
        sendDataOff: 'Send data: OFF',
        sendDataEnable: 'Enable send-data',
        sendDataDisable: 'Disable send-data',
        copyConfig: 'Copy config',
        copyConfigSuccess: 'Config copied to clipboard',
        copyConfigError: 'Failed to copy config',
        applyingAction: 'Applying action...',
        startedSuccess: 'Bot started',
        startedError: 'Failed to start bot',
        pausedSuccess: 'Bot paused',
        pausedError: 'Failed to pause bot',
        restartedSuccess: 'Bot restarted',
        restartedError: 'Failed to restart bot',
        sendDataSuccess: 'Send-data updated',
        sendDataError: 'Failed to update send-data',
        settingsSaved: 'Settings saved',
        settingsSaveError: 'Failed to save settings',
        pause: 'Pause',
        restart: 'Restart',
        edit: 'Edit',
        editTitle: 'Edit bot',
        editHint:
          'Edit botParams and jobParams. id is always the current bot and cannot be changed here. Save updates this bot via POST /setBotsRulesList.',
        results: 'Results',
        parameter: 'Parameter',
        value: 'Value',
        fields: {
          id: 'ID',
          status: 'Status',
          running: 'Running',
          createdAt: 'Created At',
          jobCount: 'Job Count',
          errorCount: 'Error Count',
          lastLatency: 'Last Latency',
          lastJobTimeStart: 'Last Job Start',
          lastJobTimeFinish: 'Last Job Finish',
          sendData: 'Send Data',
          lastJobResult: 'Last Job Result',
          botParams: 'Bot Params',
          jobParams: 'Job Params'
        },
        modal: {
          title: 'Edit Bot Settings',
          botParams: 'Bot params',
          jobParams: 'Job params',
          save: 'Save',
          reset: 'Reset',
          cancel: 'Cancel'
        }
      },
      arbitrageTab: {
        noData: 'No Data To Show',
        block: 'block',
        profit: 'profit',
        time: 'time',
        spend: 'spend',
        sentBuyGas: 'sentBuyGas',
        sentSellGas: 'sentSellGas',
        routesIn: 'routesIn',
        routesOut: 'routesOut'
      },
      errorsTab: {
        title: 'Errors',
        time: 'Time',
        duration: 'Duration (ms)',
        errorCode: 'Error Code',
        errorMessage: 'Error Message'
      },
      chartTab: {
        loading: 'Loading chart...',
        noData: 'No chart data',
        noLiveData: 'No live data',
        waitingFirstTick: 'Waiting for first live tick...',
        noTickYet: 'No live messages received yet',
        receivedAt: 'Received at',
        messageTime: 'Message time',
        delay: 'Delay',
        reconnecting: 'Reconnecting live feed...',
        reconnectFailed: 'Live feed reconnect failed',
        missingJobParams: 'Missing source/token parameters in bot job config',
        keysNotFound: 'Invalid jobParams: source/token pair is required',
        noHistoricalPoints: 'No historical points returned by price API',
        loadError: 'Failed to load chart data',
        liveLoadError: 'Failed to load live chart data',
        socketErrorPrefix: 'Live socket connection failed',
        serverLiveTitle: 'Direct Server Feed',
        serverLiveDescription: 'Local Socket.IO /store stream from arbiDexServerBots. No replay or history, only new ticks after subscribe.',
        marketLiveTitle: 'Market Service Feed',
        marketLiveDescription: 'Proxy Socket.IO /prices stream from market data service. Starts from page open and shows only new ticks.'
      }
    }
  },
  ru: {
    routing: {
      invalidServer: 'Невалидный адрес сервера в URL. Выполнен переход на сервер по умолчанию.',
      invalidTab: 'Невалидная вкладка в URL. Выполнен переход на вкладку Боты.',
      invalidBot: 'Невалидный идентификатор бота в URL.'
    },
    auth: {
      title: 'Crypto Arbitrage',
      subtitle: 'Управление ботами',
      login: 'Логин',
      password: 'Пароль',
      loginPlaceholder: 'Введите логин',
      passwordPlaceholder: 'Введите пароль',
      signIn: 'Войти',
      invalidCredentials: 'Введите логин и пароль'
    },
    header: {
      title: 'МЕНЕДЖЕР СЕРВЕРОВ',
      language: 'Язык',
      theme: 'Тема',
      refresh: 'Обновить',
      logout: 'Выход',
      lightTheme: 'Светлая',
      darkTheme: 'Тёмная',
      administrator: 'Администратор',
      manager: 'Менеджер',
      viewer: 'Наблюдатель'
    },
    tabs: {
      bots: 'Боты',
      rules: 'Правила',
      serverData: 'Данные Сервера'
    },
    botsTab: {
      title: 'Информация о ботах',
      apiInfo: 'Информация API',
      actions: 'Действия',
      startAll: 'Старт всех',
      stopAll: 'Стоп всех',
      restartAll: 'Перезапуск всех',
      startSelected: 'Старт выбранных',
      stopSelected: 'Стоп выбранных',
      restartSelected: 'Перезапуск выбранных',
      deleteSelected: 'Удалить выбранные',
      deleteAll: 'Удалить всех',
      applyingAll: 'Применение действия ко всем ботам...',
      startSelectedSuccess: 'Запущено ботов: {count}',
      startSelectedError: 'Не удалось запустить выбранных ботов',
      stopSelectedSuccess: 'Остановлено ботов: {count}',
      stopSelectedError: 'Не удалось остановить выбранных ботов',
      restartSelectedSuccess: 'Перезапущено ботов: {count}',
      restartSelectedError: 'Не удалось перезапустить выбранных ботов',
      startAllSuccess: 'Все боты запущены',
      startAllError: 'Не удалось запустить всех ботов',
      stopAllSuccess: 'Все боты остановлены',
      stopAllError: 'Не удалось остановить всех ботов',
      restartAllSuccess: 'Все боты перезапущены',
      restartAllError: 'Не удалось перезапустить всех ботов',
      active: 'Активность',
      running: 'Запущен',
      stopped: 'Остановлен',
      openBotHint: 'Нажмите на строку для открытия бота',
      loading: 'Загрузка...',
      port: 'Порт',
      toConfig: 'К конфигу',
      workingServers: 'Работающие серверы',
      notWorkingServers: 'Не работающие серверы',
      noWorkingServers: 'Нет работающих серверов',
      noNotWorkingServers: 'Нет неработающих серверов',
      table: {
        id: 'ID',
        description: 'Описание',
        created: 'Создан',
        jobs: 'Задачи',
        arbitrages: 'Арбитражи',
        errors: 'Ошибки',
        avgRequestTime: 'Среднее время запроса',
        lastRequestTime: 'Последнее время запроса',
        status: 'Статус',
        control: 'Старт/Стоп',
        copy: 'Copy',
        delete: 'Удалить'
      },
      botDescriptions: {
        'BOT-001': 'Торговый бот для BTC/USD',
        'BOT-002': 'Сканер арбитража рынков ETH',
        'BOT-003': 'Маркет-мейкер SOL/USDT',
        'BOT-004': 'Агрегатор цен',
        'BOT-005': 'Провайдер ликвидности BNB chain'
      },
      setBot: {
        button: 'Set bot',
        title: 'Конфиг бота',
        hint: 'Вставьте JSON с полями id, botParams и jobParams. Отправляет POST /setBotsRulesList на активный сервер и объединяет с существующими правилами.',
        back: 'Назад',
        save: 'Сохранить',
        invalidJson: 'Некорректный JSON конфиг',
        saveSuccess: 'Конфиг бота применён на сервере',
        saveError: 'Не удалось применить конфиг бота на сервере',
        copyHint: 'Конфиг копии бота. При необходимости измените id и сохраните, чтобы создать нового бота.',
        copyError: 'Конфиг бота не найден в правилах сервера'
      },
      getConfigServer: {
        button: 'Config server',
        title: 'Config server',
        hint: 'Редактируйте JSON botsRulesList с активного сервера. Save changes отправляет POST /setBotsRulesList и перезапускает обновлённых ботов.',
        cancel: 'Отмена',
        reset: 'Сброс',
        copyConfig: 'Copy config',
        saveChanges: 'Save changes',
        invalidJson: 'Некорректный JSON конфиг',
        copySuccess: 'Конфиг скопирован в буфер обмена',
        copyError: 'Не удалось скопировать конфиг',
        loadError: 'Не удалось загрузить конфиг сервера',
        saveSuccess: 'Конфиг сервера сохранён, боты перезапущены',
        saveError: 'Не удалось сохранить конфиг сервера'
      },
      removeBot: {
        button: 'Удалить бота',
        confirm: 'Удаление: {label}',
        confirmBulk: 'Удаление {count} бот(ов): {labels}',
        cancel: 'Отмена',
        success: 'Удалён: {label}',
        successBulk: 'Удалено ботов: {count}',
        error: 'Не удалось удалить бота из правил на сервере',
        errorBulk: 'Не удалось удалить выбранных ботов из правил на сервере'
      }
    },
    apiInfo: {
      title: 'Доступные API эндпоинты',
      method: 'Тип',
      path: 'Адрес API',
      description: 'Описание',
      loading: 'Загрузка списка API...',
      errorLoad: 'Не удалось загрузить список API'
    },
    rulesTab: {
      title: 'ПРАВИЛА',
      subtitle: 'Информация о правилах',
      copyConfig: 'Копировать',
      copySuccess: 'Скопировано в буфер обмена',
      copyError: 'Не удалось скопировать',
      copyRuleConfig: 'Копировать полный конфиг правила',
      copyBotRule: 'Копировать правило бота',
      copyJobRule: 'Копировать правило задачи',
      table: {
        id: 'ID',
        botRule: 'Правило бота',
        jobRule: 'Правило задачи',
        copyConfig: 'Конфиг'
      }
    },
    serverDataTab: {
      title: 'ДАННЫЕ СЕРВЕРА',
      serverData: {
        title: 'Данные сервера',
        ip: 'IP',
        port: 'Port',
        status: 'Статус',
        statusOnline: 'Online',
        statusOffline: 'Offline',
        statusLoading: 'Проверка...'
      },
      botTypes: {
        title: 'Типы ботов',
        type: 'Тип',
        description: 'Описание',
        types: {
          trading: 'Торговый бот',
          arbitrage: 'Арбитражный бот',
          marketMaker: 'Маркет-мейкер',
          scanner: 'Бот-сканер',
          liquidityProvider: 'Провайдер ликвидности'
        },
        descriptions: {
          trading: 'Автоматическое выполнение торговых операций по заданным стратегиям',
          arbitrage: 'Определяет и использует разницу цен на биржах',
          marketMaker: 'Обеспечивает ликвидность путём размещения ордеров на покупку и продажу',
          scanner: 'Мониторит рыночные условия и отправляет оповещения',
          liquidityProvider: 'Управляет пулами ликвидности на DEX платформах'
        }
      },
      jobTypes: {
        title: 'Типы задач',
        type: 'Тип',
        description: 'Описание',
        types: {
          priceFetch: 'Получение цен',
          orderExecution: 'Исполнение ордеров',
          balanceCheck: 'Проверка баланса',
          riskAnalysis: 'Анализ рисков',
          reportGeneration: 'Генерация отчётов',
          alertNotification: 'Уведомления'
        },
        descriptions: {
          priceFetch: 'Получает текущие рыночные цены с бирж',
          orderExecution: 'Размещает и управляет торговыми ордерами',
          balanceCheck: 'Отслеживает балансы счетов и позиции',
          riskAnalysis: 'Оценивает портфельные риски и экспозицию',
          reportGeneration: 'Создаёт торговые отчёты и аналитику',
          alertNotification: 'Отправляет уведомления о рыночных событиях'
        }
      }
    },
    botDetail: {
      refreshSuccess: 'Данные вкладки бота обновлены',
      refreshError: 'Не удалось обновить данные вкладки бота',
      subTabs: {
        controlAndParams: 'Управление и параметры',
        errors: 'Ошибки',
        chart: 'График',
        liveChart: 'Живой график'
      },
      controlTab: {
        title: 'Управление ботом',
        status: 'Работает',
        sendDataOn: 'Отправка данных: ВКЛ',
        sendDataOff: 'Отправка данных: ВЫКЛ',
        sendDataEnable: 'Включить отправку данных',
        sendDataDisable: 'Отключить отправку данных',
        copyConfig: 'конфиг',
        copyConfigSuccess: 'Конфиг скопирован в буфер обмена',
        copyConfigError: 'Не удалось скопировать конфиг',
        applyingAction: 'Применение действия...',
        startedSuccess: 'Бот запущен',
        startedError: 'Не удалось запустить бота',
        pausedSuccess: 'Бот остановлен',
        pausedError: 'Не удалось остановить бота',
        restartedSuccess: 'Бот перезапущен',
        restartedError: 'Не удалось перезапустить бота',
        sendDataSuccess: 'Режим отправки данных обновлен',
        sendDataError: 'Не удалось обновить режим отправки данных',
        settingsSaved: 'Настройки сохранены',
        settingsSaveError: 'Не удалось сохранить настройки',
        pause: 'Пауза',
        restart: 'Перезапуск',
        edit: 'Изменить',
        editTitle: 'Редактирование бота',
        editHint:
          'Редактируйте botParams и jobParams. id всегда остаётся текущим ботом и здесь не меняется. Сохранение обновляет этого бота через POST /setBotsRulesList.',
        results: 'Результаты',
        parameter: 'Параметр',
        value: 'Значение',
        fields: {
          id: 'ID',
          status: 'Статус',
          running: 'Запущен',
          createdAt: 'Создан',
          jobCount: 'Кол-во задач',
          errorCount: 'Кол-во ошибок',
          lastLatency: 'Последняя задержка',
          lastJobTimeStart: 'Начало последней задачи',
          lastJobTimeFinish: 'Завершение последней задачи',
          sendData: 'Отправка данных',
          lastJobResult: 'Результат последней задачи',
          botParams: 'Параметры бота',
          jobParams: 'Параметры задачи'
        },
        modal: {
          title: 'Настройки бота',
          botParams: 'Параметры бота',
          jobParams: 'Параметры задачи',
          save: 'Сохранить',
          reset: 'Сбросить',
          cancel: 'Отмена'
        }
      },
      arbitrageTab: {
        noData: 'Нет данных для отображения',
        block: 'блок',
        profit: 'прибыль',
        time: 'время',
        spend: 'потрачено',
        sentBuyGas: 'газ покупки',
        sentSellGas: 'газ продажи',
        routesIn: 'маршруты вход',
        routesOut: 'маршруты выход'
      },
      errorsTab: {
        title: 'Ошибки',
        time: 'Время',
        duration: 'Длительность (мс)',
        errorCode: 'Код ошибки',
        errorMessage: 'Сообщение об ошибке'
      },
      chartTab: {
        loading: 'Загрузка графика...',
        noData: 'Нет данных графика',
        noLiveData: 'Нет live-данных',
        waitingFirstTick: 'Ожидание первого live-тика...',
        noTickYet: 'Live-сообщения еще не приходили',
        receivedAt: 'Получено в',
        messageTime: 'Время в сообщении',
        delay: 'Задержка',
        reconnecting: 'Переподключение live-потока...',
        reconnectFailed: 'Не удалось переподключиться к live-потоку',
        missingJobParams: 'В конфигурации задачи отсутствуют source/token параметры',
        keysNotFound: 'Некорректные jobParams: требуется пара source/token',
        noHistoricalPoints: 'API цен не вернул исторические точки',
        loadError: 'Не удалось загрузить данные графика',
        liveLoadError: 'Не удалось загрузить live-данные графика',
        socketErrorPrefix: 'Ошибка подключения к live-сокету',
        serverLiveTitle: 'Прямой поток с сервера',
        serverLiveDescription: 'Локальный Socket.IO /store поток из arbiDexServerBots. Без replay и истории, только новые тики после subscribe.',
        marketLiveTitle: 'Поток market сервиса',
        marketLiveDescription: 'Проксированный Socket.IO /prices поток из market data сервиса. Стартует с момента открытия страницы и показывает только новые тики.'
      }
    }
  }
};

export type Language = 'en' | 'ru';
export type TranslationKeys = typeof translations.en;
