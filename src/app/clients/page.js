"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination";

export default function Page() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false); // Para mostrar el modal
    const [userToDelete, setUserToDelete] = useState(null); // Para almacenar el usuario a eliminar

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:1234/users", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRowClick = (id) => {
        router.push(`/detail/${id}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setUserToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:1234/users/${userToDelete}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete user");

            setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
            setShowModal(false);
        } catch (err) {
            console.error("Error deleting user", err);
            setShowModal(false);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-8 py-6 mt-40 bg-black text-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-bold">Customer list</h1>
                <Link
                    href="/clients/new"
                    className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 transition"
                >
                    + Add customer
                </Link>
            </div>
            {showModal && (
                <div className="fixed right-190 flex justify-center items-center w-96 bg-black bg-opacity-50 z-50">
                    <div className="bg-black p-6 rounded-lg shadow-lg">
                        <p className="text-lg">¿Are you sure you want to delete this customer?</p>
                        <div className="mt-4">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded mr-4"
                                onClick={confirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={cancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Table className={"bg-white text-black rounded-lg"}>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4 px-4 py-2">Identification</TableHead>
                        <TableHead className="w-1/4">Name</TableHead>
                        <TableHead className="w-1/4">State</TableHead>
                        <TableHead className="w-1/4">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} onClick={() => handleRowClick(user.id)} className="cursor-pointer hover:bg-gray-200">
                            <TableCell className="font-medium px-4 py-2">{user.identification}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.state}</TableCell>
                            <TableCell>
                                <button
                                    onClick={(e) => handleDelete(user.id, e)}
                                    className="text-red-600 hover:underline mr-4"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={(e) => handleRowClick}
                                    className="text-green-600 hover:underline "
                                >
                                    Edit
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination className="mt-120">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
