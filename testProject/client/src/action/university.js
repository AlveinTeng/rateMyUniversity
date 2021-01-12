// Functions to help with university actions
import { getRatingById } from "./rate";

// A function to send a POST request to create a new unviersity
export const createUniversity = (app) => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/api/universities", {
    method: "post",
    body: JSON.stringify(app.university),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
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
        if (json.result !== undefined) {
          app.setState({ university: json.result })
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a GET request to get all universities
export const getUniversities = async () => {
  const url = "/api/universities";

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }

}

// A function to rank all universities by cate, return a range of universities
export const rankUniversitiesByCate = async (cate, range) => {
  const unis = (await getUniversities()).universities;
  const rates = await Promise.all(unis.map(async uni => [await (await getRatingById(uni.rating)).rating[cate].rate, uni]));
  rates.sort((a , b) => {return b[0] - a[0]})
  const universities = rates.map(rate => {return rate[1]})

  if (range > 0) {
    return universities.slice(0, range);
  }

  return universities;
}

// A function to rank all universities by cate, return a range of universities
export const updateAllRank = async (uni) => {
  const safty = (await rankUniversitiesByCate("safety", 0)).findIndex(university => { return university._id === uni._id }) + 1;
  const workload = (await rankUniversitiesByCate("workload", 0)).findIndex(university => { return university._id === uni._id }) + 1;
  const location = (await rankUniversitiesByCate("location", 0)).findIndex(university => { return university._id === uni._id }) + 1;
  const facilities = (await rankUniversitiesByCate("facilities", 0)).findIndex(university => { return university._id === uni._id }) + 1;
  const opportunity = (await rankUniversitiesByCate("opportunity", 0)).findIndex(university => { return university._id === uni._id }) + 1;
  const clubs = (await rankUniversitiesByCate("clubs", 0)).findIndex(university => { return university._id === uni._id }) + 1;
  const general = (await rankUniversitiesByCate("general", 0)).findIndex(university => { return university._id === uni._id }) + 1;

  console.log({ safty, workload, location, facilities, opportunity, clubs, general})
  return { safty, workload, location, facilities, opportunity, clubs, general}
}

// A function to get all universities and search if name exists, return url
export const searchUniversity = (universities, search) => {
  const unviersity = universities[universities.findIndex(findUni => { return findUni.name === search })]
  if (unviersity) {
    return `/university/${unviersity._id}`;
  } else {
    return `/Error`;
  }
}

// A function to send a GET request to get university by id
export const getUniversityById = async (id) => {
  const url = "/api/universities/" + id;

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to send a GET request to get comments in university by id
export const getCommentsUniversityById = async (id) => {
  const url = "/api/universities/" + id + "/comment";

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to send a POST request to add comment to university
export const addCommentUniversity = async (id, com_id) => {
  const url = "/api/universities/" + id + "/comment/" + com_id;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
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

// A function to send a GET request to check if comment in university's comments
export const checkCommentUniversity = (id, com_id) => {
  const url = "/api/universities/" + id + "/comment/" + com_id;

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
        if (json && json.comment ) {
          return json.comment
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a DELETE request to delete comment from university
export const deleteComment = (id, com_id, app) => {
  const url = "/api/universities/" + id + "/comment/" + com_id;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "delete",
    body: null,
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
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
        if (json && json.university && json.newComments ) {
          app.setState({ university: json.university });
          return json.newComments;
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a GET request to get rating from university
export const getRating = (id, app) => {
  const url = "/api/universities/" + id + "/rating";

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
        if (json && json.rating ) {
          app.setState({ rating: json.rating });
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}