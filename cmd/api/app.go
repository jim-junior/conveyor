/*
Copyright © 2024 Beingana Jim Junior and Contributors
*/
package api

import (
	"time"

	"github.com/fatih/color"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/cors"
	metrics "github.com/open-ug/conveyor/internal/metrics"
	routes "github.com/open-ug/conveyor/internal/routes"
	utils "github.com/open-ug/conveyor/internal/utils"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/spf13/viper"
)

func StartServer(port string) {

	app := fiber.New(fiber.Config{
		AppName:     "Conveyor API Server",
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	app.Use(cors.New())

	// Start metrics updater
	metrics.StartAPIMetricsUpdater()

	// Add Prometheus middleware
	app.Use(metrics.PrometheusMiddleware())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("CONVEYOR API SERVER. Visit https://conveyor.open.ug for Documentation")
	})
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "healthy",
			"time":   time.Now().Unix(),
		})
	})

	// Metrics endpoint
	app.Get("/metrics", adaptor.HTTPHandler(promhttp.Handler()))

	natsContext := utils.NewNatsConn()
	natsContext.InitiateStreams()

	etcd, err := utils.NewEtcdClient(
		viper.GetString("etcd.host"),
	)

	if err != nil {
		color.Red("Error Occured while creating etcd client: %v", err)
		return
	}

	routes.DriverRoutes(app, etcd.Client, natsContext.NatsCon)
	routes.ResourceRoutes(app, etcd.Client, natsContext)

	app.Listen(":" + port)

}
