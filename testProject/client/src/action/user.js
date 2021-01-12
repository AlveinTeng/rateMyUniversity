// Functions to help with user actions

// Send a request to check if a user is logged in through the session cookie
export const checkSession = async () => {
  const url = "/users/check-session";

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();;
  } else {
    console.log("something wrong");
    return null;
  }

  // fetch(url)
  //   .then(
  //     res => {
  //       if (res.status === 200) {
  //         return res.json();
  //       }
  //     }
  //   )
  //   .then(
  //     json => {
  //       if (json.currentUser !== undefined) {
  //         app.setState({currentUser: json.currentUser, adminStatus: json.adminStatus});
  //       }
  //     }
  //   )
  //   .catch(
  //     error => {
  //       console.log(error);
  //     }
  //   )
}

// A function to send a POST request with the user to be logged in
export const login = (account, app) => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/users/login", {
    method: "post",
    body: JSON.stringify(account),
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
        if (json.currentUser !== undefined) {
          app.setState({ currentUser: json.currentUser, adminStatus: json.adminStatus })
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a GET request to logout the current user
export const logout = (app) => {
  const url = "/users/logout";

  fetch(url)
    .then(
      res => {
        app.setState({
          currentUser: null,
          adminStatus: null,
          message: { type: "", body: "" }
        })
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a POST request create user
export const createUser = async (account) => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/api/users", {
    method: "post",
    body: JSON.stringify(account),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  const res = await fetch(request);
  if (res.status === 200) {
    return res.json();;
  } else {
    console.log("something wrong");
    return null;
  }
}

// A function to send a GET request to get all users
export const getUsers = (app) => {
  const url = "/api/users";

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
        if (json && json.users ) {
          app.setState({ users: json.users })
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a GET request to get user by name
export const getUserByName = async (name) => {
  const url = "/api/users";

  const res = await fetch(url);
  if (res.status === 200) {
    const users = (await res.json()).users;
    const user = users.find(findUser => { return findUser.name === name });
    if (user) {
      return user;
    }
    return null;
  } else {
    console.log("something wrong");
    return null;
  }
}


// A function to send a GET request to get user by id
export const getUserById = async (id) => {
  const url = "/api/users/" + id;

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
    return null;
  }
}

// A function to send a POST request change user's password
export const checkPassword = async (id, Pass) => {
  const url = "/api/users/" + id + "/password";
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "post",
      body: JSON.stringify(Pass),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });

  // Send the request with fetch()
  const res = await fetch(request);
  if (res.status === 200) {
    const result = res.json();
    return result;
  } else {
    console.log("something wrong");
    return null;
  }
}

// A function to send a POST request change user's password
export const changePassword = async (changeComp) => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/api/users/password", {
    method: "post",
    body: JSON.stringify(changeComp),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  const res = await fetch(request);
  if (res.status === 200) {
    const result = res.json();
    return result;
  } else {
    console.log("something wrong");
    return null;
  }
}

// A function to send a PATCH request to change image in user by id
export const changeImage = (image, app) => {
  const url = "/api/users/profile/image";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify(image),
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
        if (json && json.user && json.image) {
          app.setState(prevState => ({ ...prevState, user: json.user }));
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
}

// A function to send a PATCH request to change school & year in user by id
export const changeProfile = async (profile) => {
  const url = "/api/users/profile";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify(profile),
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

// A function to send a PATCH request to change school in user by id
export const changeSchool = async (school) => {
  const url = "/api/users/profile/school";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify(school),
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

// A function to send a PATCH request to change year in user by id
export const changeYear = (year) => {
  const url = "/api/users/profile/year";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "patch",
    body: JSON.stringify(year),
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
        if (json && json.user && json.year) {
          return { user: json.user, year: json.year };
        }
        return null;
      }
    )
    .catch(
      error => {
        console.log(error);
        return null;
      }
    )
}

// A function to send a POST request to add comment to user
export const addCommentUser = async (com_id) => {
  const url = "/api/users/comment/" + com_id;

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
    return null;
  }
}

// A function to send a GET request to check if comment in user's comments
export const checkCommentUser = (com_id) => {
  const url = "/api/users/comment/" + com_id;

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

// A function to send a DELETE request to delete user's comment by ADMIN
export const deleteCommentAdmin = (id, com_id, app) => {
  const url = "/api/users/" + id + "/comment/" + com_id;

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
        if (json && json.user && json.newComments ) {
          app.setState({ user: json.user });
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

// A function to send a DELETE request to delete user's comment by USER
export const deleteCommentUser = (com_id, app) => {
  const url = "/api/users/comment/" + com_id;

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
        if (json && json.user && json.newComments ) {
          app.setState({ user: json.user });
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

// A function to send a POST request to add LIKE comment to user
export const addLikeCommentUser = async (com_id) => {
  const url = "/api/users/comment/" + com_id + "/like";

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

// A function to send a DELETE request to delete user's LIKE comment
export const deleteLikeCommentUser = async (com_id) => {
  const url = "/api/users/comment/" + com_id + "/like";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "DELETE",
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

// A function to send a POST request to add DISLIKE comment to user
export const addDislikeCommentUser = async (com_id) => {
  const url = "/api/users/comment/" + com_id + "/dislike";

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

// A function to send a DELETE request to delete user's DISLIKE comment
export const deleteDislikeCommentUser = async (com_id) => {
  const url = "/api/users/comment/" + com_id + "/dislike";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "DELETE",
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

// A function to send a POST request to add follow university in user
export const addFollowUniversity = async (follow_id) => {
  const url = "/api/users/university/" + follow_id;

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

// A function to send a GET request to get rating from university
export const getFollowUniversity = (follow_id) => {
  const url = "/api/users/university/" + follow_id;

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
        if (json && json.followUniversity ) {
          return json.followUniversity;
        }
        return null;
      }
    )
    .catch(
      error => {
        console.log(error);
        return null;
      }
    )
}

// A function to send a DELETE request to delete follow university
export const deleteFollowUniversity = async (follow_id) => {
  const url = "/api/users/university/" + follow_id;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "DELETE",
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

// A function to send a PATCH request to change delete in user by id
export const deleteUserById = async (id, deleted) => {
  const url = "/api/users/" + id + "/delete";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify(deleted),
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