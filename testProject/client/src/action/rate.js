// Functions to help with rate actions

// A function to send a POST request to create a new rating
export const createRating = async () => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/api/ratings", {
    method: "POST",
    body: null,
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  const res = await fetch(request);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to send a GET request to get all ratings
export const getRatings = (app) => {
  const url = "/api/ratings";

  fetch(url)
    .then(
      res => {
        if (res.status === 200) {
          return res.json();
        }
      }
    )
    .then(
      json => {
        if (json && json.ratings ) {
          app.setState({ ratings: json.ratings })
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a GET request to get rating by id
export const getRatingById = async (id) => {
  const url = "/api/ratings/" + id;

  const res = await fetch(url);

  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to send a PATCH request to set rating by id
export const setRatingById = async (id, newRating) => {
  const url = "/api/ratings/" + id + "/rating";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify(newRating),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  const res = await fetch(request);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to send a PATCH request to change delete in rating by id
export const deleteRatingById = (id, app) => {
  const url = "/api/ratings/" + id + "/delete";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "patch",
    body: JSON.stringify(app.rating.deleted),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(
      res => {
        if (res.status === 200) {
          return res.json();
        }
      }
    )
    .then(
      json => {
        if (json && json.rating && json.deleted) {
          app.setState({ rating: json.rating })
          return json.deleted
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}