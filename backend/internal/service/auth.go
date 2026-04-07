package service

import (
	"context"
	"fmt"
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

func (s *AuthService) Register(ctx context.Context, request *models.RegisterRequest) (*models.AuthResponse, error) {
	existingUser, err := s.repo.GetByEmail(ctx, request.Email)
	if err != nil {
		return nil, fmt.Errorf("already registered email: %w", err)
	}

}
