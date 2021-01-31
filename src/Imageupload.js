import { Button, Input, LinearProgress } from '@material-ui/core';
import React,{useState} from 'react'
import {db,storage} from './Firebase';
import firebase from 'firebase';
import './Imageupload.css';
function Imageupload({username}) {
    // console.log("username",username);
    const [caption,setCaption]=useState('');
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(0);

    const handlechange=(e)=>{
        if(e.target.files[0]) {
             setImage(e.target.files[0]);
            }
    }

    const handleclick=()=>{

        const uploadtask=storage.ref(`images/${image.name}`).put(image);

        uploadtask.on(
            'state_changed',(snapshot)=>{
                const progress=Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes)*100  );
                setProgress(progress);
            },
            (error)=>{
                console.log(error);
            },
            ()=>{
                storage.ref('images').child(image.name).getDownloadURL()
                .then(url=>{
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageurl:url,
                        username:username

                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }

        )


    }

    return (
        <>
        <div className="imageupload">
        <LinearProgress variant="determinate" max="100" className="imageupload__progress"  value={progress}/>
            <Input type="text" value={caption} placeholder="Enter your caption here .." onChange={(e)=>{setCaption(e.target.value)}}  />
            <Input type="file" onChange={handlechange} />
            <Button onClick={handleclick} > Upload  </Button>


        </div>


        </>
    )
}

export default Imageupload
