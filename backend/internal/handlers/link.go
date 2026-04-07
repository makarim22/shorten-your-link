package handlers

import (
	"makarim22/shorten-your-link/internal/models"
	"makarim22/shorten-your-link/internal/service"
	"net/http"

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
