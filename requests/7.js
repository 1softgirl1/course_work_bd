db.clients.findOne(
    { "visits.room_number": "202" },
    { full_name: 1, passport_number: 1, "visits.$": 1 }
);