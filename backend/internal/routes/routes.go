package routes

import (
	"makarim22/shorten-your-link/internal/di"
	"makarim22/shorten-your-link/internal/middleware"

	_ "makarim22/shorten-your-link/docs"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginswagger "github.com/swaggo/gin-swagger"
)

func SetupRoutes(router *gin.Engine, container *di.Container) {
	authHandler := container.AuthHandler()
	linkHandler := container.LinkHandler()

	///
	router.GET("/swagger/*any", ginswagger.WrapHandler(swaggerfiles.Handler))
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
			link.DELETE("/:id", linkHandler.Delete)
		}
	}

	public := router.Group("/public")
	{
		public.POST("/generate", linkHandler.CreateGuest)
	}

	router.GET("/:short_code", linkHandler.Redirect)
}
