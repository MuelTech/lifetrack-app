import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ArticleCategory } from '@prisma/client';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const { category, q } = req.query;

    const whereClause: any = {};

    // 1. Filter by category
    if (category && typeof category === 'string' && category.toUpperCase() !== 'ALL') {
      const upperCategory = category.toUpperCase().replace(/\s+/g, '_');
      if (Object.values(ArticleCategory).includes(upperCategory as ArticleCategory)) {
        whereClause.category = upperCategory as ArticleCategory;
      }
    }

    // 2. Filter by search query
    if (q && typeof q === 'string') {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { preview: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    // 3. Query DB
    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return res.status(200).json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching articles' });
  }
};
