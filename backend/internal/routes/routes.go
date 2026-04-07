package routes

import (
	"makarim22/shorten-your-link/internal/di"
	"makarim22/shorten-your-link/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, container *di.Container) {
	authHandler := container.AuthHandler()
	linkHandler := container.LinkHandler()

	///

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		//auth.Use(middleware.AuthMiddleware())
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}
	}
	{
		shorten := api.Group("/shorten")
		shorten.Use(middleware.AuthMiddleware())
		{
			shorten.POST("/generate", linkHandler.Create)
		}
	}
}
