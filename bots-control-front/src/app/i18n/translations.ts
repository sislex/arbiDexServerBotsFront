export const translations = {
  en: {
    header: {
      title: 'SERVER MANAGER',
      language: 'Language',
      theme: 'Theme',
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
        pause: 'Pause',
        restart: 'Restart',
        edit: 'Edit',
        results: 'Results',
        parameter: 'Parameter',
        value: 'Value',
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
        return: 'Return'
      }
    }
  },
  ru: {
    header: {
      title: 'МЕНЕДЖЕР СЕРВЕРОВ',
      language: 'Язык',
      theme: 'Тема',
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
        pause: 'Пауза',
        restart: 'Перезапуск',
        edit: 'Изменить',
        results: 'Результаты',
        parameter: 'Параметр',
        value: 'Значение',
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
        return: 'Вернуть'
      }
    }
  }
};

export type Language = 'en' | 'ru';
export type TranslationKeys = typeof translations.en;
