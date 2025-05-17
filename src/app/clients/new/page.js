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
    full_name: z.string({
        invalid_type_error: 'full_name must be a string',
        message: 'full name is required.'
    }).min(1),
    age: z.coerce.number().int().positive(),
    gender: z.string({
        invalid_type_error: 'full_name must be a string',
        required_error: 'full_name is required.'
    }).min(1),
    state: z.string().min(1),
    attributes: z.array(z.object({
        name: z.string().min(1),
        value: z.string().min(1),
    })).optional(),
    identification: z.coerce.number().int().positive(),
})

export default function NewClientForm({ params }) {
    const router = useRouter();

    const defaultFields = [
        { name: "full_name", label: "Full Name", placeholder: "Juan Pérez" },
        { name: "identification", label: "Identification", placeholder: 12345678 },
        { name: "age", label: "Age", placeholder: 35 },
        { name: "gender", label: "Gender", placeholder: "Male" },
        { name: "state", label: "State", placeholder: "Active" },

    ];

    const [fields, setFields] = useState(defaultFields);
    const [attributes, setAttributes] = useState([]);
    const [error, setError] = useState(null)
    
    const { handleSubmit, register, formState, reset } = useForm({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (values) => {
        setError(null)
        try {
            const res = await fetch(`http://localhost:1234/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
                credentials: 'include',
            });
            if(res.status === 401){
                throw new Error("Unauthorized");
            }
            if (!res.ok) throw new Error('Error creating client');
            const responseData = await res.json();
            const userId = responseData.id;
            router.push(`/clients/new/attributes/${userId}`);
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-20">
            <Card>
                <CardHeader>
                    <CardTitle>New Customer</CardTitle>
                    <CardDescription>Fill out the form to add a new customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {fields.map((field) => (

                            <div key={field.name} className="grid gap-3">
                                <Label htmlFor={field.name}>{field.label} </Label>
                                <Input
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    {...register(field.name)}
                                />
                                {formState.errors[field.name] && (
                                    <p className="text-red-500 text-sm">
                                        {formState.errors[field.name]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                        {attributes.map((attr) => (

                            <div key={attr.name} className="grid gap-3">
                                <Label htmlFor={attr.name}>{attr.name} </Label>
                                <Input
                                    id={attr.name}
                                    {...register(attr.name)}
                                    name={attr.name}
                                    defaultValue={attr.value}

                                />
                                {formState.errors[attr.name] && (
                                    <p className="text-red-500 text-sm">
                                        {formState.errors[attr.name]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                        <Button type="submit" className="w-full" >New Customer</Button>
                    </form>
                </CardContent>
            </Card>
            <Button type="button" onClick={() => window.history.back()}>
                Back
            </Button>
            {error && (
                <p className= "mt-4 text-center text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}
