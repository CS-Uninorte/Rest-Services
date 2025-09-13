import { Router } from 'express';
import { createFavorite, deleteFavorite, listFavorites } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

const favoritesController = Router();

favoritesController.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const favorites = await listFavorites(Number(page), Number(limit));
        res.json(favorites);
    } catch (error) {
        console.error('Error listing favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

favoritesController.post('/', async (req, res) => {
    const createFavoriteDto: CreateFavoriteDto = req.body;
    try {
        const newFavorite = await createFavorite(createFavoriteDto);
        res.status(201).json(newFavorite);
    } catch (error) {
        // A proper error handling middleware would be better
        console.error(error);
        res.status(500).json({ message: 'Error creating favorite' });
    }
});

favoritesController.delete('/:externalId', async (req, res) => {
    try {
        const { externalId } = req.params;
        await deleteFavorite(Number(externalId));
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting favorite' });
    }
});


export default favoritesController;
