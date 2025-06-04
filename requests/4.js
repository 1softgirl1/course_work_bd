db.rooms.aggregate([
    {    
        $match: {
            number: "101",
            "building.name": "Корпус А",
            status: "свободен"
        }
    },
    {
        $project: {
            _id: 0,
            number: 1,
            building: "$building.name",
            floor: 1,
            capacity: 1,
            price_per_night: 1,
            room_amenities: "$amenities",
            building_amenities: "$building.amenities", 
            status: 1,
            next_booking_date: { 
                $dateToString: { 
                    format: "%Y-%m-%d", 
                    date: "$next_booking_date" 
                } 
            },
            days_to_next_booking: {
                $ceil: {
                    $divide: [
                        { $subtract: ["$next_booking_date", new Date()] },
                        1000 * 60 * 60 * 24
                    ]
                }
            }
        }
    }
]);