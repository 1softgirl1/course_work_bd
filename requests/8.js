db.companies.find({
    "contract.start": { $lte: new Date("2025-12-31") }, 
    "contract.end": { $gte: new Date("2025-01-01") }
});