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

// Register godoc
// @Summary Register a new user
// @Description Create a new user account with email and password
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body models.RegisterRequest true "Registration details"
// @Success 201 {object} models.AuthResponse "User created successfully with user info"
// @Failure 400 {object} models.AuthResponse "Invalid request body"
// @Failure 500 {object} models.AuthResponse "Internal server error or email already exists"
// @Router /api/register [post]
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

// Login godoc
// @Summary Login user and get JWT token
// @Description Authenticate user with email and password, returns JWT token for subsequent requests
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body models.LoginRequest true "Login credentials (email and password)"
// @Success 201 {object} models.AuthResponse "Login successful with JWT token"
// @Failure 400 {object} models.AuthResponse "Invalid request body"
// @Failure 401 {object} models.AuthResponse "Invalid email or password"
// @Failure 500 {object} models.AuthResponse "Internal server error"
// @Router /api/login [post]
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
