import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import { useAuth } from '../../../Context/AuthContext.ts';
import {useNavigate} from 'react-router-dom';
import { loginschema} from '../schema/LoginSchema';
import type { LoginSchema } from '../schema/LoginSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from  "@/components/ui/input.tsx";
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import FormError from '../../components/FormError.tsx';
import {Eye, EyeOff} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'

const AdminLogin = () =>{
    const {logIn, user, logOut} = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit, formState:{errors}} = useForm<LoginSchema>({resolver:zodResolver(loginschema)});

    const onSubmit =  async(data:LoginSchema) => {
        try{
        const role = await logIn(data.email, data.password);
        if(role === "admin") navigate("/admin");
        else navigate("/");
        } catch(error){
            console.error("Login failed", error);
            alert("Login failed! Check your credentials.")
        };
    };

    //navigate after login if user is admin
    useEffect(() =>{
        if(user?.role === "admin"){
            navigate("/admin");
        }
    },[user, navigate]);

    if(user){
    return(
       <div className='flex justify-center items-center w-full'>
        <Card className="w-full max-w-md shadow-lg rounded-xl border border-white/20 bg-white/60">
            <CardHeader>
                <CardTitle className='text-center text-xl font-semibold'>
                {user.role === 'admin' ? 'Admin is loggedIn' : 'User  loggedIn'}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-center'>
        {user.role === 'admin' ? (<p>Welcome, Admin! You can create forms.</p>):(
            <p>You are logged in as a user, but You can not create forms.</p>
        )}
        <Button className='w-full' onClick = {logOut}>Logout</Button>
         </CardContent>
        </Card>
       </div>
    );
    }

    return(
        <div className='flex justify-center items-center w-full rounded-xl border border-white/20'>
            <Card className="w-full max-w-md shadow-lg rounded-xl border border-white/20 backdrop-blur-md p-6">
            <CardHeader className='text-center mb-6'>
                <CardTitle className="text-3xl font-bold">
                    Admin Login 
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-1'>
            <Label htmlFor = "email">Email</Label>
            <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete = "off"
            {...register("email")}
            />
            <FormError message={errors.email?.message}/>
            </div>

            <div className='space-y-1 relative'>
                <Label htmlFor = "password">Password</Label>
                <div className='relative'>
                <Input
                id = "password"
                type = {showPassword ? "text" : "password"}
                placeholder = "Enter your password"
                autoComplete = "off"
                {...register("password")}
                className='pr-10'
                />
                {/* Toggle Button */}
                <button type="button" onClick = {() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 transition">
                    {showPassword ? <EyeOff className="h-5 w-5 md:h-6" size={18}/> :<Eye className='h-5 w-5 md:h-6 md:w-6' size = {18}/>}
                </button>
                </div>
               <FormError message = {errors.password?.message}/>
            </div> 

            {/* Submit button */}
            <Button type="submit" className = "w-full h-11 font-semibold flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition rounded-xl">Sign In</Button>
        </form>
         </CardContent>
          </Card>
         </div>
    );
};

export default AdminLogin