package lib

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type JWTConfig struct {
	Secret     []byte
	Expiration time.Duration
	Issuer     string
}

var Config JWTConfig

func InitConfig() error {

	_ = godotenv.Load()

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return fmt.Errorf("JWT_SECRET environment variable not set")
	}

	if len(secret) < 32 {
		return fmt.Errorf("JWT_SECRET must be at least 32 characters long")
	}

	expiration := os.Getenv("JWT_EXPIRATION")
	if expiration == "" {
		expiration = "24h"
	}

	duration, err := time.ParseDuration(expiration)
	if err != nil {
		return fmt.Errorf("invalid JWT_EXPIRATION format: %w", err)
	}

	Config = JWTConfig{
		Secret:     []byte(secret),
		Expiration: duration,
		Issuer:     os.Getenv("APP_NAME"),
	}

	return nil
}
