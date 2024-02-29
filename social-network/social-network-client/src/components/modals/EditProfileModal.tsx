import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Avatar, Input, Textarea} from "@nextui-org/react";
import { Data } from "@/utils/CurrentUserType";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useAtom } from "jotai";
import { TokenAtom } from "@/utils/TokenAtom";
import { useQueryClient } from "@tanstack/react-query";

type EditUser = {
    user_img: File
    first_name: string
    last_name: string
    email: string
    title: string
    description: string
}

export default function EditProfileModal({isOpen, onOpenChange, user}: {isOpen: boolean, onOpenChange: () => void, user: Data}) {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EditUser>()
    const [token, setToken] = useAtom(TokenAtom)

    const [selectedImage, setSelectedImage] = useState<File>()

    const [userDetails, setUserDetails] = useState({...user})

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    console.log();


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedImage(file);
        }
    };
    

    const updateDetails: SubmitHandler<EditUser> = async (data) => {
        console.log(data);
        
        const formData = new FormData();
        if (selectedImage !== undefined) {   
            formData.append("post_img", selectedImage);
            try {
                const response_image = await axios.post(`http://localhost:8055/files`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
                console.log(response_image.data);
            
            
                const userData = {
                    "avatar": response_image.data.data.id,
                    "first_name": data.first_name,
                    "last_name": data.last_name,
                    "email": data.email,
                    "title": data.title,
                    "description": data.description
                };
            
                const response_post = await axios.patch(`http://localhost:8055/users/${user.id}`, userData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                })
                console.log(response_post);
            
                queryClient.invalidateQueries({queryKey: ['current-user']})
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            try {
                const userData = {
                    "first_name": data.first_name,
                    "last_name": data.last_name,
                    "email": data.email,
                    "title": data.title,
                    "description": data.description
                };
            
                const response_post = await axios.patch(`http://localhost:8055/users/${user.id}`, userData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                })
                console.log(response_post);
            
                queryClient.invalidateQueries({queryKey: ['current-user']})
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit your details</ModalHeader>
              <ModalBody>
                <div className="flex flex-col justify-center items-center gap-4">
                    {
                        selectedImage ? <Avatar src={URL.createObjectURL(selectedImage)} size="lg" className="w-36 h-36"/> : <Avatar src={`http://localhost:8055/assets/${user.avatar}`} size="lg" className="w-36 h-36"/>
                    }
                    <form onSubmit={handleSubmit(updateDetails)} className="w-full flex flex-col gap-5 py-2">
                        <label htmlFor="imageUpload" className="relative flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-400 rounded-md p-3 cursor-pointer hover:border-gray-600">
                            <input
                                {...register("user_img")}
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute hidden"
                            />

                            <p className="">Upload Image</p>
                        </label>
                        <div className="w-full flex items-center gap-3">
                            <div className="w-full flex flex-col gap-2">
                                <Input
                                {
                                    ...register("first_name", {
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
                                name="first_name" value={userDetails.first_name} onChange={handleChange} className="w-full" variant="faded" color="primary"/>
                                {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                            <Input
                            {
                                ...register("last_name", {
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
                                name="last_name" value={userDetails.last_name} onChange={handleChange} className="w-full" variant="faded" color="primary"/>
                                {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
                            </div>
                        </div>
                        <Input
                        {
                            ...register("email", {
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
                        name="email" value={userDetails.email} onChange={handleChange} className="w-full" variant="faded" color="primary"/>
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                        <Input
                        {
                            ...register("title", {
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
                        name="title" value={userDetails.title} onChange={handleChange} className="w-full" variant="faded" color="primary"/>
                        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                        <Textarea
                        {
                            ...register("description", {
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
                        name="description" value={userDetails.description} onChange={handleChange} className="w-full" variant="faded" color="primary"/>
                        {errors.description && <p className="text-red-600">{errors.description.message}</p>}

                        <Button type="submit" color="primary" onPress={onClose}>
                            Update
                        </Button>
                    </form>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}



