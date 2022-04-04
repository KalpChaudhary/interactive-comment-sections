"use strict";
// import regeneratorRuntime from "regenerator-runtime";
import dataList from "../data.json";
import images from "./images/avatars/*.png";
import icons from "./images/*.svg";

// const imgTemp = images[`image-maxblagun`]

console.log(dataList);

//? To track down which reply btn is pressed so it would be easier to add html after that btn is pressed.
let parentEl;

const commetsSection = document.querySelector(".comments");

const textAreaAddComment = document.querySelector("#addComment");
const btnSendDefault = document.querySelector("#btnSendDefault");

commetsSection.addEventListener("click", function (e) {
  const replyBtn = e.target.closest("#replyBtn");

  if (!replyBtn) return;

  parentEl = replyBtn.parentNode.parentNode.parentNode;

  const replyInputMarkup = `
    <div class="comment-input toogleCommentInput">
    <div class="comment-input__textArea">
      <textarea
        name="addComment"
        id="addComment"
        cols="31"
        rows="2"
        placeholder="Add a comment..."
      ></textarea>
    </div>
    <div class="comment-input__bottomArea">
      <div class="img__box">
        <img
          src="${images["image-juliusomo"]}"
          alt="Juliusomo-profile-pic"
        />
      </div>
      <div class="btn__send">
        <button id="btnSend">Send</button>
      </div>
    </div>
    </div>
    `;

  parentEl.insertAdjacentHTML("afterend", replyInputMarkup);
});

commetsSection.addEventListener("click", function (e) {
  const btnSend = e.target.closest("#btnSend");

  if (!btnSend) return;

  const idNum = +parentEl.getAttribute("data-id-number");



  let [replyingToUser] = dataList.comments.filter((obj) => obj.id === idNum);

  if(!replyingToUser){
   dataList.comments.forEach((obj) => {
       obj.replies.forEach((reply) => {
        if(reply.id === idNum){
          replyingToUser = reply;
          return;
        }
       });
    })
  }

  // console.log(replyingToUser.user);

  const parentElOne = btnSend.parentNode.parentNode.parentNode.parentNode;

  const previousSibling =
    btnSend.parentNode.parentNode.previousSibling.previousSibling.childNodes[1];


  if (!previousSibling.value) return;

  const newComment = {
    id: 4,
    content: `${previousSibling.value}`,
    createdAt: "2 weeks ago",
    replyingTo: `${replyingToUser.user.username}`,
    score: 0,
    user: dataList.currentUser,
  };

  if(!parentEl.classList.contains("commets__reply")){
    replyingToUser.replies.push(newComment);
  }
  generateCurrentUserReplyComment(newComment, parentEl);

  parentElOne.removeChild(btnSend.parentNode.parentNode.parentNode);
});

commetsSection.addEventListener("click", renderTotalPlusLikes);
commetsSection.addEventListener("click", renderTotalMinusLikes);

function renderTotalPlusLikes(e) {
  const plusBtn = e.target.closest("#btnPlus");
  if (!plusBtn) return;

  const nextSibling = plusBtn.nextSibling.nextSibling;

  let totalLikes = +plusBtn.nextSibling.nextSibling.innerHTML;
  totalLikes += 1;

  nextSibling.innerHTML = totalLikes;
}

function renderTotalMinusLikes(e) {
  const minusBtn = e.target.closest("#btnMinus");
  if (!minusBtn) return;

  const previousSibling = minusBtn.previousSibling.previousSibling;

  let totalLikes = +minusBtn.previousSibling.previousSibling.innerHTML;
  totalLikes -= 1;

  previousSibling.innerHTML = `${totalLikes >= 0 ? totalLikes : 0}`;
}

const generateNewComments = function (data) {
  const markup = `

    <div class="comments__new" data-id-number="${data.id}">
      <div class="comments__new--user-timeline">
        <div class="img__box">
          <img
            src="${
              images[data.user.image.png.substring(17).replace(".png", "")]
            }"
            alt="profile-img"
          />
        </div>
        <div class="username__box">
          <h1>${data.user.username}</h1>
        </div>
        <div class="timeline__box">
          <span>${data.createdAt}</span>
        </div>
      </div>
      <div class="comments__new--comment-text">
        <p>${data.content}</p>
      </div>
      <div class="comments__new--btns">
        <div class="btn__like">
          <img
            class="btn-plus"
            id="btnPlus"
            src="${icons["icon-plus"]}"
            alt="plus-icon"
          />
          <label>${data.score}</label>
          <img
            class="btn-minus"
            id="btnMinus"
            src="${icons["icon-minus"]}"
            alt="minus-icon"
          />
        </div>
        <div class="btn__reply">
          <img src="${icons["icon-reply"]}" alt="reply-icon" />
          <label id="replyBtn">Reply</label>
        </div>
      </div>
    </div>
`;

  // commetsAddSection.innerHTML = '';
  commetsSection.insertAdjacentHTML("beforeend", markup);

  
};

const generateNewCommentsWithReply = function (replyData, parent) {
  const replyMarkup = `    
<div class="comments__reply-container" data-id-number="${replyData.id}">
<div class="commets__reply" data-id-number="${replyData.id}">
<div class="comments__new--user-timeline">
<div class="img__box">
  <img
    src="${images[replyData.user.image.png.substring(17).replace(".png", "")]}"
    alt="profile-img"
  />
</div>
<div class="username__box">
  <h1>${replyData.user.username}</h1>
</div>
<div class="timeline__box">
  <span>${replyData.createdAt}</span>
</div>
</div>
<div class="comments__new--comment-text">
<p><span>@${replyData.replyingTo}</span> ${replyData.content}</p>
</div>
<div class="comments__new--btns">
<div class="btn__like">
  <img
    class="btn-plus"
    id="btnPlus"
    src="${icons["icon-plus"]}"
    alt="plus-icon"
  />
  <label>${replyData.score}</label>
  <img
    class="btn-minus"
    id="btnMinus"
    src="${icons["icon-minus"]}"
    alt="minus-icon"
  />
</div>
<div class="btn__reply">
  <img src="${icons["icon-reply"]}" alt="reply-icon" />
  <label id="replyBtn">Reply</label>
</div>
</div>
</div>
</div>
`;

  const currentUserReplyMarkup = `
    <div class="comments__reply-container" data-id-number="${replyData.id}">
    <div class="commets__reply" data-id-number="${replyData.id}">
    <div class="comments__new--user-timeline">
    <div class="img__box">
    <img
        src="${
          images[replyData.user.image.png.substring(17).replace(".png", "")]
        }"
        alt="profile-img"
    />
    </div>
    <div class="username__box">
    <h1>${replyData.user.username}</h1>
    </div>
    <div class="current_user-tag">
    <label>you</label>
    </div>
    <div class="timeline__box">
    <span>${replyData.createdAt}</span>
    </div>
    </div>
    <div class="comments__new--comment-text">
    <p><span>@${replyData.replyingTo}</span> ${replyData.content}</p>
    </div>
    <div class="comments__new--btns">
    <div class="btn__like">
    <img
        class="btn-plus"
        id="btnPlus"
        src="${icons["icon-plus"]}"
        alt="plus-icon"
    />
    <label>${replyData.score}</label>
    <img
        class="btn-minus"
        id="btnMinus"
        src="${icons["icon-minus"]}"
        alt="minus-icon"
    />
    </div>
    <div class="btn__update">
    <button class="btn btn__update--delete">
      <img src="${icons["icon-delete"]}" alt="delete icon" /> Delete
    </button>
    <button class="btn btn__update--edit">
      <img src="${icons["icon-edit"]}" alt="edit icon" /> Edit
    </button>
    </div>
    </div>
    </div>
    </div>

`;

  parent.insertAdjacentHTML(
    "beforeend",
    dataList.currentUser.username === replyData.user.username
      ? currentUserReplyMarkup
      : replyMarkup
  );
};

dataList.comments.forEach((data) => {
  generateNewComments(data);

  data.replies.forEach((reply) => {
    generateNewCommentsWithReply(reply, commetsSection);
  });
});

btnSendDefault.addEventListener("click", () => {
  console.log(textAreaAddComment.value);

  if (!textAreaAddComment.value) return;
  const newComment = {
    id: 4,
    content: `${textAreaAddComment.value}`,
    createdAt: "2 weeks ago",
    replies: [],
    score: 0,
    user: dataList.currentUser,
  };

  dataList.comments.push(newComment);
  generateCurrentUserComment(newComment);
  console.log(dataList.comments);

  textAreaAddComment.value = "";

  // dataList.comments.forEach((data) => {
  //   generateNewComments(data);

  //   data.replies.forEach((reply) => {
  //     generateNewCommentsWithReply(reply);
  //   });
  // });

  // console.log(newComment);
});

function generateCurrentUserComment(data) {
  const markup = `

    <div class="comments__new" data-id-number="${data.id}">
      <div class="comments__new--user-timeline">
        <div class="img__box">
          <img
            src="${
              images[data.user.image.png.substring(17).replace(".png", "")]
            }"
            alt="profile-img"
          />
        </div>
        <div class="username__box">
          <h1>${data.user.username}</h1>
        </div>
        <div class="current_user-tag">
        <label>you</label>
        </div>
        <div class="timeline__box">
          <span>${data.createdAt}</span>
        </div>
      </div>
      <div class="comments__new--comment-text">
        <p>${data.content}</p>
      </div>
      <div class="comments__new--btns">
        <div class="btn__like">
          <img
            class="btn-plus"
            id="btnPlus"
            src="${icons["icon-plus"]}"
            alt="plus-icon"
          />
          <label>${data.score}</label>
          <img
            class="btn-minus"
            id="btnMinus"
            src="${icons["icon-minus"]}"
            alt="minus-icon"
          />
        </div>
        <div class="btn__update">
        <button class="btn btn__update--delete">
          <img src="${icons["icon-delete"]}" alt="delete icon" /> Delete
        </button>
        <button class="btn btn__update--edit">
          <img src="${icons["icon-edit"]}" alt="edit icon" /> Edit
        </button>
      </div>
      </div>
    </div>
`;
  // commetsAddSection.innerHTML = '';
  commetsSection.insertAdjacentHTML("beforeend", markup);
}

const generateCurrentUserReplyComment = function (replyData, parent) {
  const markup = `
    <div class="comments__reply-container" data-id-number="${replyData.id}">
    <div class="commets__reply" data-id-number="${replyData.id}">
    <div class="comments__new--user-timeline">
    <div class="img__box">
    <img
        src="${
          images[replyData.user.image.png.substring(17).replace(".png", "")]
        }"
        alt="profile-img"
    />
    </div>
    <div class="username__box">
    <h1>${replyData.user.username}</h1>
    </div>
    <div class="current_user-tag">
    <label>you</label>
    </div>
    <div class="timeline__box">
    <span>${replyData.createdAt}</span>
    </div>
    </div>
    <div class="comments__new--comment-text">
    <p><span>@${replyData.replyingTo}</span> ${replyData.content}</p>
    </div>
    <div class="comments__new--btns">
    <div class="btn__like">
    <img
        class="btn-plus"
        id="btnPlus"
        src="${icons["icon-plus"]}"
        alt="plus-icon"
    />
    <label>${replyData.score}</label>
    <img
        class="btn-minus"
        id="btnMinus"
        src="${icons["icon-minus"]}"
        alt="minus-icon"
    />
    </div>
    <div class="btn__update">
    <button class="btn btn__update--delete">
      <img src="${icons["icon-delete"]}" alt="delete icon" /> Delete
    </button>
    <button class="btn btn__update--edit">
      <img src="${icons["icon-edit"]}" alt="edit icon" /> Edit
    </button>
    </div>
    </div>
    </div>
    </div>

`;

  parent.insertAdjacentHTML("afterend", markup);
};
