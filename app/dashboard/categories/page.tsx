"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    CircularProgress,
    Avatar
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import categoryService, { PlaygroundCategory } from "@/services/categories.service";
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog";
import { API_BASE_URL } from "@/lib/api";
import SecureAvatar from "@/components/SecureAvatar";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<PlaygroundCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<PlaygroundCategory | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Failed to fetch categories");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpen = (category?: PlaygroundCategory) => {
        setEditingCategory(category || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
    };

    // handleSubmit now receives the formData from the child component
    const handleSave = async (data: any) => {
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, data);
                toast.success("Category updated successfully");
            } else {
                await categoryService.createCategory(data);
                toast.success("Category created successfully");
            }
            fetchCategories();
        } catch (error) {
            toast.error("Operation failed");
            console.error(error);
            throw error;
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoryService.deleteCategory(id);
            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            toast.error("Failed to delete category");
            console.error(error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Playground Categories</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Add Category
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Color</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id} hover>
                                    <TableCell>
                                        <SecureAvatar
                                            imagePath={category.image}
                                            fallbackLabel={category.name}
                                            sx={{ width: 45, height: 45, border: "2px solid #e0e0e0" }}
                                        />
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                bgcolor: category.color,
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: category.deleted ? '#fee2e2' : '#dcfce7',
                                                color: category.deleted ? '#991b1b' : '#166534',
                                                display: 'inline-block',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            {category.deleted ? 'Deleted' : 'Active'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpen(category)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(category.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <CreateCategoryDialog
                open={open}
                onClose={handleClose}
                onSave={handleSave}
                category={editingCategory}
            />
        </Box>
    );
}
