package lib

import (
	"github.com/jcoene/go-base62"
	"math/rand"
	"time"
)

func GenerateRandomSlug() (string, error) {
	timestamp := time.Now().UnixNano()
	randomNum := rand.Int63n(1000000)
	uniqueID := timestamp + randomNum

	slug := EncodeSlug(uniqueID)
	return slug, nil
}

func EncodeSlug(id int64) string {
	encoded := base62.EncodeUint64(uint64(id))
	return encoded
}
