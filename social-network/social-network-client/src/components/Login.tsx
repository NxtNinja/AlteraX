import { Auth } from "@/utils/AuthType";
import { R_tokenAtom, TokenAtom } from "@/utils/TokenAtom";
import { Button, Divider, Input } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { GrTasks } from "react-icons/gr";

type Inputs = {
    email: string
    password: string
  }


const Login = () => {
    const [token, setToken] = useAtom(TokenAtom)
    const [rtoken, setRToken] = useAtom(R_tokenAtom)
    const [invalid, setInvalid] = useState("")
    const [valid, setValid] = useState("")
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm<Inputs>()

    const loginUser: SubmitHandler<Inputs> = async (data) => {
        try {
            const req = await axios.post("http://localhost:8055/auth/login", {
                email: data.email,
                password: data.password
            })

            const res = req.data.data as Auth
            console.log(res);

            if (req.status === 200 && req.statusText === "OK") {
                setToken(res.access_token)
                setRToken(res.refresh_token)
                setValid("User verified!")
                router.push("/")
            }
        } catch (error: any) {
            console.log(error.response.data.errors[0].message);
            setInvalid(error.response.data.errors[0].message)
        }
    }
    return (
        <>
            <div className="flex flex-col w-[90%] lg:w-[30%] mx-auto justify-center items-center gap-6 h-screen">
                <form onSubmit={handleSubmit(loginUser)} className="w-full shadow-lg border border-slate-100 p-9 bg-white flex flex-col items-center rounded-lg space-y-5">
                    <GrTasks size={40}/>
                    <div className="flex flex-col justify-center items-center text-center gap-2">
                        <p className="text-center uppercase font-bold text-3xl">Welcome back!</p>
                        <p className="">Enter your email and password to login</p>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <Input
                        {
                            ...register("email", {
                                required: {
                                    value: true,
                                    message: "This filed is required"
                                },
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters required"
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Validation failed"
                                }
                            })
                        }
                        type="email" variant="faded" label="Enter email" color="primary" size="sm"/>
                        <div className="">
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <Input
                        {
                            ...register("password", {
                                required: {
                                    value: true,
                                    message: "This filed is required"
                                },
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters required"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Validation failed"
                                }
                            })
                        }
                        type="password" variant="faded" label="Enter password" color="primary" size="sm"/>
                        <div className="">
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                        {
                            invalid && (
                                <p className="text-red-600">
                                    {invalid}
                                </p>  
                            )
                        }
                        {
                            valid && (
                                <p className="text-emerald-600">
                                    {valid}
                                </p>
                            )
                        }
                        
                        <Button
                        isLoading={isSubmitting}
                        spinner={
                            <svg
                              className="animate-spin h-5 w-5 text-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                fill="currentColor"
                              />
                            </svg>
                          }
                        type="submit" className="w-full" color="primary">
                            <div className=""><AiOutlineLogin size={25}/></div>
                            <p className="font-bold">LOGIN</p>
                        </Button>
                    </div>
                <Divider className="bg-slate-300"/>
                <p className="flex gap-2 text-slate-700">
                    <span>Don't Have an account? </span>
                    <span className="font-bold"><Link href={"/auth/signup"}>Signup</Link></span>
                </p>
            </form>
            </div>
        </>
    );
}

export default Login;