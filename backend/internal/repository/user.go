package repository

import (
	"context"
	"makarim22/shorten-your-link/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (u *UserRepository) Create(ctx context.Context, user *models.User) (*models.User, error) {
	err := u.db.QueryRow(ctx,
		`INSERT INTO users (email, password_hash, created_at)
		 VALUES ($1, $2, NOW())
		 RETURNING id, created_at`,
		user.Email, user.PasswordHash).Scan(&user.ID, &user.CreatedAt)

	if err != nil {
		return nil, err
	}

	return user, err
}

func (u *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User

	err := u.db.QueryRow(ctx,
		`SELECT id, email, password_hash FROM users WHERE email = $1`,
		email).Scan(&user.ID, &user.Email, &user.PasswordHash)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
