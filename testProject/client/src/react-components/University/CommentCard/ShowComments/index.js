const log = console.log;

const ShowComments = (ratingsArr, commentsArr, comments, containResponds) => {
  const commentCards = [];
  
  if (!containResponds) {
    for (let i = comments.length - 1; i >= 0; i --) {
      if (commentsArr[comments[i]].rating !== -1) {
        commentCards.push({
          comment: commentsArr[comments[i]],
          rating: ratingsArr[commentsArr[comments[i]].rating]
        });
      } else {
        commentCards.push({
          comment: commentsArr[comments[i]],
          rating: false
        });
      }
    }
  } else {
    let totalComment = comments;
    for (let i = totalComment.length - 1; i >= 0; i --) {
      for (let j = 0; j < commentsArr[totalComment[i]].responds.length; j ++) {
        if (!totalComment.includes(commentsArr[totalComment[i]].responds[j])) {
          totalComment.push(commentsArr[totalComment[i]].responds[j]);
        }
      }
    }

    totalComment.sort();

    for (let i = totalComment.length - 1; i >= 0; i --) {
      commentCards.push({
        comment: commentsArr[totalComment[i]],
        rating: false
      });
    }
  }
  

  return commentCards;
}

export default ShowComments;