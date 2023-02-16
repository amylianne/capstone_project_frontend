import Comment from "./Comment";
import { useState, useContext } from "react";
import CommentForm from "./CommentForm";
import { UserContext } from "../App";
import { Link } from "react-router-dom";


const SERVER_URL = "http://localhost:8080"



const Article = ({article}) => {

    const [user, setUser] = useContext(UserContext);

    const [comments, setComments] = useState(article.comments)
    const [numOfLikes, setNumOfLikes] = useState(article.numOfLikes);

    const[showCommentForm, setShowCommentForm] = useState(false);

    const [expanded, setExpanded] = useState(false);

    const commentComponent = comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} />
    })

    // Post Comment
    const postNewComment = (newComment) => {
        fetch(`${SERVER_URL}/comments`, {
            method: "POST",
            credentials:"include",
            // mode: "no-cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newComment),
            mode: 'cors'
        })

        .then((response) => response.json())
        .then((response) => {
            setComments([... comments, response]);
        });
    };


    const handleLikeClick = async () => {
        
          const response = await fetch(`${SERVER_URL}/articles/${article.id}/${user.id}`, {
            method: "PATCH",
            credentials:"include",
            mode: 'cors',
          });
          console.log(response);
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            setNumOfLikes(data.articleLikes.length);
            console.log(numOfLikes);
          }else {
            console.log(response);
          }
      };

      // Event listener to expand the article when the comment icon is clicked
      const handleCommentClick = (e) => {
        //checking if element has class name of the icon. if so, user has clicked on it
        if (e.target.classList.contains("close-button")) {
          // because icon has been clicked on, showCommentForm state set to be opposite of its current value.
          setShowCommentForm(!showCommentForm);
        } else {
          //
          setExpanded(!expanded);
        }
      };


    return ( 
        <>
         <section>
        <div
          className={`blog-card spring-fever${expanded ? " expanded" : ""}`}
        >
          <div className="title-content">
            <h3>{article.title}</h3>
            <div className="intro">
              <a href="#">Women and Lifestyle</a>
            </div>
          </div>
          <div className="card-info">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...
            <Link to="/article/articleinfo">Read Article</Link>
          </div>
          <div className="utility-info">
            <ul className="utility-list">
              <li onClick={handleLikeClick}>
                <span className="licon icon-like"></span> {numOfLikes}{" "}
              </li>
              <li onClick={handleCommentClick}>
                <span className="licon icon-com"></span> ...
              </li>
              <li>
                <span className="licon icon-dat"></span> {article.date}
              </li>
              <li>
                <span className="licon icon-tag"></span> {article.tag}
              </li>
            </ul>
          </div>
          <div className="gradient-overlay"></div>
          <div className="color-overlay"></div>
          {expanded && (
            <>
              <div className="comment-section">
                <ul>{commentComponent}</ul>
                <CommentForm
                  postNewComment={postNewComment}
                  articleId={article.id}
                />
              </div>
            </>
          )}
        </div>
    </section>


        </>

     );
}

 
export default Article;