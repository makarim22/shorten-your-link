package main

import (
	"context"
	"fmt"
	"log"
	"makarim22/shorten-your-link/internal/di"
	"makarim22/shorten-your-link/internal/routes"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found, using system environment variables")
	}

	databaseURL := os.Getenv("DATABASE_URL")

	fmt.Println("📌 Database URL:", databaseURL)

	if databaseURL == "" {
		log.Fatal("❌ DATABASE_URL environment variable is not set")
	}

	// Use pgxpool instead of single connection
	poolConfig, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		log.Fatalf("❌ Failed to parse database config: %v", err)
	}

	// Configure pool for concurrent requests
	poolConfig.MaxConns = 25
	poolConfig.MinConns = 5

	ctx := context.Background()

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		log.Fatalf("❌ Unable to create connection pool: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("❌ Could not ping database: %v", err)
	}

	log.Println("✅ Successfully connected to the database!")

	container, err := di.NewContainer(pool)
	if err != nil {
		log.Fatalf("❌ Failed to initialize container: %v", err)
	}

	router := gin.Default()

	routes.SetupRoutes(router, container)

	serverPort := os.Getenv("SERVER_PORT")
	if serverPort == "" {
		serverPort = "8080"
	}
	if serverPort[0] != ':' {
		serverPort = ":" + serverPort
	}

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	router.Run(serverPort)
}
