db.clients.aggregate([
    {
        $unwind: "$visits"
    },
    {
        $match: {
            "visits.start_date": { $gte: new Date("2025-01-01") },
            "visits.end_date": { $lte: new Date("2025-12-31") },
            "visits.building_name": "Корпус А"
        }
    },
    {
        $group: {
            _id: {
                building: "$visits.building_name",
                room_number: "$visits.room_number"
            },
            visit_count: { $sum: 1 },
            total_due: { $sum: "$visits.total_due" }
        }
    },
    {
        $sort: { visit_count: -1 }
    }
]);