'use client'; // ← ESTA LINEA ES CLAVE

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Button } from "../../../../../components/ui/button";
import { Checkbox } from "../../../../../components/ui/checkbox";

import {
  Card,
} from "app/components/ui/card"

const defaultAttributes = [
  { name: '¿Drives?', value: 'no' },
  { name: '¿You wear glasses?', value: 'no' },
  { name: '¿Diabetic?', value: 'no' },

];

export default function AttributeForm({ params }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [attributes, setAttributes] = useState([]);
  const [newAttr, setNewAttr] = useState({ name: '', value: '' });

  const handleDefaultChange = (name, checked) => {
    const updatedValue = checked ? 'sí' : 'no';
    setAttributes(prev => {
      const existing = prev.find(attr => attr.name === name);
      if (existing) {
        return prev.map(attr =>
          attr.name === name ? { ...attr, value: updatedValue } : attr
        );
      }
      return [...prev, { name, value: updatedValue }];
    });
  };

  const handleAddNewAttribute = () => {
    if (!newAttr.name || !newAttr.value) return;
    setAttributes(prev => [...prev, newAttr]);
    setNewAttr({ name: '', value: '' });
  };
  const handleSubmitAllAttributes = async () => {
    if (!attributes.length) return;
    try {
      const res = await fetch('http://localhost:1234/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: id,
          attributes,
        }),
      });

      if (!res.ok) throw new Error('Error al guardar atributos');
      router.push(`/detail/${id}`);
    } catch (err) {
      console.error('Error al guardar atributos', err);
    }
  };

  return (
    <Card className={"flex flex-col gap-6 p-6 max-w-2xl mx-auto mt-30"}>
      <form className="flex flex-col gap-6">
        <div className="grid gap-4">
          <p className="font-semibold">Additional attributes</p>
          {defaultAttributes.map(attr => (
            <div key={attr.name} className="flex items-center gap-2">
              <Checkbox
                id={attr.name}
                checked={!!attributes.find(a => a.name === attr.name && a.value === 'sí')}
                onCheckedChange={(checked) => handleDefaultChange(attr.name, checked)}
              />
              <Label htmlFor={attr.name}>{attr.name}</Label>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="padeceEnfermedad">¿Do you have any illnesses? Which ones?</Label>
          <Input
            id="padeceEnfermedad"
            placeholder="Ej: hypertension, asthma..."
            value={newAttr.name === '¿Do you have any illnesses? Which ones?' ? newAttr.value : ''}
            onChange={(e) =>
              setNewAttr({
                name: '¿Do you have any illnesses? Which ones?',
                value: e.target.value,
              })
            }
            onBlur={() => {
              if (newAttr.name && newAttr.value) {
                setAttributes((prev) => [
                  ...prev.filter(attr => attr.name !== newAttr.name),
                  newAttr,
                ]);
                setNewAttr({ name: '', value: '' });
              }
            }}
          />
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="newAttr.name">New attribute</Label>
            <Input
              id="newAttr.name"
              placeholder="Clave"
              value={newAttr.name}
              onChange={(e) =>
                setNewAttr({ name: e.target.value, value: newAttr.value })
              }
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="newAttr.value">Value</Label>
            <Input
              id="newAttr.value"
              placeholder="Valor"
              value={newAttr.value}
              onChange={(e) =>
                setNewAttr({ name: newAttr.name, value: e.target.value })
              }
            />
          </div>
          <Button type="button" onClick={handleAddNewAttribute}>
            Add
          </Button>
        </div>
        {attributes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Added attributes:</h3>
            <ul className="space-y-1">
              {attributes.map((attr, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  <span className="font-medium">{attr.name}</span>: {attr.value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button type="button" onClick={handleSubmitAllAttributes} className="">
          Save all attributes
        </Button>
        <Button type="button" onClick={() => window.history.back()}>
          Back
        </Button>
      </form>
    </Card>


  );
}
