package models_test

import (
	"encoding/json"
	"reflect"
	"testing"

	"github.com/dgraph-io/badger/v4"
	"github.com/open-ug/conveyor/internal/models"
)

func setupTestDB(t *testing.T) *badger.DB {
	opts := badger.DefaultOptions("").WithInMemory(true)
	db, err := badger.Open(opts)
	if err != nil {
		t.Fatalf("failed to open badger db: %v", err)
	}
	t.Cleanup(func() { db.Close() })
	return db
}

func Test_Resource_Insert(t *testing.T) {
	db := setupTestDB(t)

	resourcemodel := models.NewResourceModel(nil, db)

	t.Run("Insert Resource", func(t *testing.T) {
		err := resourcemodel.BadgerDBInsert("test-resource", "test-type", []byte("test-data"))
		if err != nil {
			t.Fatalf("failed to insert resource: %v", err)
		}

		// Verify the resource was inserted
		err = db.View(func(txn *badger.Txn) error {
			item, err := txn.Get([]byte("/resources/test-type/test-resource"))
			if err != nil {
				return err
			}
			val, err := item.ValueCopy(nil)
			if err != nil {
				return err
			}
			if string(val) != "test-data" {
				t.Errorf("expected 'test-data', got '%s'", string(val))
			}
			return nil
		})
		if err != nil {
			t.Fatalf("failed to verify resource: %v", err)
		}
	})

	// verify versioned resource was inserted
	t.Run("Verify Versioned Resource", func(t *testing.T) {
		err := db.View(func(txn *badger.Txn) error {
			item, err := txn.Get([]byte("/resources/test-type/test-resource/1"))
			if err != nil {
				return err
			}
			val, err := item.ValueCopy(nil)
			if err != nil {
				return err
			}
			if string(val) != "test-data" {
				t.Errorf("expected 'test-data', got '%s'", string(val))
			}
			return nil
		})
		if err != nil {
			t.Fatalf("failed to verify versioned resource: %v", err)
		}
	})

}

type PipelineResource struct {
	Name     string               `json:"name"`
	Resource string               `json:"resource"`
	Spec     PipelineResourceSpec `json:"spec"`
}

type PipelineResourceSpec struct {
	Image string         `json:"image"`
	Steps []PipelineStep `json:"steps"`
}

type PipelineStep struct {
	Name    string `json:"name"`
	Command string `json:"command"`
}

var resource = PipelineResource{
	Name:     "pipeline-1",
	Resource: "pipe4",
	Spec: PipelineResourceSpec{
		Image: "ubuntu:latest",
		Steps: []PipelineStep{
			{
				Name:    "list dir",
				Command: "ls",
			},
		},
	},
}

func Test_Resource_FindOne(t *testing.T) {
	db := setupTestDB(t)

	resourcemodel := models.NewResourceModel(nil, db)

	rawResource, err := json.Marshal(resource)
	if err != nil {
		t.Fatalf("failed to marshal resource: %v", err)
	}

	// Insert a resource to find
	err = resourcemodel.BadgerDBInsert(resource.Name, resource.Resource, rawResource)
	if err != nil {
		t.Fatalf("failed to insert resource: %v", err)
	}

	t.Run("Find Existing Resource", func(t *testing.T) {
		foundResource, err := resourcemodel.BadgerDBFindOne(resource.Name, resource.Resource)
		if err != nil {
			t.Fatalf("failed to find resource: %v", err)
		}

		converted := PipelineResource{
			Name:     foundResource.Name,
			Resource: foundResource.Resource,
		}

		// Convert Spec map -> struct
		specBytes, err := json.Marshal(foundResource.Spec)
		if err != nil {
			t.Fatalf("failed to marshal spec: %v", err)
		}

		err = json.Unmarshal(specBytes, &converted.Spec)
		if err != nil {
			t.Fatalf("failed to unmarshal spec: %v", err)
		}

		if !reflect.DeepEqual(converted, resource) {
			t.Errorf("expected %+v, got %+v", resource, converted)
		}

	})

	t.Run("Find Non-Existing Resource", func(t *testing.T) {
		_, err := resourcemodel.BadgerDBFindOne("non-existent", "test-type")
		if err == nil {
			t.Fatalf("expected error when finding non-existent resource, got nil")
		}
	})
}
