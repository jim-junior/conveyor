package models_test

import (
	"encoding/json"
	"fmt"
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

func Test_Resource_Delete(t *testing.T) {
	db := setupTestDB(t)

	resourcemodel := models.NewResourceModel(nil, db)

	// Insert a resource to delete
	err := resourcemodel.BadgerDBInsert("test-resource", "test-type", []byte("test-data"))
	if err != nil {
		t.Fatalf("failed to insert resource: %v", err)
	}

	t.Run("Delete Existing Resource", func(t *testing.T) {
		err := resourcemodel.BadgerDBDelete("test-resource", "test-type")
		if err != nil {
			t.Fatalf("failed to delete resource: %v", err)
		}

		// Verify the resource was deleted
		err = db.View(func(txn *badger.Txn) error {
			_, err := txn.Get([]byte("/resources/test-type/test-resource"))
			if err == nil {
				return fmt.Errorf("expected resource to be deleted, but it still exists")
			}
			if err != badger.ErrKeyNotFound {
				return err
			}
			return nil
		})
		if err != nil {
			t.Fatalf("failed to verify resource deletion: %v", err)
		}
	})

}

// Test BadgerList
func Test_Resource_List(t *testing.T) {
	db := setupTestDB(t)

	resourcemodel := models.NewResourceModel(nil, db)

	// Insert multiple resources of PipelineResource type
	for i := 1; i <= 3; i++ {
		resource := PipelineResource{
			Name:     fmt.Sprintf("pipeline-%d", i),
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

		rawResource, err := json.Marshal(resource)
		if err != nil {
			t.Fatalf("failed to marshal resource: %v", err)
		}

		err = resourcemodel.BadgerDBInsert(resource.Name, resource.Resource, rawResource)
		if err != nil {
			t.Fatalf("failed to insert resource: %v", err)
		}
	}

	t.Run("List Resources", func(t *testing.T) {
		resources, err := resourcemodel.BadgerDBList("pipe4")
		fmt.Printf("Listed Resources: %+v\n", resources)
		if err != nil {
			t.Fatalf("failed to list resources: %v", err)
		}

		if len(resources) != 3 {
			t.Errorf("expected 3 resources, got %d", len(resources))
		}

		for i, res := range resources {
			expectedName := fmt.Sprintf("pipeline-%d", i+1)
			if res.Name != expectedName {
				t.Errorf("expected resource name '%s', got '%s'", expectedName, res.Name)
			}
			if res.Resource != "pipe4" {
				t.Errorf("expected resource type 'pipe4', got '%s'", res.Resource)
			}
		}
	})

}

func Test_Resource_FindAll(t *testing.T) {
	db := setupTestDB(t)

	resourcemodel := models.NewResourceModel(nil, db)

	// Insert multiple resources of PipelineResource type
	for i := 1; i <= 3; i++ {
		resource := PipelineResource{
			Name:     fmt.Sprintf("pipeline-%d", i),
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

		rawResource, err := json.Marshal(resource)
		if err != nil {
			t.Fatalf("failed to marshal resource: %v", err)
		}

		err = resourcemodel.BadgerDBInsert(resource.Name, resource.Resource, rawResource)
		if err != nil {
			t.Fatalf("failed to insert resource: %v", err)
		}
	}

	t.Run("Find All Resources", func(t *testing.T) {
		resources, err := resourcemodel.BadgerDBFindAll("pipe4")
		fmt.Printf("Found Resources: %+v\n", resources)
		if err != nil {
			t.Fatalf("failed to find all resources: %v", err)
		}

		if len(resources) != 3 {
			t.Errorf("expected 3 resources, got %d", len(resources))
		}

		for i, res := range resources {
			expectedName := fmt.Sprintf("pipeline-%d", i+1)
			if res.Name != expectedName {
				t.Errorf("expected resource name '%s', got '%s'", expectedName, res.Name)
			}
			if res.Resource != "pipe4" {
				t.Errorf("expected resource type 'pipe4', got '%s'", res.Resource)
			}
		}
	})

}
