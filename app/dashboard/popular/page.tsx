"use client";

import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Star as StarIcon
} from '@mui/icons-material';
import playgroundsService, { Playground } from '@/services/playgrounds.service';

export default function PopularGroundsPage() {
    const [popularGrounds, setPopularGrounds] = useState<Playground[]>([]);
    const [searchResults, setSearchResults] = useState<Playground[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPopularGrounds = async () => {
        try {
            setLoading(true);
            const data = await playgroundsService.getPopularGrounds();
            setPopularGrounds(data);
        } catch (err) {
            setError('Failed to load popular grounds');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            const results = await playgroundsService.searchGrounds(query);
            // Filter out already popular grounds from results
            const popularIds = new Set(popularGrounds.map(p => p.id));
            setSearchResults(results.filter(p => !popularIds.has(p.id)));
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setSearching(false);
        }
    };

    const handleAddPopular = async (ground: Playground) => {
        try {
            await playgroundsService.addPopularGround(ground.id);
            setPopularGrounds(prev => [...prev, ground]);
            setSearchResults(prev => prev.filter(p => p.id !== ground.id));
        } catch (err) {
            setError('Failed to add popular ground');
            console.error(err);
        }
    };

    const handleRemovePopular = async (id: number) => {
        try {
            await playgroundsService.removePopularGround(id);
            setPopularGrounds(prev => prev.filter(p => p.id !== id));
            // Re-run search if query exists to potentially show the removed ground back in results
            if (searchQuery) {
                handleSearch(searchQuery);
            }
        } catch (err) {
            setError('Failed to remove popular ground');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPopularGrounds();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Popular Grounds Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage the playgrounds that appear in the "Popular" section of the app.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Search Section */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon color="primary" />
                            Add to Popular
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Box>

                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {searching ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((ground) => (
                                    <React.Fragment key={ground.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={ground.name}
                                                primaryTypographyProps={{ fontWeight: 500 }}
                                            />
                                            <ListItemSecondaryAction>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleAddPopular(ground)}
                                                    startIcon={<AddIcon />}
                                                >
                                                    Add
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))
                            ) : searchQuery && (
                                <Typography variant="body2" color="text.secondary" align="center">
                                    No results found
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* List Section */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', minHeight: 400 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <StarIcon sx={{ color: '#faaf00' }} />
                            Current Popular Grounds ({popularGrounds.length})
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : popularGrounds.length > 0 ? (
                            <List>
                                {popularGrounds.map((ground) => (
                                    <Paper
                                        key={ground.id}
                                        elevation={0}
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            bgcolor: '#f8fafc',
                                            border: '1px solid #f1f5f9'
                                        }}
                                    >
                                        <ListItem>
                                            <ListItemText
                                                primary={ground.name}
                                                primaryTypographyProps={{ fontWeight: 600 }}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography component="span" variant="body2" color="text.primary" display="block">
                                                            {ground.address || 'No address provided'}
                                                        </Typography>
                                                        {ground.manager ? (
                                                            <Typography component="span" variant="caption" color="text.secondary" display="block">
                                                                Manager: {ground.manager.firstName} {ground.manager.lastName}
                                                            </Typography>
                                                        ) : (
                                                            <Typography component="span" variant="caption" color="text.secondary" display="block">
                                                                No Manager Assigned
                                                            </Typography>
                                                        )}
                                                    </React.Fragment>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleRemovePopular(ground.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </Paper>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No popular grounds selected yet.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Search and add grounds from the left panel.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
