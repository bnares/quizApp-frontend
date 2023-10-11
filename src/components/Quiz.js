import React, { useContext, useEffect, useState } from 'react'
import useStateContext, { stateContext } from '../hooks/useStateContext'
import { BaseUrl, createAPIEndpoint, ENDPOINTS } from '../api';
import { Box, Card, CardContent, CardHeader, CardMedia, LinearProgress, List, ListItemButton, Typography } from '@mui/material';
import { getFormatedTime } from '../helper';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
function Quiz() {

  const {context, setContext} = useStateContext();
  const [qnIndex, setQnIndex] = useState(0);
  const [qns, setQns] = useState([]);
  const [timeTaken,setTimeTaken] = useState(0);
  const navigate = useNavigate();
  let timer

  const startTimer = ()=>{
    timer = setInterval(()=>{ //setInterval needs to be asigned to same variable so we have let timer
      setTimeTaken(prev=>prev+1);
    },[1000])
  }

  const addAnswearToContext = (answear)=>{
    console.log(answear);
    const options = qns[qnIndex].options.indexOf(answear);
    const contextData = JSON.parse(localStorage.getItem('context'));
    console.log("conexData");
    console.log(contextData);
    
      if(qnIndex<5){
        setQnIndex(prev=>prev+1)
        let answears = [...contextData.selectedOptions, {qnId:qns[qnIndex].qnId,selected:options}];
        setContext({selectedOptions:answears, timeTaken})
      
      }else{
        setContext({selectedOptions:[...contextData.selectedOptions], timeTaken:timeTaken});
      }
    console.log(context);
  }

  useEffect(()=>{
    createAPIEndpoint(ENDPOINTS.questions).fetch().then(resp=>{
      console.log("data");
      console.log(resp.data);
      setQns(resp.data);
      startTimer();
      setContext({selectedOptions:[]})
    }).catch(err=>console.error(err));
    return ()=>{clearInterval(timer)}
  },[])
  useEffect(()=>{
    if(context.selectedOptions.length==5){
      setQnIndex(0);
      navigate("/result");
    }
  },[context.selectedOptions.length])
  //console.log(context);
  return (
    
    <>
    
    {qns.length>0 && context.selectedOptions.length<=4 ?
    <Card sx={{
      maxWidth:640, 
      mx:'auto',
      mt:5,
      '& .MuiCardHeader-action':{
        m:0,
        alignSelf:'center'
      }
    }}>
      <CardHeader title={"Question "+(qnIndex+1)+" of 5"}
        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
      />
      {qns[qnIndex].imageName != null ? 
        <CardMedia
         component="img"
         image={BaseUrl+"Images/"+qns[qnIndex].imageName}
         sx={{
          width:'auto',
          m:'10px auto'
         }}
        /> : null }
      <Box>
        <LinearProgress 
          variant='determinate'
          value={((qnIndex+1)/5)*100}
        />
      </Box>
      <CardContent>
        <Typography variant='h3'>
          {qns[qnIndex].qnInWords}
        </Typography>
        <List>
          {qns[qnIndex].options.map((item,idx)=>(
            <ListItemButton key={idx} onClick = {()=>addAnswearToContext(item)}>
              <Box>
               <b>{String.fromCharCode(65+idx)}.</b> {item}
              </Box>
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
    : null}
  </>)
}

export default Quiz