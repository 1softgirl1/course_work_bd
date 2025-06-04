db.clients.aggregate([
    {
        $unwind: "$visits"
    },
    {
        $match: {
            "visits.start_date": { $gte: new Date("2025-05-01") },
            "visits.end_date": { $lte: new Date("2025-05-31") },   
            "visits.room_number": { $in: ["101", "202", "303"] }   
        }
    },
    {
        $group: {
            _id: null,
            total_guests: { $sum: 1 }
        }
    }
]);