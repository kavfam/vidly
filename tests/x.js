// post /api/returns {customerId, movieId}

// fail tests
// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 405 if no rental found for this customer/movie
// Return 400 if rental already processed
// good tests
// Return 200 if valid request
// set return date to today
// calculate rental fee
// increase stock
// return the rental summary
