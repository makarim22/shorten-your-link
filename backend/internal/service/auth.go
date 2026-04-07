package service

import (
	"context"
	"fmt"
	"makarim22/shorten-your-link/internal/lib"
	"makarim22/shorten-your-link/internal/models"
	"makarim22/shorten-your-link/internal/repository"
)

type AuthService struct {
	repo *repository.UserRepository
}

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{
		repo: repo,
	}
}

func (s *AuthService) CreateUser(ctx context.Context, request *models.RegisterRequest) (*models.UserResponse, error) {
	existingUser, err := s.repo.GetByEmail(ctx, request.Email)
	if err != nil && existingUser != nil {
		return nil, fmt.Errorf("already registered email: %w", err)
	}

	hashedPass, err := lib.HashPassword(request.Password)
	if err != nil {
		return nil, fmt.Errorf("cannot hashing password: %w", err)
	}

	user := &models.User{
		Email:        request.Email,
		PasswordHash: hashedPass,
	}

	user, err = s.repo.Create(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("cannot create user: %w", err)
	}
	return &models.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}, nil

}
