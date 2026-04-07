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
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)
	}

	{
		link := api.Group("/links")
		link.Use(middleware.AuthMiddleware())
		{
			link.POST("", linkHandler.Create)
			link.GET("", linkHandler.Get)
		}
	}
}
