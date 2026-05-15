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
      startAll: 'Start all',
      stopAll: 'Stop all',
      restartAll: 'Restart all',
      applyingAll: 'Applying action to all bots...',
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
      table: {
        id: 'ID',
        description: 'Description',
        created: 'Created',
        jobs: 'Jobs',
        arbitrages: 'Arbitrages',
        errors: 'Errors',
        avgRequestTime: 'Avg Request Time',
        lastRequestTime: 'Last Request Time',
        status: 'Status'
      },
      botDescriptions: {
        'BOT-001': 'Trading bot for BTC/USD',
        'BOT-002': 'Arbitrage scanner ETH markets',
        'BOT-003': 'Market maker SOL/USDT',
        'BOT-004': 'Price aggregator',
        'BOT-005': 'Liquidity provider BNB chain'
      }
    },
    rulesTab: {
      title: 'RULES',
      subtitle: 'Rules info',
      table: {
        id: 'ID',
        botRule: 'Bot Rule',
        jobRule: 'Job Rule'
      }
    },
    serverDataTab: {
      title: 'SERVER DATA',
      serverData: {
        title: 'Server data',
        ip: 'IP',
        authData: 'Authorization Data',
        version: 'Version',
        timeToClose: 'Time To Close',
        timeAfterClose: 'Time After Close',
        bots: 'Bots',
        status: 'Status'
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
      subTabs: {
        controlAndParams: 'Control and paramtrs',
        arbitrageId: 'Arbitrage ID',
        errors: 'Errors',
        job: 'Job',
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
      jobTab: {
        title: 'Job Params',
        launch: 'Launch',
        rerun: 'Rerun',
        delete: 'Delete',
        return: 'Return',
        saving: 'Saving...',
        deleteConfirm: 'Clear current editor content?',
        savedSuccess: 'Job settings saved',
        savedError: 'Failed to save job settings',
        rerunSuccess: 'Job saved and bot restarted',
        rerunError: 'Failed to restart bot after save'
      },
      chartTab: {
        loading: 'Loading chart...',
        noData: 'No chart data',
        noLiveData: 'No live data',
        reconnecting: 'Reconnecting live feed...',
        reconnectFailed: 'Live feed reconnect failed',
        missingJobParams: 'Missing source/token parameters in bot job config',
        keysNotFound: 'Price keys for source/token pair were not found',
        noHistoricalPoints: 'No historical points returned by price API',
        loadError: 'Failed to load chart data',
        liveLoadError: 'Failed to load live chart data',
        socketErrorPrefix: 'Live socket connection failed'
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
      startAll: 'Старт всех',
      stopAll: 'Стоп всех',
      restartAll: 'Перезапуск всех',
      applyingAll: 'Применение действия ко всем ботам...',
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
      table: {
        id: 'ID',
        description: 'Описание',
        created: 'Создан',
        jobs: 'Задачи',
        arbitrages: 'Арбитражи',
        errors: 'Ошибки',
        avgRequestTime: 'Среднее время запроса',
        lastRequestTime: 'Последнее время запроса',
        status: 'Статус'
      },
      botDescriptions: {
        'BOT-001': 'Торговый бот для BTC/USD',
        'BOT-002': 'Сканер арбитража рынков ETH',
        'BOT-003': 'Маркет-мейкер SOL/USDT',
        'BOT-004': 'Агрегатор цен',
        'BOT-005': 'Провайдер ликвидности BNB chain'
      }
    },
    rulesTab: {
      title: 'ПРАВИЛА',
      subtitle: 'Информация о правилах',
      table: {
        id: 'ID',
        botRule: 'Правило бота',
        jobRule: 'Правило задачи'
      }
    },
    serverDataTab: {
      title: 'ДАННЫЕ СЕРВЕРА',
      serverData: {
        title: 'Данные сервера',
        ip: 'IP',
        authData: 'Данные авторизации',
        version: 'Версия',
        timeToClose: 'Время до закрытия',
        timeAfterClose: 'Время после закрытия',
        bots: 'Боты',
        status: 'Статус'
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
      subTabs: {
        controlAndParams: 'Управление и параметры',
        arbitrageId: 'ID Арбитража',
        errors: 'Ошибки',
        job: 'Задача',
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
      jobTab: {
        title: 'Параметры задачи',
        launch: 'Запустить',
        rerun: 'Перезапустить',
        delete: 'Удалить',
        return: 'Вернуть',
        saving: 'Сохранение...',
        deleteConfirm: 'Очистить текущий текст в редакторе?',
        savedSuccess: 'Параметры задачи сохранены',
        savedError: 'Не удалось сохранить параметры задачи',
        rerunSuccess: 'Задача сохранена и бот перезапущен',
        rerunError: 'Не удалось перезапустить бота после сохранения'
      },
      chartTab: {
        loading: 'Загрузка графика...',
        noData: 'Нет данных графика',
        noLiveData: 'Нет live-данных',
        reconnecting: 'Переподключение live-потока...',
        reconnectFailed: 'Не удалось переподключиться к live-потоку',
        missingJobParams: 'В конфигурации задачи отсутствуют source/token параметры',
        keysNotFound: 'Ключи цен для выбранной пары не найдены',
        noHistoricalPoints: 'API цен не вернул исторические точки',
        loadError: 'Не удалось загрузить данные графика',
        liveLoadError: 'Не удалось загрузить live-данные графика',
        socketErrorPrefix: 'Ошибка подключения к live-сокету'
      }
    }
  }
};

export type Language = 'en' | 'ru';
export type TranslationKeys = typeof translations.en;
