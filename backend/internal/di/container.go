package di

import (
	"fmt"
	"makarim22/shorten-your-link/internal/handlers"
	"makarim22/shorten-your-link/internal/repository"
	"makarim22/shorten-your-link/internal/service"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Container struct {
	db *pgxpool.Pool

	authHandler *handlers.AuthHandler
	authService *service.AuthService
	userRepo    *repository.UserRepository

	linkHandler *handlers.LinkHandler
	linkService *service.LinkService
	linkRepo    *repository.LinkRepository
}

func NewContainer(db *pgxpool.Pool) (*Container, error) {
	if db == nil {
		return nil, fmt.Errorf("database connection cannot be nil")
	}

	container := &Container{
		db: db,
	}

	container.initDependencies()

	return container, nil
}

func (c *Container) initDependencies() {
	c.userRepo = repository.NewUserRepository(c.db)
	c.authService = service.NewAuthService(c.userRepo)
	c.authHandler = handlers.NewAuthHandler(c.authService)

	c.linkRepo = repository.NewLinkRepository(c.db)
	c.linkService = service.NewLinkService(c.linkRepo)
	c.linkHandler = handlers.NewLinkHandler(c.linkService)
}

func (c *Container) AuthHandler() *handlers.AuthHandler {
	return c.authHandler
}

func (c *Container) LinkHandler() *handlers.LinkHandler {
	return c.linkHandler
}
