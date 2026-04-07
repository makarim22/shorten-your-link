package handlers

import (
	"makarim22/shorten-your-link/internal/models"
	"makarim22/shorten-your-link/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {
	return &AuthHandler{
		service: service,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	ctx := c.Request.Context()

	user, err := h.service.CreateUser(ctx, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	c.JSON(http.StatusCreated, models.AuthResponse{
		Success: true,
		Message: "User created successfully",
		User:    user,
	})

}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{
			Success: false,
			Message: err.Error(),
		})
	}
	ctx := c.Request.Context()

	AuthResponse, err := h.service.Login(ctx, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{
			Success: false,
			Message: err.Error(),
		})
	}
	c.JSON(http.StatusCreated, AuthResponse)
}
