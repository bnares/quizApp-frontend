import { Accordion, AccordionDetails, AccordionSummary, Box, CardMedia, List, ListItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BaseUrl } from '../api'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { green, grey, red } from '@mui/material/colors';

function Answer({qnAnswers}) {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel)=>(event,isExpanded)=> {
        setExpanded( isExpanded ? panel : false);
    }

    const markCorrectOrNot = (qna, idx)=>{
        if([qna.answear, qna.selected].includes(idx)){
            return { sx:{color:qna.answear==idx ? green[500]: red[500]}}
        }
    }

  return (
    <Box sx={{mt:5, width:'100%', maxWidth:640, mx:'auto'}}>
        {
            qnAnswers.map((item,idx)=>(
                <Accordion 
                    key={idx}
                    disableGutters
                    onChange={handleChange(idx)}
                    expanded = {expanded===idx}
                >
                    <AccordionSummary 
                        expandIcon={<ExpandCircleDownIcon sx={{
                            color: item.answear == item.selected ? green[500] : red[500]
                        }} />}
                    >
                        <Typography
                            sx={{width:'90%', flexShrink:0}}
                        >
                            {item.qnInWords}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{backgroundColor: grey[900]}}>
                        {
                            item.imageName ? 
                            <CardMedia 
                                component='img'
                                image={BaseUrl+"Images/"+item.imageName}
                                sx={{m:'10px auto', width:'auto'}}
                            ></CardMedia> : null
                        }
                                <List>
                                    {item.options.map((x,i)=>
                                        <ListItem key={i}>
                                            <Typography {...markCorrectOrNot(item,i)}>
                                                <b>
                                                    {String.fromCharCode(65+i)+"."} {x}
                                                </b>
                                            </Typography>
                                        </ListItem>
                                    )}
                                </List>
                            

                    </AccordionDetails>

                </Accordion>
            ))
        }
    </Box>
  )
}

export default Answer