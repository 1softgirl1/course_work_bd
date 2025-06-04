db.companies.aggregate([
  { 
    $match: { 
      name: "Турфирма Ромашка" 
    } 
  },
  {
    $lookup: {
      from: "bookings",
      localField: "booking_ids",
      foreignField: "_id",
      as: "bookings"
    }
  },
  {
    $project: {
      name: 1,
      total_rooms_booked: { $sum: "$bookings.rooms_reserved" },
      bookings_in_period: {
        $filter: {
          input: "$bookings",
          as: "booking",
          cond: {
            $and: [
              { $gte: ["$$booking.start_date", new Date("2025-06-01")] },
              { $lte: ["$$booking.end_date", new Date("2025-06-30")] }
            ]
          }
        }
      }
    }
  }
]);