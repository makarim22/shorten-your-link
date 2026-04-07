FROM golang:1.25-alpine AS builder

WORKDIR /workspace

COPY go.mod go.sum .

RUN go mod tidy

COPY . .

RUN go build -o backend-shortener main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /workspace/backend-shortener /app/

EXPOSE 8080

ENTRYPOINT ["./backend-shortener"]