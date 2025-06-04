db.clients.aggregate([
    {
        $match: {
            "full_name": "Иванов Иван Иванович"
        }
    },
    {
        $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "client_id",
            as: "payments_info"
        }
    },
    {
        $project: {
            full_name: 1,
            passport_number: 1,
            contacts: 1,
            total_visits: { $size: "$visits" },
            visits: 1,
            payments: "$payments_info",
            total_paid: {
                $sum: "$payments_info.amount"
            }
        }
    }
]);