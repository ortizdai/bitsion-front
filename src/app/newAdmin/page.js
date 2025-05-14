"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'

import React from "react";
import { useState } from "react";
import * as z from "zod"

import { Button } from "app/components/ui/button"
import { Input } from "app/components/ui/input"
import { Label } from "app/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "app/components/ui/card"

const formSchema = z.object({
    username: z.string({
      invalid_type_error: 'username must be a string',
      required_error: 'username is required.'
    }),
    email: z.string({
      invalid_type_error: 'email must be a string',
      required_error: 'email is required.'
    }),
    full_name: z.string({
      invalid_type_error: 'full_name must be a string',
      required_error: 'full_name is required.'
    }),
    password: z.string({
      invalid_type_error: 'password must be a string',
      required_error: 'password is required.'
    }).min(8, { message: 'Password must be at least 8 characters long' }),
  })

export default function NewClientForm({ params }) {
    const router = useRouter();

    const defaultFields = [
        { name: "username", label: "username", placeholder: "JuanPérez" },
        { name: "full_name", label: "full name", placeholder: "Juan Perez" },
        { name: "email", label: "email", placeholder: "juanperez@example" },
        { name: "password", label: "password", placeholder: "Password must be at least 8 characters long" },


    ];

    const [fields, setFields] = useState(defaultFields);
    const [attributes, setAttributes] = useState([]);
    const [newAttr, setNewAttr] = useState({ name: '', value: '' });
    
    const { handleSubmit, register, formState, reset } = useForm({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (values) => {
        try {
            const res = await fetch(`http://localhost:1234/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Error creating client');
            router.push(`/`);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-20">
            <Card>
                <CardHeader>
                    <CardTitle>New Admin</CardTitle>
                    <CardDescription>Fill out the form to add a new admin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {fields.map((field) => (

                            <div key={field.name} className="grid gap-3">
                                <Label htmlFor={field.name}>{field.label} </Label> {console.log(field.label, "field.name")}
                                <Input
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    type={field.name === "password" ? "password" : "text"}
                                    {...register(field.name)}
                                />
                                {formState.errors[field.name] && (
                                    <p className="text-red-500 text-sm">
                                        {formState.errors[field.name]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                        <Button type="submit" className="w-full" >New Admin</Button>
                    </form>
                </CardContent>
            </Card>
            <Button type="button" onClick={() => window.history.back()}>
                Back
            </Button>
        </div>
    )
}
