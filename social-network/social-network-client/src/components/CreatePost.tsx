import { useAtom } from "jotai";
import Layout from "./Layout";
import { TokenAtom } from "@/utils/TokenAtom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CurrentUser } from "@/utils/CurrentUserType";
import { Avatar, Button, Textarea } from "@nextui-org/react";
import { AiTwotoneFileImage } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { ReactEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingAtom } from "@/utils/LoadingAtom";
import LoadingState from "./Reusable/LoadingState";

type Inputs = {
    post_title: string
    post_img: FileList
}


const CreatePost = () => {
    const [token, setToken] = useAtom(TokenAtom)
    const [load, setLoad] = useAtom(LoadingAtom)

    const [selectedImage, setSelectedImage] = useState<File | undefined>()

    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm<Inputs>()

      const createPost: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
        
        
        const formData = new FormData();
        if (selectedImage !== undefined) {   
            // formData.append("post_title", data.post_title);
            formData.append("post_img", selectedImage);
        }

        try {
            const response_image = await axios.post("http://localhost:8055/files", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response_image.data);


            const postData = {
                "post_title": data.post_title,
                "post_img": response_image.data.data.id
            };

            const response_post = await axios.post("http://localhost:8055/items/posts", postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response_post);

            if (response_image.status === 200 && response_image.statusText === "OK" && response_post.status === 200 && response_post.statusText === "OK") {   
                router.push("/")
            }
        } catch (error) {
            console.error("Error:", error);
        }
      }

        //Fetch current user
        const {data, isLoading, isFetching, isFetched, isSuccess} = useQuery({
            queryKey: ['current-user', token],
            queryFn: async () => {
              const res = await axios.get("http://localhost:8055/users/me", {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
              const data = res.data as CurrentUser
        
              
              
              return data.data
            }, 
            refetchOnWindowFocus: false
          })

        const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target?.files;
            if (files && files.length > 0) {
                const file = files[0];
                setSelectedImage(file);
            }
        };

        useEffect(() => {
            if (isLoading || isFetching) {
              setLoad(true)
            } else{
              setLoad(false)
            }
          }, [isLoading, isFetching])

          if (isLoading || isFetching) {
            return <LoadingState/>
          }

          if (isFetched && isSuccess) {
            return (
                <>
                    <Layout>
                        <div className="md:ml-[15%] md:w-[85%] w-full space-y-12 md:p-6 p-2 border h-[100dvh] overflow-auto">
                        <div className="flex w-full justify-between items-center">
                            <div className="md:text-4xl text-xl font-bold">Create a post</div>
                            <div className="flex items-center gap-2">
                            <p className="">Welcome, <span className="font-bold">{data?.first_name}</span></p>
                                    <Avatar size="lg" src={`http://localhost:8055/assets/${data?.avatar}`}/>
                            </div>
                        </div>
                        <div className="w-full space-y-6">
                        <form onSubmit={handleSubmit(createPost)} className="w-full space-y-4">
                            <Textarea
                            {
                                ...register("post_title", {
                                    required: {
                                        value: true,
                                        message: "This filed is required"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Minimum 3 characters required"
                                    },
                                    pattern: {
                                        value: /^[\p{L}\p{N}\s\d\s.:;!?()[\]{}'"`*_#+=<>$%^&|\\/,@-]+$/u,
                                        message: "Validation failed"
                                    }
                                })
                            }
                                variant={"underlined"}
                                labelPlacement="outside"
                                placeholder="Write something about your post"
                                className="md:w-[80%]"
                                color="primary"
                            />
                            {errors.post_title && <p className="text-red-600">{errors.post_title.message}</p>}
                            <label htmlFor="imageUpload" className="relative flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-400 rounded-md md:w-[80%] h-96 cursor-pointer hover:border-gray-600">
                                <input
                                    {...register("post_img", {
                                        required: {
                                            value: true,
                                            message: "an image needs to be uploaded"
                                        }
                                    })}
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute hidden"
                                    />
                                {selectedImage ? (
                                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="w-full h-full object-contain" />
                                    ) : (
                                    <div className="text-gray-500 flex justify-center items-center flex-col gap-3">
                                        <AiTwotoneFileImage size={70}/>
                                        <p className="text-xl">Upload Image</p>
                                    </div>
                                )}
                            </label>
                            {errors.post_img && <p className="text-red-600">{errors.post_img.message}</p>}
                            <div className="md:w-[80%] flex justify-between">
                                <div className="">
                                    {
                                        selectedImage && (
                                            <Button onClick={() => setSelectedImage(undefined)} color="danger" size="lg" className="text-xl">Remove Image</Button>
                                        )
                                    }
                                </div>
                                <Button type="submit" color="primary" className="text-xl" size="lg">Post</Button>
                            </div>
                        </form>
                        </div>
                        </div>
                    </Layout>
                </>
            );
          }
        
}

export default CreatePost;