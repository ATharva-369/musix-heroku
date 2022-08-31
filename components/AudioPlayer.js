import React, {useState, useref, useRef, useEffect}from 'react'
import styles from '../styles/AudioPlayer.module.css'
import {AiFillBackward} from 'react-icons/ai'
import {AiFillForward} from 'react-icons/ai'
import {BsFillPlayFill} from 'react-icons/bs'
import {BsFillPauseFill} from 'react-icons/bs'

const AudioPlayer = () => {
  // state 
  const [isPlaying, setIsPlaying] = useState();  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [song, setCurrentSong] = useState(0);
  const [totalSongs, setTotalSongs] = useState(2);

  //   references
  var audioPlayer = useRef(); //reference our audio component
  var progressBar = useRef(); //reference to our progress bar
  var animationRef = useRef(); //reference to animation

  useEffect(()=>{
    const seconds = Math.floor(audioPlayer.current.duration)
    setDuration(seconds)
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) =>{
    const minutes = Math.floor(secs/60);
    const returnedMinutes = minutes < 10? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const playPause = () =>{
    const prevValue = isPlaying
    setIsPlaying(!prevValue)
    if (prevValue)
    {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    else{
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }

  const whilePlaying = () =>{
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying)
  }

  const rangeChange = () =>{
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime(); 
  }

  const changePlayerCurrentTime = ()=>{
    progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value/duration * 100}%`)
    setCurrentTime(progressBar.current.value)   
  }
  const backTen = () =>{
    progressBar.current.value = Number(progressBar.current.value) - 10;
    rangeChange();
  }
  const forwardTen = () =>{
    progressBar.current.value = Number(progressBar.current.value) + 10;
    rangeChange();
  }
  const songChange = () =>{
    if (song < totalSongs-1){
    setCurrentSong(song+1);
    }
    else{
      setCurrentSong(0);
    }
  }

  return (
    <div className={styles.audioPlayer}>
        {/* <input type="text" onChange={(val)=>{setTotalSongs(Number(val))}}></input> */}
        <audio ref={audioPlayer} src={`/songs/${song}.mp3`} preload='metadata' ></audio>

        <button onClick={backTen} className={styles.forwardBackward}><AiFillBackward/></button>
       
        <button onClick={playPause} className={styles.playPause}>
            {isPlaying ? <BsFillPlayFill /> : <BsFillPauseFill/>}
        </button>   

        <button onClick={forwardTen} className={styles.forwardBackward}><AiFillForward/></button>

        {/* current time */}
        <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div>
            <input ref={progressBar} step="0.05" type="range" className={styles.progressBar} defaultValue="0" onChange={rangeChange}></input>
        </div>

        {/* duration */}
        <div className={styles.duration}>{duration && calculateTime(duration)}</div>
        <button onClick={songChange} className={styles.forwardBackward}><AiFillForward/></button>
    </div>
  )
}

export {AudioPlayer}