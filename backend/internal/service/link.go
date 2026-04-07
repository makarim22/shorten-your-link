package service

import (
	"context"
	"fmt"
	"makarim22/shorten-your-link/internal/lib"
	"makarim22/shorten-your-link/internal/models"
	"makarim22/shorten-your-link/internal/repository"
	"time"
)

type LinkService struct {
	repo *repository.LinkRepository
}

func NewLinkService(repo *repository.LinkRepository) *LinkService {
	return &LinkService{
		repo: repo,
	}
}

func (s *LinkService) CreateLink(ctx context.Context, userID int, req *models.CreateLinkRequest) (*models.LinkResponse, error) {
	var shortCode string
	var isCustom bool

	// If custom slug is provided, validate and use it
	if req.ShortCode != nil && *req.ShortCode != "" {
		exists, err := s.repo.CheckShortCodeExists(ctx, *req.ShortCode)
		if err != nil {
			return nil, fmt.Errorf("failed to validate custom slug: %w", err)
		}
		if exists {
			return nil, fmt.Errorf("custom slug '%s' is already taken", *req.ShortCode)
		}
		shortCode = *req.ShortCode
		isCustom = true
	} else {
		// Generate random slug
		var err error
		shortCode, err = lib.GenerateRandomSlug()
		if err != nil {
			return nil, fmt.Errorf("failed to generate slug: %w", err)
		}
		isCustom = false
	}

	link := models.Link{
		UserID:      userID,
		ShortCode:   shortCode,
		OriginalUrl: req.OriginalUrl,
		IsCustom:    isCustom,
		CreatedAt:   time.Now(),
		ExpiresAt:   req.ExpiresAt,
	}

	createdLink, err := s.repo.Create(ctx, &link)
	if err != nil {
		return nil, fmt.Errorf("failed to create link: %w", err)
	}

	return &models.LinkResponse{
		ID:           createdLink.ID,
		UserID:       createdLink.UserID,
		ShortCode:    createdLink.ShortCode,
		OriginalUrl:  createdLink.OriginalUrl,
		ShortenedUrl: "http://localhost:9000/" + createdLink.ShortCode,
		IsCustom:     createdLink.IsCustom,
		CreatedAt:    createdLink.CreatedAt,
		ExpiresAt:    createdLink.ExpiresAt,
	}, nil
}
