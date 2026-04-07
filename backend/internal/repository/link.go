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
		Link.UserID,
		Link.ShortCode,
		Link.OriginalUrl,
		Link.IsCustom,
		Link.CreatedAt,
		Link.ExpiresAt,
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

func (r *LinkRepository) GetByUserID(ctx context.Context, userID int) ([]models.LinkResponse, error) {
	query := `SELECT id, user_id, short_code, original_url, created_at, expires_at FROM links WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query links: %w", err)
	}
	defer rows.Close()

	var links []models.LinkResponse
	for rows.Next() {
		var link models.LinkResponse
		err := rows.Scan(
			&link.ID,
			&link.UserID,
			&link.ShortCode,
			&link.OriginalUrl,
			&link.CreatedAt,
			&link.ExpiresAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan link: %w", err)
		}
		links = append(links, link)
	}
	return links, rows.Err()
}

func (r *LinkRepository) GetByShortCode(ctx context.Context, shortCode string) (*models.Link, error) {
	query := `
		SELECT id, user_id, original_url, short_code, is_custom, created_at, expires_at
		FROM links
		WHERE short_code = $1
	`

	var link models.Link
	err := r.db.QueryRow(ctx, query, shortCode).Scan(
		&link.ID,
		&link.UserID,
		&link.OriginalUrl,
		&link.ShortCode,
		&link.IsCustom,
		&link.CreatedAt,
		&link.ExpiresAt,
	)

	if err != nil {
		return nil, err
	}

	return &link, nil
}

func (r *LinkRepository) Delete(ctx context.Context, id int, userID int) error {
	query := `DELETE FROM links WHERE id = $1 AND user_id = $2`
	commandTag, err := r.db.Exec(ctx, query, id, userID)
	if err != nil {
		return fmt.Errorf("failed to delete link: %w", err)
	}

	if commandTag.RowsAffected() == 0 {
		return fmt.Errorf("link not found or you don't have permission to delete it")
	}
	return nil
}
