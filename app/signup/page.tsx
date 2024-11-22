"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import {Eye,EyeOff} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'


const Signup = () => {  
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [VerfCode, setVerfCode] = useState("")
  const [VerfPending, setVerfPending] = useState(false)
  const {isLoaded,signUp,setActive}=useSignUp()
  const [ShowPassword, setShowPassword] = useState(false)
  const [Error, setError] = useState("")

  const router = useRouter();

  if(!isLoaded){
    return null;
  }

  async function Submit(e:React.FormEvent) {
    e.preventDefault();
    if(!isLoaded){ // Prevents submitting without complete loading
        return;
      }
    
    try {
        await signUp.create({
            emailAddress:email,
            password
        })
        await signUp.prepareEmailAddressVerification({
          strategy:'email_code'
        });
        setVerfPending(true);
    } catch (error:any) { 
        console.log(JSON.stringify(error,null,2));
        setError(error.errors[0].message)
    }
  }

  async function onPressVerify(e:React.FormEvent){
    e.preventDefault()
    if(!isLoaded){
      return;
    }

    try {
      const isComplete=await signUp.attemptEmailAddressVerification({code:VerfCode})
      if(isComplete.status!=='complete'){
        console.log(isComplete,null,2);
      }
      if(isComplete.status==='complete'){
        await setActive({session:isComplete.createdSessionId})
        router.push('/dashboard')
      }
    } catch (error:any) { 
      console.log(JSON.stringify(error,null,2));
      setError(error.errors[0].message)
    }
  }

  return(
    <>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>
              Sign Up for Todo Master
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!VerfPending ?(
              <form onSubmit={Submit} className='space-y-4'>
                <div className="space-y-2">
                  <Label htmlFor='email'>Email</Label>
                  <Input type="text"
                  id='email'
                  value={email}
                  onChange={(e)=>{setemail(e.target.value)}}
                  required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative'>
                    <Input type={ShowPassword?"text":'password'}
                    id='password'
                    value={password}
                    onChange={(e)=>{setpassword(e.target.value)}}
                    required />
                    <button
                    type='button'
                    onClick={()=>{setShowPassword(!ShowPassword)}}
                    className='absolute right-2 top-1/2 -translate-y-1/2'>
                      {ShowPassword?(
                        <EyeOff className='h-4 w-4 text-gray-500'/>
                      ):(
                        <Eye className='h-4 w-4 text-gray-500'/>
                      )}
                    </button>
                  </div>
                </div>
                {Error &&(
                  <Alert variant={'destructive'}>
                    <AlertDescription>{Error}</AlertDescription>
                  </Alert>
                )}
                <Button type='submit' className='w-full'>
                  Sign Up
                </Button>
              </form>
            ):(
              <form onSubmit={onPressVerify} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='code'>Verification Code</Label>
                  <Input id='code' type='text'
                  placeholder='Enter the Verification Code'
                  value={VerfCode}
                  onChange={(e)=>{setVerfCode(e.target.value)}}
                  required/>
                </div>
                {Error && (
                  <Alert variant={'destructive'}>
                    <AlertDescription>{Error}</AlertDescription>
                  </Alert>
                )}
                <Button type='submit' className='w-full'>
                  Verify Email
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className='justify-center'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{" "}
              <Link
              href={"/signin"}
              className='font-medium text-primary hover:underline'>
                Sign in
              </Link> 
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default Signup