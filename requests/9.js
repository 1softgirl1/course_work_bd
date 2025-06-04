db.clients.aggregate([
    { $project: { full_name: 1, visit_count: { $size: "$visits" } } },
    { $sort: { visit_count: -1 } },
    { $limit: 3 }
]);