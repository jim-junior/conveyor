# Building the binary of the App
FROM golang:1.23.0 AS build

WORKDIR /go/src/boilerplate

COPY . .

RUN go mod tidy

# Accept a build argument for version
ARG VERSION=dev

# Pass the version to ldflags
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
  -ldflags "-X 'github.com/open-ug/conveyor/cmd/cli.Version=${VERSION}'" \
  -a -installsuffix cgo -o app .

# Final Image
FROM ubuntu:latest AS release

WORKDIR /app

COPY --from=build /go/src/boilerplate/app .

RUN apt-get update && \
  apt-get install -y ca-certificates

EXPOSE 8080

ENTRYPOINT ["/app/app"]

CMD ["up"]
