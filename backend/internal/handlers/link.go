package handlers

import (
	"context"
	"log"
	"makarim22/shorten-your-link/internal/models"
	"makarim22/shorten-your-link/internal/service"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type LinkHandler struct {
	service *service.LinkService
}

func NewLinkHandler(service *service.LinkService) *LinkHandler {
	return &LinkHandler{
		service: service,
	}
}

// Create creates a new shortened URL for the authenticated user
// @Summary Create a new shortened link
// @Description Creates a new shortened URL from an original URL with optional expiration time
// @Tags Links
// @Accept json
// @Produce json
// @Param body body models.CreateLinkRequest true "Link creation request"
// @Security BearerAuth
// @Success 201 {object} models.LinkResponse "Link created successfully"
// @Failure 400 {object} models.ErrorResponse "Invalid request body"
// @Failure 401 {object} models.ErrorResponse "Unauthorized - missing or invalid token"
// @Failure 500 {object} models.ErrorResponse "Failed to create link"
// @Router /api/links [post]
func (h *LinkHandler) Create(c *gin.Context) {
	var req models.CreateLinkRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "invalid request",
			Error:   err.Error(),
		})
		return
	}
	customerID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Success: false,
			Message: "user id not found",
		})
		return
	}
	userID, ok := customerID.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "invalid user id format",
		})
		return
	}

	ctx := c.Request.Context()

	LinkResponse, err := h.service.CreateLink(ctx, userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "failed to create link",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, LinkResponse)
}

// Get retrieves all shortened links belonging to the authenticated user
// @Summary Get user's shortened links
// @Description Retrieves a list of all shortened links created by the authenticated user
// @Tags Links
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.ListLinksResponse "Links retrieved successfully"
// @Success 204 {object} models.ListLinksResponse "No links found"
// @Failure 401 {object} models.ErrorResponse "Unauthorized - missing or invalid token"
// @Failure 500 {object} models.ErrorResponse "Failed to retrieve links"
// @Router /api/links [get]
func (h *LinkHandler) Get(c *gin.Context) {
	customerID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Success: false,
			Message: "user id not found",
		})
		return
	}
	ctx := c.Request.Context()
	linkResponse, err := h.service.GetLink(ctx, customerID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "failed to get link",
		})
		return
	}

	if linkResponse == nil || len(linkResponse) == 0 {
		c.JSON(http.StatusNoContent, models.ListLinksResponse{
			Success: true,
			Message: "no link found",
			Links:   []models.LinkResponse{},
			Count:   0,
		})
		return
	}

	c.JSON(http.StatusOK, models.ListLinksResponse{
		Success: true,
		Message: "Success to retreive list by user",
		Links:   linkResponse,
		Count:   len(linkResponse),
	})
}

// Redirect resolves a shortened URL and redirects to the original URL
// @Summary Redirect to original URL
// @Description Resolves a shortened code and redirects to the original URL if not expired
// @Tags Links
// @Produce json
// @Param short_code path string true "Shortened URL code"
// @Success 301 "Redirects to the original URL"
// @Failure 400 {object} models.ErrorResponse "Short code is required"
// @Failure 404 {object} models.ErrorResponse "Link not found"
// @Failure 410 {object} models.ErrorResponse "Link has expired"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /{short_code} [get]
func (h *LinkHandler) Redirect(c *gin.Context) {
	shortCode := c.Param("short_code")

	if shortCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "short code is required"})
		return
	}

	ctx := context.Background()

	link, err := h.service.GetLinkByShortCode(ctx, shortCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if link.ExpiresAt != nil && time.Now().After(*link.ExpiresAt) {
		c.JSON(http.StatusGone, gin.H{"error": "short link has expired"})
		return
	}

	c.Redirect(http.StatusMovedPermanently, link.OriginalUrl)
}

// Delete removes a shortened link (only owner can delete)
// @Summary Delete a shortened link
// @Description Deletes a shortened link. Only the user who created the link can delete it.
// @Tags Links
// @Produce json
// @Param id path int true "Link ID"
// @Security BearerAuth
// @Success 200 {object} models.SuccessResponse "Link deleted successfully"
// @Failure 400 {object} models.ErrorResponse "Invalid or missing ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized - missing or invalid token"
// @Failure 403 {object} models.ErrorResponse "Forbidden - user does not own this link"
// @Failure 404 {object} models.ErrorResponse "Link not found"
// @Failure 500 {object} models.ErrorResponse "Failed to delete link"
// @Router /api/links/{id} [delete]
func (h *LinkHandler) Delete(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Success: false,
			Message: "user id not found",
		})
		return
	}

	userIDInt, ok := userID.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "invalid user id format",
		})
		return
	}
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "id is required",
		})
		return
	}

	linkID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "invalid id format",
		})
		return
	}

	ctx := context.Background()
	err = h.service.DeleteLink(ctx, linkID, userIDInt)
	if err != nil {
		log.Printf("Delete error details: %v | Error string: %s", err, err.Error())
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "failed to delete link",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Success: true,
		Message: "link deleted successfully",
	})
}

func (h *LinkHandler) CreateGuest(c *gin.Context) {
	var req models.CreateLinkRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "invalid request",
			Error:   err.Error(),
		})
		return
	}

	ctx := c.Request.Context()

	LinkResponse, err := h.service.CreateLinkGuest(ctx, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "failed to create link",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, LinkResponse)
}
