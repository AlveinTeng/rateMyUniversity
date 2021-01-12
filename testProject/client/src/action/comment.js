// Functions to help with comment actions

// A function to send a POST request to create a new comment
export const createComment = async (comment) => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/api/comments", {
    method: "POST",
    body: JSON.stringify(comment),
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

// A function to send a GET request to get all comments
export const getComments = async () => {
  const url = "/api/comments";

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to get all comments that responds comment
export const getCommentsRespondCom = async (com_id) => {
  const comments = (await getComments()).comments.filter(comment => {return comment.respond === com_id});
  const respond = (await getCommentById(com_id)).comment;
  const updatedComments = comments.sort((com1, com2) => { return com2.time.date - com1.time.date });
  const returnComments = [];
  updatedComments.map(comment => {
    const comRes = {com: comment, res: respond};
    returnComments.push(comRes);
  })

  return returnComments;
}

export const getCommentsUnderCom = async (com_id) => {
  const comments = (await getComments()).comments.filter(comment => {return comment.under === com_id});
  const respond = (await getCommentById(com_id)).comment;
  const updatedComments = comments.sort((com1, com2) => { return com2.time.date - com1.time.date });
  const returnComments = [];
  updatedComments.map(comment => {
    const comRes = {com: comment, res: respond};
    returnComments.push(comRes);
  })

  return returnComments;
}

// A function to get all comments that responds university
export const getCommentsRespondUni = async (uni_id) => {
  const comments = (await getComments()).comments.filter(comment => { return comment.university === uni_id && comment.respond === "" });
  const updatedComments = comments.sort((com1, com2) => { return com2.time.date - com1.time.date });

  return updatedComments;
}

export const getReports = async () => {
  const comments = (await getComments()).comments.filter(comment => { return comment.university === "" });
  return comments;
}

export const getReportsUser = async (user_id) => {
  const comment = (await getComments()).comments.find(comment => { return comment.university === "" && comment.author === user_id});
  return comment;
}


// A function to send a GET request to get comment by id
export const getCommentById = async (id) => {
  const url = "/api/comments/" + id;

  const res = await fetch(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log("something wrong");
  }
}

// A function to send a PATCH request to set like in comment by id
export const setLikeCommentById = async (id, like) => {
  const url = "/api/comments/" + id + "/like";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify(like),
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

// A function to send a PATCH request to set delete in comment by id
export const deleteCommentById = async (id, deleted) => {
  const url = "/api/comments/" + id + "/delete";

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

// A function to send a PATCH request to set delete in comment by id
export const removeCommentById = async (id) => {
  const url = "/api/comments/" + id;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "DELETE",
    body: null,
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