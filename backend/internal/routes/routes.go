package routes

import (
	"makarim22/shorten-your-link/internal/di"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, container *di.Container) {
	authHandler := container.AuthHandler()

	///

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}
	}
}
