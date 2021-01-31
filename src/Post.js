import React, { useState,useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './Firebase';
import  firebase from 'firebase';

//instead of props we use {propselement,propselement,propselement}
function Post({username,caption,imageurl,postid,user}) {
    const [comment,setComment]=useState('');
    const [comments,setComments]=useState([]);


    useEffect(()=>{
        let unsubscribe;
        if(postid){
            unsubscribe=db.collection('posts').doc(postid).collection('comments').orderBy('timestamp','desc').onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }

        return ()=>{
            unsubscribe();
        }

    },[postid]);

    function postcomment(e){
        e.preventDefault();
        db.collection('posts').doc(postid).collection('comments').add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })



    }

    return (
        <>
        <div className="post">
        <div className="post__header">
        <Avatar className="post__avatar" src="https://source.unsplash.com/user/erondu/1600x900" alt="username" />
        <h5> {username}</h5>
        </div>
            <img className="post__image" src={imageurl} alt="postimage" />
            <h4 className="post__text"> <strong>{username}</strong> {caption} </h4>
            <div className="post__comment">
            {/* {console.log(comments,typeof(comments))} */}

                {comments.map((val)=>{
                        return <p className="post__comment__text">  
                        <strong >  {val.username} </strong>{val.text}
                        
                        </p>
                    })
                }
            </div>
            {user &&  
                <form className="post__commentbox">
                <input 
                    type="text"
                    placeholder="comment"
                    className="post__input"
                    value={comment}
                    onChange={(e)=>{setComment(e.target.value)}}
                />
                <button 
                   disabled={!comment}
                   onClick={postcomment}
                   className="post__button"
                
                
                 >
                    post
                </button>
            </form>
            }
         
        </div>
        </>
    )
}

export default Post
