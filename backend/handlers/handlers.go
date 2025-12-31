package handlers

import (
	"encoding/json"
	"net/http"
)

func Ping(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "pong"})
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	// Placeholder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]string{"user1", "user2"})
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	// Placeholder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"id": "1", "name": "John Doe"})
}

func ListFiles(w http.ResponseWriter, r *http.Request) {
	// Placeholder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]string{"file1.txt", "file2.txt"})
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	// Placeholder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "file uploaded"})
}

func DownloadFile(w http.ResponseWriter, r *http.Request) {
	// Placeholder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "file downloaded"})
}

func DeleteFile(w http.ResponseWriter, r *http.Request) {
	// Placeholder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "file deleted"})
}
