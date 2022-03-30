//POST /api/returns {customerId, movieId}

// Return 401 if client is not loggged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed

// return 200 if valid request
// set return date
// calculate the rental fee
// increase the stock
// return the rental
