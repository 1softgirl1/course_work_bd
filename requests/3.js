db.rooms.countDocuments({
    status: "свободен",
    capacity: 2,
    "building.stars": { $gte: 4 }
});