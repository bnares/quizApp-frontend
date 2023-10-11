import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import UseForm from '../hooks/UseForm'
import Center from './Center'
import {createAPIEndpoint,ENDPOINTS} from "../api/index"
import useStateContext from '../hooks/useStateContext'
import {useNavigate} from "react-router-dom";

const initialValues =() =>{
    
    return {
        name:'',
        email:'',
    }
}

function Login() {

    const {context, setContext, resetContext} = useStateContext();
    const navigate = useNavigate()
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
    } = UseForm(initialValues);

    const login = (e)=>{
        e.preventDefault();
        if(validate()){
            createAPIEndpoint(ENDPOINTS.participants).post(values).then(resp=>{
                setValues(initialValues);
                setContext({participantId:resp.data.participantId});
                navigate("/quiz");
                
            }).catch(err=>{
                console.error(err);
            })
        }
        
    }

    const validate = ()=>{
        let temp = {};
        var pattern =new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/); 
        temp.name = values.name==''?'This Field is Required':'';
        temp.email = pattern.test(values.email) ? '':"Email is not valid.";
        setErrors(temp);
        return Object.values(errors).every(x=>x=='');
    }

    useEffect(()=>(
        resetContext()
    ),[])

  return (
    <Center>
        
        <Card sx={{width:400}}>
            <CardContent>
                <Box sx={{
                '& .MuiTextField-root':{
                    margin:1,
                    width:'90%',
                }
                }}>
                    <Typography variant="h3" sx={{my:3}}>
                        Quize App
                    </Typography>
                    <form noValidate autoComplete='off' onSubmit={login}>
                        <TextField 
                            name='email'
                            label="Email"
                            variant='outlined'
                            value={values.email}
                            onChange = {handleInputChange}
                            {...(errors.email && {error:true, helperText:errors.email})}
                        />
                        <TextField 
                            name='name'
                            value={values.name}
                            label="Name"
                            variant='outlined'
                            onChange={handleInputChange}
                            {...(errors.name && {error:true, helperText:errors.name})}
                        />
                        <Button 
                            type='submit'
                            variant='contained'
                            size='large'
                            sx={{
                                width:'90%',
                            }}
                        >
                            Start
                        </Button>
                    </form>
                </Box>
            </CardContent>
        </Card>
    </Center>
    
  )
}

export default Login