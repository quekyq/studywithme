import React, { useState, useRef, useEffect } from "react";
import smalltimer from '../assets/small-timer.svg';
import smallplus from '../assets/small-plus.svg';
import smallminus from '../assets/small-minus.svg';
import EndSessionContainer from './EndSessionContainer';
import ToiletBreakContainer from './ToiletBreakContainer';
import end from '../assets/end.svg';
import toilet from '../assets/toilet.svg';
import '../containers-css/ReadingContainer.css';
import frogTable from '../assets/frogtable.png';
import catTable from '../assets/cattable.png';
import duckTable from '../assets/ducktable.png';
import BreakContainer from './BreakContainer';
import Music from "../music";
import '../Timersession.css';


const ReadingContainer = ({ currentAvatarIndex, initialTimerValue}) => { // takes in seconds
   // Constants
   const [buttonClick, setButtonClick] = useState(false);
   const [isToiletBreak, setIsToiletBreak] = useState(false);
   const [isEndSession, setIsEndSession] = useState(false);
   const [isBreak, setIsBreak] = useState(false);
   const [isPaused, setIsPaused] = useState(false);
   const Ref = useRef(null);
   const [timer, setTimer] = useState("00:00:00");
   const [totalMinutes, setTotalMinutes] = useState(initialTimerValue / 60); //converts seconds to minutes
   const avatarImages = [catTable, frogTable, duckTable];
   const [currentTimerValue, setCurrentTimerValue] = useState(0);
   const [spotifyEmbedKey, setSpotifyEmbedKey] = useState(null);
 
   // Transition Functions
   const handleEndSession = () => {
	 setButtonClick(true);
	 setIsEndSession(true);
  //  sessionStorage.clear();
  //  setSpotifyEmbedKey(Date.now());
   };
 
   const parseTimeToSeconds = (timeString) => {
	 const [hours, minutes, seconds] = timeString.split(':').map(Number);
	 return hours * 3600 + minutes * 60 + seconds;
   };
 
   const handleToiletBreak = () => {
	 setButtonClick(true);
	 setIsToiletBreak(true);
	 const { hours, minutes, seconds } = getTimeRemaining();
	 const formattedTime = `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}`;
	 setCurrentTimerValue(formattedTime);
   };
 
   // Timer functions
   const convertSecondsToMinutes = (seconds) => {
	 return seconds / 60;
   };
 
   const getTimeRemaining = (e) => {
	 const total = Date.parse(e) - Date.parse(new Date());
	 const seconds = Math.floor((total / 1000) % 60);
	 const minutes = Math.floor((total / 1000 / 60) % 60);
	 const hours = Math.floor((total / 1000 / 60 / 60) % 24);
 
	 if (hours == 0 && minutes == 0 && seconds == 0) {
	   setIsBreak(true);
	 }
	 return { total, hours, minutes, seconds };
   };
 
   const clearTimer = (deadline) => {
	 // Clear any existing interval
	 if (Ref.current) clearInterval(Ref.current);
 
	 // Update the timer immediately
	 startTimer(deadline);
 
	 // Set up a new interval to update the timer every second
	 const id = setInterval(() => {
	   if (!isPaused) {
		 startTimer(deadline);
	   }
	 }, 1000);
	 Ref.current = id;
   };
 
   const getDeadTime = (minutes) => {
	 let deadline = new Date();
	 deadline.setMinutes(deadline.getMinutes() + minutes);
	 return deadline;
   };
 
   const formatTime = (seconds) => {
	 const hours = Math.floor(seconds / 3600);
	 const minutes = Math.floor((seconds % 3600) / 60);
	 const remainingSeconds = seconds % 60;
 
	 return (
	   (hours < 10 ? "0" : "") + hours + ":" +
	   (minutes < 10 ? "0" : "") + minutes + ":" +
	   (remainingSeconds < 10 ? "0" : "") + remainingSeconds
	 );
   };
 
   const startTimer = (e) => {
	 let { total, hours, minutes, seconds } = getTimeRemaining(e);
	 if (total >= 0) {
	   setTimer(
		 (hours > 9 ? hours : "0" + hours) +
		 ":" +
		 (minutes > 9 ? minutes : "0" + minutes) +
		 ":" +
		 (seconds > 9 ? seconds : "0" + seconds)
	   );
	 }
   };
 
   const getTimeInSeconds = (timeString) => {
     const [hours, minutes, seconds] = timeString.split(':').map(Number);
     return hours * 3600 + minutes * 60 + seconds;
   };

   const formatTimeFromSeconds = (totalSeconds) => {
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = totalSeconds % 60;
     
     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
   };

   const handlePlusClick = () => {
     // Get current time in seconds
     const currentTimeInSeconds = getTimeInSeconds(timer);
     // Add 5 minutes (300 seconds)
     const newTimeInSeconds = currentTimeInSeconds + 300;
     // Update the timer display
     setTimer(formatTimeFromSeconds(newTimeInSeconds));
     
     // Update deadline for the timer
     const newDeadline = new Date();
     newDeadline.setSeconds(newDeadline.getSeconds() + newTimeInSeconds);
     clearTimer(newDeadline);
   };

   const handleMinusClick = () => {
     // Get current time in seconds
     const currentTimeInSeconds = getTimeInSeconds(timer);
     // Subtract 5 minutes (300 seconds), but don't go below 0
     const newTimeInSeconds = Math.max(0, currentTimeInSeconds - 300);
     // Update the timer display
     setTimer(formatTimeFromSeconds(newTimeInSeconds));
     
     // Update deadline for the timer
     const newDeadline = new Date();
     newDeadline.setSeconds(newDeadline.getSeconds() + newTimeInSeconds);
     clearTimer(newDeadline);
   };
 
   const handlePauseClick = () => {
	 setIsPaused(!isPaused);
   };
 
   useEffect(() => {
	 const initialDeadline = getDeadTime(totalMinutes);
	 clearTimer(initialDeadline);
 
	 return () => {
	   if (Ref.current) clearInterval(Ref.current);
	 };
   }, [totalMinutes, isPaused]);
 
   const onClickReset = () => {
	 clearTimer(getDeadTime());
   };
 
  // Html
  return (
    isBreak ? (
      <BreakContainer
      currentAvatarIndex={currentAvatarIndex}
	  initialTimerValue={initialTimerValue} //seconds
	  breakTimeValue={10} //minutes
      />
    ) : (
    buttonClick ? (
      isToiletBreak ? ( 
        <div>
          <ToiletBreakContainer
          currentAvatarIndex={currentAvatarIndex}
		      currentTimerValue={parseTimeToSeconds(timer)}
          />
        </div>
      ) : (
        <div>
          <EndSessionContainer
          currentAvatarIndex={currentAvatarIndex}/>
        </div>
      )
    ) : (
      <div className="study-session-container">
        {/* Avatar Layout */}
        <img src={avatarImages[currentAvatarIndex]} alt={`Avatar ${currentAvatarIndex + 1}`} className="avatar-desk-image" />
        <div className="small-timer-container">
          {/* End Session Button Layout */}
          <img src={end} onClick={handleEndSession} className="end-reading-btn" />
          {/* Timer Layout */}
          <div className='small-timer-btn'>
					<img src={smallminus} onClick={handleMinusClick} className="small-minus-btn" />
					<img src={smallplus} onClick={handlePlusClick} className="small-plus-btn" />
				</div>
				<img src={smalltimer} className="small-timer"/>
				<div className="actual-timer">{timer}</div>
        {/* Toilet Break Button Layout */}
          <img src={toilet} onClick={handleToiletBreak} className="start-toilet-btn" />
        </div>
      </div>
    )
  )
  )
}

export default ReadingContainer;

