"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, usePathname } from 'next/navigation'
import React from "react";
import { useEffect, useState } from "react";
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

// Schemas
const clientSchema = z.object({
    full_name: z.string().min(1),
    age: z.coerce.number().int().positive(),
    gender: z.string().min(1),
    state: z.string().min(1),
    identification: z.coerce.number().int().positive(),
});

const attributesSchema = z.object({
    attributes: z.array(
        z.object({
            name: z.string(),
            value: z.string(),
            id: z.string().optional(),
        })
    )
});

export default function NewClientForm({ params }) {
    const { id } = React.use(params);
    const router = useRouter();

    const fields = [
        { name: "full_name", label: "Full Name", placeholder: "Juan Pérez" },
        { name: "identification", label: "Identification", placeholder: 12345678 },
        { name: "age", label: "Age", placeholder: 35 },
        { name: "gender", label: "Gender", placeholder: "Masculino" },
        { name: "state", label: "State", placeholder: "Activoss" },

    ];

    const [attributes, setAttributes] = useState([]);
    const [newAttr, setNewAttr] = useState({ name: '', value: '', id: '' });

    const {
        register: registerClient,
        handleSubmit: handleClientSubmit,
        reset: resetClient,
        formState: clientErrors
    } = useForm({
        resolver: zodResolver(clientSchema)
    });

    const {
        register: registerAttrs,
        handleSubmit: handleAttrsSubmit,
        reset: resetAttrs,
        formState: attrsErrors
    } = useForm({
        resolver: zodResolver(attributesSchema)
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:1234/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!res.ok) throw new Error("Failed to fetch user");

                const data = await res.json();
                resetClient(data);
                setAttributes(data.attributes || []);
                resetAttrs({ attributes: data.attributes || [] });
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, [id, resetClient, resetAttrs]);

    const onSubmitClient = async (values) => {
        try {
            const res = await fetch(`http://localhost:1234/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Error creating client');
            router.push('/clients');
        } catch (error) {
            console.error(error);
        }
    }
    const onSubmitAttributes = async (values) => {
        try {
            const res = await fetch(`http://localhost:1234/attributes`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ values }),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Error creating client');
        } catch (error) {
            console.error(error);
        }
    }
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        console.log(id)
        try {
            const res = await fetch(`http://localhost:1234/attributes/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete user");
            setAttributes((prev) => prev.filter((attr) => attr.id !== id));
        } catch (err) {
            console.error("Error deleting attribute", err);
        }
    };
    const handleAddNewAttribute = async () => {
        if (!newAttr.name || !newAttr.value) return;
        try {
            const res = await fetch('http://localhost:1234/attributes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: id,
                    attributes: [newAttr],
                }),
                credentials: 'include',

            });

            if (!res.ok) throw new Error('Error creating atribute');

            const data = await res.json();
            setAttributes((prev) => [...prev, { ...newAttr, id: data.id }]);
            setNewAttr({ name: '', value: '' });

        } catch (err) {
            console.error('Error creating atribute', err);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-20">
            <Card>
                <CardHeader>
                    <CardTitle>Update Client</CardTitle>
                    <CardDescription>Fill out the form to add a new client.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleClientSubmit(onSubmitClient)} className="flex flex-col gap-6">
                        {fields.map((field) => (

                            <div key={field.name} className="grid gap-3">
                                <Label htmlFor={field.name}>{field.label} </Label>
                                <Input
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    {...registerClient(field.name)}
                                />
                                {clientErrors.errors[field.name] && (
                                    <p className="text-red-500 text-sm">
                                        {clientErrors.errors[field.name]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                        <Button type="submit" className="w-full" >Update Client</Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Update Attributes</CardTitle>
                    <CardDescription>Add or modify attributes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAttrsSubmit(onSubmitAttributes)} className="flex flex-col gap-6">
                        {attributes.map((attr, index) => (
                            <div key={index} className="grid gap-3">
                                <Input
                                    type="hidden"
                                    value={attr.id}
                                    {...registerAttrs(`attributes.${index}.id`)}
                                />
                                <Label className="flex items-center justify-between" htmlFor={`attributes.${index}.name`}>{attr.name}
                                    <button
                                        onClick={(e) => handleDelete(attr.id, e)}
                                        className="text-red-600 hover:underline mr-4"
                                    >
                                        Delete
                                    </button>
                                </Label>
                                <Input
                                    id={`attributes.${index}.value`}
                                    defaultValue={attr.value}
                                    {...registerAttrs(`attributes.${index}.value`)}
                                />

                            </div>
                        ))}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="newAttr.name">Nuevo atributo</Label>
                                <Input
                                    id="newAttr.name"
                                    placeholder="Clave"
                                    value={newAttr.name}
                                    onChange={(e) => setNewAttr({ ...newAttr, name: e.target.value })}
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="newAttr.value">Valor</Label>
                                <Input
                                    id="newAttr.value"
                                    placeholder="Valor"
                                    value={newAttr.value}
                                    onChange={(e) => setNewAttr({ ...newAttr, value: e.target.value })}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleAddNewAttribute}
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Button type="button" onClick={() => router.push('/clients')}>
                Volver
            </Button>
        </div>
    )
}

