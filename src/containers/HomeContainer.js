import React, { useState } from 'react';
import ReadingContainer from './ReadingContainer';
import '../HomeTimer.css';
import bigTimer from '../assets/big-timer_1.svg';
import bigminus from '../assets/big-minus.svg';
import bigplus from '../assets/big-plus.svg';
import TodoList from '../todo';
import todo from '../assets/todo.svg';
import homeCat from '../assets/home-cat.svg';
import homeFrog from '../assets/home-frog.svg';
import homeDuck from '../assets/home-duck.svg';
import '../containers-css/HomeContainer.css';

const HomeContainer = () => {
  const [timerStarted, setTimerStarted] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const avatars = [homeCat, homeFrog, homeDuck];
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [initialTimerValue, setInitialTimerValue] = useState(40*60); // 40 minutes in seconds

  const convertSecondsToMinutes = (seconds) => {
    return seconds / 60;
  };
  
  const handleMinusClick = () => {
    // Don't allow timer to go below 5 minutes
    if (convertSecondsToMinutes(initialTimerValue) > 5) {
      setInitialTimerValue(prevValue => prevValue - 5*60);
    }
  };

  const handlePlusClick = () => {
    // Don't allow timer to go above 995 minutes
    if (convertSecondsToMinutes(initialTimerValue) < 995) {
      setInitialTimerValue(prevValue => prevValue + 5*60);
    }
  };

  const handleAvatarClick = () => {
    // Increment the index and cycle back to 0 if it exceeds the array length
    setCurrentAvatarIndex((prevIndex) => (prevIndex + 1) % avatars.length);
  }

  const handleBeginSession = () => {
    setTimerStarted(true);
    setIsBreak(false);
  };

  const handleBeginBreak = () => {
    setTimerStarted(true);
    setIsBreak(true);
  };


  return (
    <>
      {timerStarted ? (
        <div>
        <ReadingContainer
          currentAvatarIndex={currentAvatarIndex}
          initialTimerValue={initialTimerValue} //passes in seconds
        />
        </div>

      ) : (
        <div className='study-session'>
        <div className='study-options'>
          <div className='timer-container'>
          <div className='timer-container'>   
        <img src={bigTimer} className="timer-img" alt="timer image" />
        <div className='timer-btn'>
            <img onClick={handleMinusClick} src={bigminus} className="minus-btn" />
            <img onClick={handlePlusClick} src={bigplus} className="plus-btn" />
        </div>
        <span className="min-label">min</span>
        <span className="timer-value" id="timer-value">
          {convertSecondsToMinutes(initialTimerValue)}
        </span>
    </div>
          </div>
          <div className='avatar-container'>
          <img
            src={avatars[currentAvatarIndex]}
            className="avatar-img"
            onClick={handleAvatarClick}
          />
          </div>
          <div className='todo-container'>
            <p className='todo-text'>Today's Plan</p>
              
            <img src={todo} className="todo-img" alt="todo image"/> 
            <TodoList />
          </div>
          
        </div>
       <div className='start-btn'>
            
          <p onClick={handleBeginSession}>Begin new study session</p>
            {/*<button onClick={handleBeginBreak}>Take a break</button> */}
          
        </div>

      </div>
      )}
    </>
  );
}

export default HomeContainer;

  