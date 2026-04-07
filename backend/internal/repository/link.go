package repository

import (
	"context"
	"fmt"
	"makarim22/shorten-your-link/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type LinkRepository struct {
	db *pgxpool.Pool
}

func NewLinkRepository(db *pgxpool.Pool) *LinkRepository {
	return &LinkRepository{
		db: db,
	}
}

func (r *LinkRepository) Create(ctx context.Context, Link *models.Link) (*models.Link, error) {
	err := r.db.QueryRow(
		ctx,
		`INSERT INTO links (user_id, short_code, original_url, is_custom, created_at, expires_at) 
		 VALUES ($1, $2, $3, $4, $5, $6) 
		 RETURNING id, user_id, short_code, original_url, is_custom, created_at, expires_at`,
		Link.UserID,      // $1
		Link.ShortCode,   // $2
		Link.OriginalUrl, // $3
		Link.IsCustom,    // $4
		Link.CreatedAt,   // $5
		Link.ExpiresAt,   // $6
	).Scan(&Link.ID, &Link.UserID, &Link.ShortCode, &Link.OriginalUrl, &Link.IsCustom, &Link.CreatedAt, &Link.ExpiresAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create Link: %w", err)
	}
	return Link, nil
}

func (r *LinkRepository) CheckShortCodeExists(ctx context.Context, shortCode string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM links WHERE short_code = $1)`

	var exists bool
	err := r.db.QueryRow(ctx, query, shortCode).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check short code: %w", err)
	}

	return exists, nil
}
