// Сначала очистим все коллекции
db.hotel_buildings.drop();
db.rooms.drop();
db.clients.drop();
db.companies.drop();
db.services.drop();
db.payments.drop();
db.bookings.drop();

// 1. Корпуса гостиницы
const buildingsData = [
  {
    name: "Корпус А",
    stars: 4,
    floors: 5,
    rooms_total: 100,
    rooms_per_floor: 20,
    amenities: ["бассейн", "сауна", "ресторан", "фитнес-центр", "конференц-зал"]
  },
  {
    name: "Корпус B",
    stars: 3,
    floors: 3,
    rooms_total: 45,
    rooms_per_floor: 15,
    amenities: ["прачечная", "бар", "игровая комната"]
  },
  {
    name: "Корпус C",
    stars: 5,
    floors: 8,
    rooms_total: 160,
    rooms_per_floor: 20,
    amenities: ["бассейн", "ресторан", "бильярд", "спа", "фитнес-центр", "бизнес-центр"]
  },
  {
    name: "Корпус D",
    stars: 2,
    floors: 2,
    rooms_total: 20,
    rooms_per_floor: 10,
    amenities: ["прачечная", "кухня для гостей"]
  },
  {
    name: "Корпус E",
    stars: 4,
    floors: 4,
    rooms_total: 64,
    rooms_per_floor: 16,
    amenities: ["ресторан", "бар", "сауна", "терраса"]
  },
  {
    name: "Корпус F",
    stars: 3,
    floors: 6,
    rooms_total: 90,
    rooms_per_floor: 15,
    amenities: ["бассейн", "кафе", "детская площадка"]
  }
];

// 2. Номера с вложенной информацией о корпусах
db.rooms.insertMany([
  // Корпус A
  { 
    number: "101", 
    floor: 1, 
    capacity: 1, 
    status: "свободен", 
    price_per_night: 3500, 
    building: buildingsData[0],
    amenities: ["Wi-Fi", "телевизор"],
    next_booking_date: new Date("2025-06-15")
  },
  { 
    number: "102", 
    floor: 1, 
    capacity: 2, 
    status: "занят", 
    price_per_night: 4500, 
    building: buildingsData[0],
    amenities: ["Wi-Fi", "телевизор", "кондиционер"],
    next_booking_date: new Date("2025-06-20")
  },
  { 
    number: "201", 
    floor: 2, 
    capacity: 2, 
    status: "свободен", 
    price_per_night: 5000, 
    building: buildingsData[0],
    amenities: ["Wi-Fi", "телевизор", "мини-бар"],
    next_booking_date: new Date("2025-06-01")
  },
  { 
    number: "202", 
    floor: 2, 
    capacity: 3, 
    status: "занят", 
    price_per_night: 6000, 
    building: buildingsData[0],
    amenities: ["Wi-Fi", "телевизор", "кондиционер", "балкон"],
    next_booking_date: new Date("2025-07-10")
  },
  
  // Корпус B
  { 
    number: "101", 
    floor: 1, 
    capacity: 1, 
    status: "свободен", 
    price_per_night: 2500, 
    building: buildingsData[1],
    amenities: ["Wi-Fi"],
    next_booking_date: new Date("2025-06-05")
  },
  { 
    number: "102", 
    floor: 1, 
    capacity: 2, 
    status: "занят", 
    price_per_night: 3500, 
    building: buildingsData[1],
    amenities: ["Wi-Fi", "телевизор"],
    next_booking_date: new Date("2025-07-01")
  },
  
  // Корпус C
  { 
    number: "301", 
    floor: 3, 
    capacity: 2, 
    status: "свободен", 
    price_per_night: 7000, 
    building: buildingsData[2],
    amenities: ["Wi-Fi", "телевизор", "кондиционер", "мини-бар", "сейф"],
    next_booking_date: new Date("2025-06-10")
  },
  { 
    number: "302", 
    floor: 3, 
    capacity: 4, 
    status: "занят", 
    price_per_night: 9000, 
    building: buildingsData[2],
    amenities: ["Wi-Fi", "телевизор", "кондиционер", "балкон", "джакузи"],
    next_booking_date: new Date("2025-07-15")
  },
  
  // Корпус D
  { 
    number: "101", 
    floor: 1, 
    capacity: 1, 
    status: "свободен", 
    price_per_night: 2000, 
    building: buildingsData[3],
    amenities: [],
    next_booking_date: new Date("2025-06-25")
  },
  
  // Корпус E
  { 
    number: "401", 
    floor: 4, 
    capacity: 2, 
    status: "свободен", 
    price_per_night: 5500, 
    building: buildingsData[4],
    amenities: ["Wi-Fi", "телевизор", "кофемашина"],
    next_booking_date: new Date("2025-06-18")
  },
  
  // Корпус F
  { 
    number: "501", 
    floor: 5, 
    capacity: 3, 
    status: "занят", 
    price_per_night: 6500, 
    building: buildingsData[5],
    amenities: ["Wi-Fi", "телевизор", "кондиционер"],
    next_booking_date: new Date("2025-07-05")
  }
]);

// 3. Клиенты 
db.clients.insertMany([
  {
    full_name: "Иванов Иван Иванович",
    passport_number: "1234567890",
    contacts: { phone: "89001112233", email: "ivanov@mail.ru" },
    visits: [
      {
        room_number: "101",
        building_name: "Корпус А",
        start_date: new Date("2025-04-28"),
        end_date: new Date("2025-05-02"),
        services_used: ["сауна", "прачечная"],
        complaints: ["шум ночью"],
        total_due: 6500
      },
      {
        room_number: "201",
        building_name: "Корпус А",
        start_date: new Date("2024-11-15"),
        end_date: new Date("2024-11-20"),
        services_used: ["бассейн"],
        total_due: 4600
      }
    ]
  },
  {
    full_name: "Петрова Анна Сергеевна",
    passport_number: "0987654321",
    contacts: { phone: "89002223344", email: "petrova@mail.ru" },
    visits: [
      {
        room_number: "505",
        building_name: "Корпус E",
        start_date: new Date("2025-05-01"),
        end_date: new Date("2025-05-04"),
        services_used: [],
        complaints: [],
        total_due: 3000
      },
      {
        room_number: "401",
        building_name: "Корпус E",
        start_date: new Date("2025-01-10"),
        end_date: new Date("2025-01-15"),
        services_used: ["химчистка"],
        total_due: 4500
      }
    ]
  },
  {
    full_name: "Смирнов Алексей Олегович",
    passport_number: "1111222233",
    contacts: { phone: "89003334455", email: "smirnov@mail.ru" },
    visits: [
      {
        room_number: "303",
        building_name: "Корпус C",
        start_date: new Date("2025-05-02"),
        end_date: new Date("2025-05-07"),
        services_used: ["доп. питание"],
        complaints: [],
        total_due: 6500
      }
    ]
  },
  {
    full_name: "Кузнецова Мария Петровна",
    passport_number: "4444555566",
    contacts: { phone: "89004445566", email: "kuznetsova@mail.ru" },
    visits: [
      {
        room_number: "202",
        building_name: "Корпус A",
        start_date: new Date("2025-05-01"),
        end_date: new Date("2025-05-06"),
        services_used: ["бассейн"],
        complaints: ["не работал телевизор"],
        total_due: 25800
      },
      {
        room_number: "302",
        building_name: "Корпус C",
        start_date: new Date("2024-12-20"),
        end_date: new Date("2024-12-31"),
        services_used: ["доп. питание", "спа"],
        total_due: 45000
      }
    ]
  },
  {
    full_name: "Соколов Дмитрий Владимирович",
    passport_number: "7777888899",
    contacts: { phone: "89005556677", email: "sokolov@mail.ru" },
    visits: [
      {
        room_number: "404",
        building_name: "Корпус D",
        start_date: new Date("2025-05-03"),
        end_date: new Date("2025-05-08"),
        services_used: ["прачечная"],
        complaints: [],
        total_due: 3900
      }
    ]
  },
  {
    full_name: "Васильева Елена Александровна",
    passport_number: "3333444455",
    contacts: { phone: "89006667788", email: "vasileva@mail.ru" },
    visits: [
      {
        room_number: "102",
        building_name: "Корпус A",
        start_date: new Date("2025-05-10"),
        end_date: new Date("2025-05-15"),
        services_used: ["химчистка", "сауна"],
        complaints: ["медленный Wi-Fi"],
        total_due: 8200
      }
    ]
  },
  {
    full_name: "Николаев Петр Сергеевич",
    passport_number: "6666777788",
    contacts: { phone: "89007778899", email: "nikolaev@mail.ru" },
    visits: [
      {
        room_number: "501",
        building_name: "Корпус F",
        start_date: new Date("2025-05-05"),
        end_date: new Date("2025-05-12"),
        services_used: ["бассейн", "доп. питание"],
        complaints: [],
        total_due: 12500
      },
      {
        room_number: "301",
        building_name: "Корпус C",
        start_date: new Date("2024-10-01"),
        end_date: new Date("2024-10-07"),
        services_used: [],
        total_due: 42000
      }
    ]
  }
]);

const clientsList = db.clients.find().toArray();
const ivanov = clientsList[0];
const petrova = clientsList[1];
const smirnov = clientsList[2];
const kuznetsova = clientsList[3];
const sokolov = clientsList[4];
const vasileva = clientsList[5];
const nikolaev = clientsList[6];

// 4. Компании 
db.companies.insertMany([
  {
    name: "Турфирма Ромашка",
    type: "туристическая фирма",
    contract: {
      start: new Date("2025-01-01"),
      end: new Date("2025-12-31"),
      discount_percent: 20,
      special_conditions: "предварительное бронирование"
    }
  },
  {
    name: "Организация МегаСимпозиум",
    type: "организатор симпозиумов",
    contract: {
      start: new Date("2025-03-01"),
      end: new Date("2025-10-31"),
      discount_percent: 30,
      special_conditions: "бронирование 10+ номеров"
    }
  },
  {
    name: "Фестиваль АртЛето",
    type: "организатор мероприятий",
    contract: {
      start: new Date("2025-05-01"),
      end: new Date("2025-08-31"),
      discount_percent: 25,
      special_conditions: "питание включено"
    }
  },
  {
    name: "Конгресс МедЭкспо",
    type: "организация конференций",
    contract: {
      start: new Date("2025-04-15"),
      end: new Date("2025-11-15"),
      discount_percent: 15,
      special_conditions: "возможна отмена за 5 дней"
    }
  },
  {
    name: "Агентство Путешествуй",
    type: "туристическая фирма",
    contract: {
      start: new Date("2025-02-01"),
      end: new Date("2025-09-01"),
      discount_percent: 10,
      special_conditions: "гибкие условия"
    }
  },
  {
    name: "Корпорация ТехноПрофи",
    type: "корпоративный клиент",
    contract: {
      start: new Date("2025-01-15"),
      end: new Date("2025-12-15"),
      discount_percent: 18,
      special_conditions: "бронирование для сотрудников"
    }
  },
  {
    name: "Сеть Отелей Партнер",
    type: "партнерская сеть",
    contract: {
      start: new Date("2025-03-15"),
      end: new Date("2025-11-30"),
      discount_percent: 22,
      special_conditions: "взаимные бронирования"
    }
  }
]);

// 6. Платежи 
db.payments.insertMany([
  { client_id: ivanov._id, date: new Date("2025-05-01"), amount: 6500, description: ["проживание", "сауна", "прачечная"]},
  { client_id: petrova._id, date: new Date("2025-05-03"), amount: 3000, description: ["проживание"] },
  { client_id: smirnov._id, date: new Date("2025-05-05"), amount: 6500, description: ["номер", "питание"] },
  { client_id: kuznetsova._id, date: new Date("2025-05-06"), amount: 25800, description: ["номер", "бассейн"] },
  { client_id: sokolov._id, date: new Date("2025-05-07"), amount: 3900, description: ["номер", "прачечная"] },
  { client_id: vasileva._id, date: new Date("2025-05-15"), amount: 8200, description: ["номер", "химчистка", "сауна"] },
  { client_id: nikolaev._id, date: new Date("2025-05-12"), amount: 12500, description: ["номер" , "бассейн", "питание"] },
  { client_id: ivanov._id, date: new Date("2024-11-20"), amount: 4600, description: ["проживание", "бассейн"] },
  { client_id: petrova._id, date: new Date("2025-01-15"), amount: 4500, description: ["проживание", "химчистка" ]},
  { client_id: kuznetsova._id, date: new Date("2024-12-31"), amount: 45000, description: ["номер", "питание", "спа"] },
  { client_id: nikolaev._id, date: new Date("2024-10-07"), amount: 42000, description: ["проживание"] }
]);

// 7. Бронирования 
db.bookings.insertMany([
  {
    company_id: db.companies.findOne({name: "Турфирма Ромашка"})._id, 
    hotel_class: 4, 
    floor: 2,
    rooms_reserved: 5, 
    people_count: 10,
    start_date: new Date("2025-06-01"), 
    end_date: new Date("2025-06-10"),
    canceled: false,
    rooms_numbers: ["201", "202", "301", "302", "401"]
  },
  {
    company_id: db.companies.findOne({name: "Организация МегаСимпозиум"})._id, 
    hotel_class: 5, 
    floor: 3,
    rooms_reserved: 8, 
    people_count: 16,
    start_date: new Date("2025-07-05"), 
    end_date: new Date("2025-07-15"),
    canceled: false,
    rooms_numbers: ["101", "102", "201", "202", "301", "302", "401", "501"]
  },
  {
    company_id: db.companies.findOne({name: "Фестиваль АртЛето"})._id, 
    hotel_class: 3, 
    floor: 1,
    rooms_reserved: 4, 
    people_count: 8,
    start_date: new Date("2025-08-01"), 
    end_date: new Date("2025-08-05"),
    canceled: false,
    rooms_numbers: ["101", "102", "201", "202"]
  },
  {
    company_id: db.companies.findOne({name: "Конгресс МедЭкспо"})._id, 
    hotel_class: 4, 
    floor: 1,
    rooms_reserved: 3, 
    people_count: 6,
    start_date: new Date("2025-09-01"), 
    end_date: new Date("2025-09-10"),
    canceled: true,
    rooms_numbers: ["101", "102", "201"]
  },
  {
    company_id: db.companies.findOne({name: "Агентство Путешествуй"})._id, 
    hotel_class: 2, 
    floor: 1,
    rooms_reserved: 2, 
    people_count: 4,
    start_date: new Date("2025-05-15"), 
    end_date: new Date("2025-05-20"),
    canceled: false,
    rooms_numbers: ["101", "102"]
  },
  {
    company_id: db.companies.findOne({name: "Корпорация ТехноПрофи"})._id, 
    hotel_class: 4, 
    floor: 4,
    rooms_reserved: 6, 
    people_count: 12,
    start_date: new Date("2025-06-15"), 
    end_date: new Date("2025-06-25"),
    canceled: false,
    rooms_numbers: ["101", "201", "301", "401", "501", "102"]
  },
  {
    company_id: db.companies.findOne({name: "Сеть Отелей Партнер"})._id, 
    hotel_class: 5, 
    floor: 5,
    rooms_reserved: 10, 
    people_count: 20,
    start_date: new Date("2025-09-15"), 
    end_date: new Date("2025-09-25"),
    canceled: false,
    rooms_numbers: ["101", "102", "201", "202", "301", "302", "401", "501", "101", "102"]
  },
  {
    company_id: db.companies.findOne({name: "Турфирма Ромашка"})._id, 
    hotel_class: 3, 
    floor: 2,
    rooms_reserved: 3, 
    people_count: 6,
    start_date: new Date("2025-10-01"), 
    end_date: new Date("2025-10-07"),
    canceled: false,
    rooms_numbers: ["201", "202", "301"]
  }
]);

// Обновляем компании, добавляя поле booking_id
const bookings = db.bookings.find().toArray();
const companies = db.companies.find().toArray();

db.companies.updateOne({ _id: companies[0]._id }, {
  $set: {
    booking_ids: [bookings[0]._id, bookings[7]._id] 
  }
});

db.companies.updateOne({ _id: companies[1]._id }, {
  $set: {
    booking_ids: [bookings[1]._id]
  }
});

db.companies.updateOne({ _id: companies[2]._id }, {
  $set: {
    booking_ids: [bookings[2]._id]
  }
});

db.companies.updateOne({ _id: companies[3]._id }, {
  $set: {
    booking_ids: [bookings[3]._id]
  }
});

db.companies.updateOne({ _id: companies[4]._id }, {
  $set: {
    booking_ids: [bookings[4]._id]
  }
});

db.companies.updateOne({ _id: companies[5]._id }, {
  $set: {
    booking_ids: [bookings[5]._id]
  }
});

db.companies.updateOne({ _id: companies[6]._id }, {
  $set: {
    booking_ids: [bookings[6]._id]
  }
});