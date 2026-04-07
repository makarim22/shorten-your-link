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

func (r *LinkRepository) Create(ctx context.Context, Link *models.Link) error {

	err := r.db.QueryRow(
		ctx, `INSERT INTO links (user_id, short_code, original_url, is_custom, created_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`).Scan(&Link.ID, &Link.ShortCode, &Link.OriginalUrl, &Link.IsCustom, &Link.CreatedAt, &Link.ExpiresAt)

	if err != nil {
		return fmt.Errorf("failed to create Link: %w", err)
	}
	return nil
}
