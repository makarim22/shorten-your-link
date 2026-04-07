package models

import "time"

// SuccessResponse
type SuccessResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// ErrorResponse
type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type UserResponse struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

//type LinkResponse struct {
//	ID          int        `json:"id"`
//	ShortCode   string     `json:"short_code"`
//	OriginalUrl string     `json:"original_url"`
//	IsCustom    bool       `json:"is_custom"`
//	CreatedAt   time.Time  `json:"created_at"`
//	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
//}

type LinkResponse struct {
	ID           int        `json:"id"`
	UserID       int        `json:"user_id"`
	OriginalUrl  string     `json:"original_url"`
	ShortCode    string     `json:"short_code"`
	ShortenedUrl string     `json:"shortened_url"`
	IsCustom     bool       `json:"is_custom"`
	CreatedAt    time.Time  `json:"created_at"`
	ExpiresAt    *time.Time `json:"expires_at,omitempty"`
}

type AuthResponse struct {
	Success bool          `json:"success"`
	Message string        `json:"message"`
	Token   string        `json:"token"`
	User    *UserResponse `json:"user,omitempty"`
}

// CreateLinkResponse
type CreateLinkResponse struct {
	Success  bool         `json:"success"`
	Message  string       `json:"message"`
	Link     LinkResponse `json:"link"`
	ShortURL string       `json:"short_url"`
}

// ListLinksResponse
type ListLinksResponse struct {
	Success bool           `json:"success"`
	Message string         `json:"message"`
	Links   []LinkResponse `json:"links"`
	Count   int            `json:"count"`
}
