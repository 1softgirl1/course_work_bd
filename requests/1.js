db.bookings.aggregate([
    {
        $match: {
            start_date: { $gte: ISODate("2025-06-01") },
            end_date: { $lte: ISODate("2025-06-30") },
            rooms_reserved: { $gte: 5 },
            canceled: false
        }
    },
    {
        $lookup: {
            from: "companies",
            localField: "company_id",
            foreignField: "_id",
            as: "company"
        }
    },
    { $unwind: "$company" },
    {
        $project: {
            _id: 0,
            company_name: "$company.name",
            rooms_reserved: 1,
            period: { start: "$start_date", end: "$end_date" }
        }
    }
]);