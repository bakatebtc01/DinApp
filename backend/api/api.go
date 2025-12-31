package api

import (
	"github.com/gorilla/mux"
	"github.com/dinapp/backend/handlers"
	"github.com/dinapp/backend/middleware"
)

func RegisterRoutes(r *mux.Router) {
	apiV1 := r.PathPrefix("/api/v1").Subrouter()

	// Middleware
	apiV1.Use(middleware.Logging)
	apiV1.Use(middleware.Auth)

	// Ping
	apiV1.HandleFunc("/ping", handlers.Ping).Methods("GET")

	// Users
	apiV1.HandleFunc("/users", handlers.GetUsers).Methods("GET")
	apiV1.HandleFunc("/users/{id}", handlers.GetUser).Methods("GET")

	// Files
	apiV1.HandleFunc("/files", handlers.ListFiles).Methods("GET")
	apiV1.HandleFunc("/files/upload", handlers.UploadFile).Methods("POST")
	apiV1.HandleFunc("/files/download/{filename}", handlers.DownloadFile).Methods("GET")
	apiV1.HandleFunc("/files/delete/{filename}", handlers.DeleteFile).Methods("DELETE")
}
