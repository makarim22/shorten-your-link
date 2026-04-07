package models

import "time"

type Link struct {
	ID          int        `json:"id" db:"id"`
	UserID      int        `json:"userId" db:"user_id"`
	ShortCode   string     `json:"shortCode" db:"short_code"`
	OriginalUrl string     `json:"originalUrl" db:"original_url"`
	IsCustom    bool       `json:"isCustom" db:"is_custom"`
	CreatedAt   time.Time  `json:"createdAt" db:"created_at"`
	ExpiresAt   *time.Time `json:"expiresAt" db:"expires_at"`
}

type CreateLinkRequest struct {
	OriginalUrl string     `json:"originalUrl" binding:"required,url"`
	ShortCode   string     `json:"shortCode" binding:"omitempty,max=20"`
	ExpiresAt   *time.Time `json:"expiresAt" binding:"omitempty"`
}

type LinkResponse struct {
	ID          int       `json:"id"`
	ShortCode   string    `json:"short_code"`
	OriginalUrl string    `json:"original_url"`
	IsCustom    bool      `json:"is_custom"`
	CreatedAt   time.Time `json:"created_at"`
	ExpiresAt   time.Time `json:"expires_at,omitempty"`
}
