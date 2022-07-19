import {React,useEffect} from 'react';
import { useStopwatch } from '../index';
import Button from './Button';
import TimerStyled from './TimerStyled';




export default function UseStopwatchDemo({starttimer,Setstarttimer}) {
  const {

    seconds,
    minutes,
    hours,
    days,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: starttimer });

  // console.log("ssss:"+starttimer);

  useEffect(()=>{

    if(starttimer)
    {
    start()
    }

    else
    {
      pause()
    }
  },[starttimer])
  return (
    <div>
      <h2>Timer</h2>
      <TimerStyled seconds={seconds} minutes={minutes} hours={hours} days={days} starttimer={starttimer} />
    </div>
  );
}
