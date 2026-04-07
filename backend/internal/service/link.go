package service

import (
	"context"
	"errors"
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

func (s *LinkService) GetLink(ctx context.Context, userID int) ([]models.LinkResponse, error) {
	links, err := s.repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get link: %w", err)
	}
	return links, nil
}

func (s *LinkService) GetLinkByShortCode(ctx context.Context, shortCode string) (*models.Link, error) {
	link, err := s.repo.GetByShortCode(ctx, shortCode)
	if err != nil {
		return nil, errors.New("link not found")
	}

	if link.ExpiresAt != nil && time.Now().After(*link.ExpiresAt) {
		return nil, errors.New("link has expired")
	}

	return link, nil
}
