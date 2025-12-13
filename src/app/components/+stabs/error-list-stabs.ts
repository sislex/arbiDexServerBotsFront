import type {ColDef} from 'ag-grid-community';

export const errorListStabs_1 = [
  {
    id: 1,
    time: "2024-01-15T10:30:00Z",
    status: "success",
    message: "Операция выполнена успешно"
  }
];

export const errorListStabs_2 = [
  {
    id: 1,
    time: "2024-01-15T10:30:00Z",
    status: "success",
    message: "Операция выполнена успешно"
  },
  {
    id: 2,
    time: "2024-01-15T10:31:15Z",
    status: "error",
    message: "Ошибка валидации входных данных: поле 'email' обязательно для заполнения"
  },
  {
    id: 3,
    time: "2024-01-15T10:32:45Z",
    status: "warning",
    message: "Внимание: некоторые данные были автоматически исправлены"
  },
  {
    id: 4,
    time: "2024-01-15T10:33:20Z",
    status: "success",
    message: "Данные успешно сохранены в базу данных"
  },
  {
    id: 5,
    time: "2024-01-15T10:34:10Z",
    status: "error",
    message: "Серверная ошибка: превышено время ожидания ответа от сервиса авторизации"
  }
];

export const errorListStabs_3 = [
  {
    id: 1,
    time: "2024-01-15T10:30:00Z",
    status: "success",
    message: "Операция выполнена успешно"
  },
  {
    id: 2,
    time: "2024-01-15T10:31:15Z",
    status: "error",
    message: "Ошибка валидации входных данных: поле 'email' обязательно для заполнения"
  },
  {
    id: 3,
    time: "2024-01-15T10:32:45Z",
    status: "warning",
    message: "Внимание: некоторые данные были автоматически исправлены"
  },
  {
    id: 4,
    time: "2024-01-15T10:33:20Z",
    status: "success",
    message: "Данные успешно сохранены в базу данных"
  },
  {
    id: 5,
    time: "2024-01-15T10:34:10Z",
    status: "error",
    message: "Серверная ошибка: превышено время ожидания ответа от сервиса авторизации"
  },
  {
    id: 6,
    time: "2024-01-15T10:35:30Z",
    status: "success",
    message: "Пользователь успешно аутентифицирован"
  },
  {
    id: 7,
    time: "2024-01-15T10:36:45Z",
    status: "error",
    message: "Ошибка базы данных: нарушение уникальности ключа при попытке вставки дублирующей записи"
  },
  {
    id: 8,
    time: "2024-01-15T10:37:20Z",
    status: "warning",
    message: "Не все обязательные поля заполнены, но операция продолжена"
  },
  {
    id: 9,
    time: "2024-01-15T10:38:15Z",
    status: "success",
    message: "Отчет сгенерирован и отправлен на почту"
  },
  {
    id: 10,
    time: "2024-01-15T10:39:05Z",
    status: "error",
    message: "Критическая ошибка: недостаточно прав для выполнения данной операции. Обратитесь к администратору системы"
  }
];

export const errorListColDefs: ColDef[] = [
  {
    field: "#",
    headerName: '#',
    width: 50,
    valueGetter: params => {
      if (!params.node || params.node.rowIndex == null) return '';
      return params.node.rowIndex + 1;
    },
  },
  {
    field: 'createdAt',
    headerName: 'Time',
    flex: 1,
    valueFormatter: params => {
      if (!params.value) return '';
      const date = new Date(params.value);
      return date.toLocaleString('ru-RU');
    },
  },
  {
    field: "durationMs",
    headerName: 'Duration (ms)',
    flex: 1,
  },
  {
    field: "errorCode",
    headerName: 'Error Code',
    flex: 1,
  },
  {
    field: "message",
    headerName: 'Error Message',
    flex: 3,
    cellStyle: { textAlign: 'left'},
    autoHeight: true,
    wrapText: true,
  },
];

export const errorListDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center'},
  headerClass: 'align-center',
  suppressMovable: true,
};
