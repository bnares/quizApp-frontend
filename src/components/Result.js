import { Alert, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useStateContext from '../hooks/useStateContext'
import {getFormatedTime} from '../helper/index'
import { useNavigate } from 'react-router-dom';
import { green } from '@mui/material/colors';
import Answer from './Answer';

function Result() {
  const {context, setContext} = useStateContext();
  const [score, setScore] = useState(0);
  const [qnAnswers, setQnAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const calculateScore = qna =>{
    let tempScore = qna.reduce((acc,curr)=>{
      return curr.answear == curr.selected ? acc+1 : acc;
    },0);
    setScore(tempScore);
  }

  const restart = ()=>{
    setContext({
      timeTaken:0,
      selectedOptions:[]
    })
    navigate("/quiz");
  }

  const submitScore = ()=>{
    const data =JSON.parse(localStorage.getItem('context'));
    const participantId = data.participantId;
    var dataToSend = {participantId:participantId, score : score, timeTaken: timeTaken};
    createAPIEndpoint(ENDPOINTS.participants).put(participantId,dataToSend).then(resp=>{
      console.log("done");
      console.log(resp);
      setShowAlert(true);
      setTimeout(()=>{
        setShowAlert(false);
      },4000)
    }).catch(err=>console.log(err))
  }

  useEffect(()=>{
    console.log("parameter Data")
    var parameterData = JSON.parse(localStorage.getItem('context'));
    console.log(parameterData);
    setTimeTaken(parameterData.timeTaken);
    var questionsIdSelected = [];
    parameterData.selectedOptions.forEach(element => {
      questionsIdSelected.push(element.qnId);
    });
    createAPIEndpoint(ENDPOINTS.questions).postResult("GetAnswers",questionsIdSelected).then(resp=>{
      console.log("response");
      console.log(resp.data);
      const qna = parameterData.selectedOptions
          .map(x=>({
            ...x,
            ...(resp.data.find(y=>x.qnId==y.qnId))
          }))
          console.log("qna");
          console.log(qna);
          setQnAnswers(qna);
          calculateScore(qna);
    })
    .catch(err=> console.error(err));
  },[])
  return (
    <>
      <Card sx={{mt:5, display:'flex', width:'100%', maxWidth:'640', mx:'auto'}}>
        <Box sx={{display:'flex', flexDirection:'column', flexGrow:1}}>
          <CardContent sx={{flex:'1 0 auto', textAlign:'center'}}>
            <Typography variant='h4'>Congratulations</Typography>
            <Typography variant='h6'>YOUR SCORE</Typography>
            <Typography variant='h5' sx={{fontWeight:600}}>
              <Typography variant='span' color={green[500]}>
                {score}
              </Typography>/5
            </Typography>
            <Typography variant='h6'>
              Took {getFormatedTime(timeTaken)} mins
            </Typography>
            <Button variant='contained' 
              sx={{mx:1}}
              size='small'
              onClick={submitScore}
            >
              Submit
            </Button>
            <Button 
              variant='contained'
              sx={{mx:1}}
              size='small'
              onClick={restart}
            >
              Re-try
            </Button>
            {showAlert ? <Alert 
              severity="success"
              variant='string'
              sx={{width:'60%', m:'auto'}}
              >
              Score Updated
            </Alert> : null}
          </CardContent>
        </Box>
        <CardMedia 
          component='img'
          sx={{width:220}}
          image="./result.png"
        />
      </Card>
      <Answer 
        qnAnswers = {qnAnswers}
      />
    </>
  )
}

export default Result