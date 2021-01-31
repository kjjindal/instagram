import './App.css';
import React,{useEffect, useState} from 'react';
import Post from './Post';
// import firebase from 'firebase';
import {db,auth} from './Firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Imageupload from './Imageupload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const [posts,setposts]=useState([]);
  const [open,setopen]=useState(false);
  const [openSignIn,setopenSignIn]=useState(false);
  const classes=useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);




useEffect(()=>{
  db.collection('posts').orderBy('timestamp','desc').onSnapshot((snapshot)=>{
    setposts(snapshot.docs.map(doc=>({id:doc.id,post:doc.data()})));
  })


},[]);

function handleClose(){

  setopen(false);

}
//signup page 
function signup(e){
  e.preventDefault();
  auth.createUserWithEmailAndPassword(email,password).then((authUser)=>{
      authUser.user.updateProfile({
        displayName:username,
      })
  }).catch((error)=>{
    alert(error.message)
  })
}

useEffect(()=>{
 const unsubscribe=auth.onAuthStateChanged((authUser)=>{
    if(authUser){
       setUser(authUser);
       if(authUser.displayName){
        
       }
       else{
         return authUser.updateProfile({
           displayName:username,
         })
       }
    }
    else{
      setUser(null)

    }
  })

  return ()=>{
    unsubscribe();
  }
},[user,username]);

function signIn(e){
  e.preventDefault();
  auth.signInWithEmailAndPassword(email,password)
  .catch((error)=>{
    alert(error.message)
  })
  setopenSignIn(false);

}
  return (
    <div className="app">
    
    <Modal
  open={open}
  onClose={handleClose}
  
>
 <div style={modalStyle} className={classes.paper}>
 <form className="app__signup">
    <center>
      <img className="app__headerimage"  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" />
      </center>
      
      
      <Input type='text'  onChange={(e)=>{setEmail(e.target.value)}} value={email}  placeholder="email"   />
      <Input type='username'  onChange={(e)=>{setUsername(e.target.value)}} value={username}  placeholder="username"   />
      <Input type='password'  onChange={(e)=>{setPassword(e.target.value)}} value={password}  placeholder="password"   />
      <Button onClick={signup} > SignUp </Button>
 </form>
     
    </div>
</Modal>
<Modal
  open={openSignIn}
  onClose={handleClose}
  
>
 <div style={modalStyle} className={classes.paper}>
 <form className="app__signup">
    <center>
      <img className="app__headerimage"  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" />
      </center>
      
      
      <Input type='text'  onChange={(e)=>{setEmail(e.target.value)}} value={email}  placeholder="email"   />
      <Input type='password'  onChange={(e)=>{setPassword(e.target.value)}} value={password}  placeholder="password"   />
      <Button onClick={signIn} > SignIn </Button>
 </form>
     
    </div>
</Modal>

      <div className="app__header">
        <img className="app__headerimage"  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" />
         
        {user ? (<Button onClick={()=>{auth.signOut()  }} >  Logout </Button>) : (
          <div className="app__logincontainer">
          <Button onClick={()=>{setopenSignIn(true)  }} >  SignIn </Button>
          <Button onClick={()=>{setopen(true)  }} >  SignUp </Button>


          </div>
           )   }
      </div>

      <div className="app__posts">
      <div className="app__posts__left">
{
        posts.map(({id,post})=>{
          return  <Post key={id} username={post.username} user={user} imageurl={post.imageurl} caption={post.caption} postid={id} />
        })
      }
      </div>
      <div className="app__posts__right">
        
<InstagramEmbed
  url='https://instagram.com/p/B_uf9dmAGPw/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
        </div>
        
      </div>
  
    
      
    {user ?[console.log("user",user),<Imageupload username={user.displayName} />]:(<h3> Login to Upload  </h3>)}
      

    </div>
  );
}

export default App;
