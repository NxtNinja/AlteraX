import { Button, Divider, Input } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { GrTasks } from "react-icons/gr";

type Inputs = {
    first_name: string
    last_name: string
    email: string
    password: string
  }


const Signup = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm<Inputs>()

    const createUser: SubmitHandler<Inputs> = async (data) => {
        try {
            const req = await axios.post("http://localhost:8055/users", {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password
            })

            const res = req.data.data
            console.log(res);

            if (req.status === 200 && req.statusText === "OK") {
                    router.push("/auth/login")
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <>
            <div className="flex flex-col w-[90%] lg:w-[30%] mx-auto justify-center items-center gap-6 h-screen">
                <form onSubmit={handleSubmit(createUser)} className="w-full p-9 border border-slate-100 shadow-lg bg-white flex flex-col items-center rounded-lg space-y-5">
                    <GrTasks size={40}/>
                    <div className="flex flex-col justify-center items-center text-center gap-2">
                        <p className="text-center uppercase font-bold text-3xl">Welcome user!</p>
                        <p className="">Enter your details to create an account</p>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="flex flex-col justify-center gap-3">
                            <Input
                            {
                                ...register("first_name", {
                                    required: {
                                        value: true,
                                        message: "This filed is required"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Minimum 3 characters required"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z]+(?:[\s.']+?[a-zA-Z]+)*$/,
                                        message: "Validation failed"
                                    }
                                })
                            }
                            type="text" variant="faded" label="Enter first name" color="primary" size="sm"/>
                            <div className="">
                                {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
                            </div>
                            <Input
                            {
                                ...register("last_name", {
                                    required: {
                                        value: true,
                                        message: "This filed is required"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Minimum 3 characters required"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z]+(?:[\s.']+?[a-zA-Z]+)*$/,
                                        message: "Validation failed"
                                    }
                                })
                            }
                            type="text" variant="faded" label="Enter last name" color="primary" size="sm"/>
                            <div className="">
                                {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
                            </div>
                        </div>
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
                            <p className="font-bold">SIGNUP</p>
                        </Button>
                    </div>
                <Divider className="bg-slate-300"/>
                <p className="flex gap-2 text-slate-700">
                    <span>Have an account? </span>
                    <span className="font-bold"><Link href={"/auth/login"}>Login</Link></span>
                </p>
            </form>
            </div>
        </>
    );
}

export default Signup;