import React from "react";
import Link from "@docusaurus/Link";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/joy";
import {
  MdApi,
  MdArrowForward,
  MdOutlineHub,
  MdOutlineMemory,
  MdOutlineTerminal,
  MdSchema,
  MdStream,
} from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";

const capabilities = [
  {
    title: "Control plane",
    description:
      "Manages workflow state, job lifecycle, events, retries, cancellation, and log coordination.",
    icon: MdOutlineMemory,
  },
  {
    title: "Driver model",
    description:
      "Delegates execution to user-defined drivers, allowing workloads to run on Kubernetes, servers, VMs, edge devices, or custom infrastructure.",
    icon: MdOutlineHub,
  },
  {
    title: "API-first runtime",
    description:
      "Exposes orchestration primitives through APIs and SDKs so Conveyor can be embedded into other platforms.",
    icon: MdApi,
  },
  {
    title: "Log streaming",
    description:
      "Streams execution logs from drivers back to the control plane for consumption by external tools or user interfaces.",
    icon: MdStream,
  },
];

const relevancePoints = [
  {
    title: "Decouples orchestration from execution",
    description:
      "Conveyor does not assume how a job should run. It tracks and coordinates the lifecycle while drivers implement the execution strategy.",
  },
  {
    title: "Useful for platform builders",
    description:
      "It is designed for teams building internal developer platforms, CI/CD backends, PaaS systems, or automation layers.",
  },
  {
    title: "Infrastructure-agnostic by design",
    description:
      "The driver boundary allows Conveyor to target different environments without tying the core runtime to one infrastructure API.",
  },
];

function EtherealBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "-18%",
          background:
            "radial-gradient(circle at 18% 18%, rgba(125, 211, 252, 0.2), transparent 28%), radial-gradient(circle at 78% 8%, rgba(2, 132, 199, 0.14), transparent 24%), radial-gradient(circle at 64% 80%, rgba(186, 230, 253, 0.18), transparent 32%)",
          filter: "blur(14px)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(2, 132, 199, 0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.075) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 16%, black 78%, transparent)",
        },
      }}
    />
  );
}

function RuntimeDiagram() {
  const layers = [
    {
      title: "External Platform",
      detail: "UI, auth, product logic, developer experience",
    },
    {
      title: "Conveyor CI",
      detail: "workflow state, job lifecycle, events, logs, APIs",
    },
    {
      title: "Driver Layer",
      detail: "Kubernetes driver, server driver, VM driver, edge driver",
    },
    {
      title: "Execution Environment",
      detail: "containers, processes, devices, clusters, custom systems",
    },
  ];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "rgba(125, 211, 252, 0.25)",
        borderRadius: "28px",
        p: { xs: 2, md: 3 },
        bgcolor: "rgba(2, 6, 23, 0.72)",
        backdropFilter: "blur(22px)",
        boxShadow:
          "0 28px 90px rgba(8, 47, 73, 0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
        color: "#e0f2fe",
      }}
    >
      <Stack spacing={1.5}>
        {layers.map((layer, index) => (
          <React.Fragment key={layer.title}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "44px 1fr",
                gap: 1.5,
                alignItems: "center",
                p: 1.5,
                borderRadius: "18px",
                border: "1px solid",
                borderColor:
                  layer.title === "Conveyor CI"
                    ? "rgba(125, 211, 252, 0.55)"
                    : "rgba(125, 211, 252, 0.15)",
                bgcolor:
                  layer.title === "Conveyor CI"
                    ? "rgba(2, 132, 199, 0.18)"
                    : "rgba(15, 23, 42, 0.54)",
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  color: "#bae6fd",
                  bgcolor: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(125, 211, 252, 0.18)",
                }}
              >
                {index === 0 && <MdOutlineTerminal size={22} />}
                {index === 1 && <MdOutlineMemory size={22} />}
                {index === 2 && <MdOutlineHub size={22} />}
                {index === 3 && <MdSchema size={22} />}
              </Box>

              <Box>
                <Typography level="title-sm" sx={{ color: "#f0f9ff" }}>
                  {layer.title}
                </Typography>
                <Typography level="body-sm" sx={{ color: "#93c5fd" }}>
                  {layer.detail}
                </Typography>
              </Box>
            </Box>

            {index !== layers.length - 1 && (
              <Box
                sx={{
                  height: 18,
                  width: 1,
                  bgcolor: "rgba(125, 211, 252, 0.24)",
                  ml: "34px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderColor: "rgba(125, 211, 252, 0.15)" }} />

      <Box
        sx={{
          p: 2,
          borderRadius: "18px",
          bgcolor: "rgba(15, 23, 42, 0.76)",
          border: "1px solid rgba(125, 211, 252, 0.14)",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize: { xs: 12.5, md: 13.5 },
          lineHeight: 1.8,
          color: "#dbeafe",
          overflowX: "auto",
        }}
      >
        <Box component="span" sx={{ color: "#7dd3fc" }}>
          conveyor
        </Box>
        {" receives workflow event\n"}
        <Box component="span" sx={{ color: "#7dd3fc" }}>
          conveyor
        </Box>
        {" persists job state\n"}
        <Box component="span" sx={{ color: "#7dd3fc" }}>
          driver
        </Box>
        {" executes workload\n"}
        <Box component="span" sx={{ color: "#7dd3fc" }}>
          conveyor
        </Box>
        {" streams logs and status"}
      </Box>
    </Box>
  );
}

function CapabilityCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "22px",
        border: "1px solid rgba(2, 132, 199, 0.12)",
        bgcolor: "rgba(255, 255, 255, 0.66)",
        boxShadow: "0 18px 50px rgba(8, 47, 73, 0.06)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "15px",
          display: "grid",
          placeItems: "center",
          color: "#0284c7",
          bgcolor: "rgba(186, 230, 253, 0.5)",
          border: "1px solid rgba(2, 132, 199, 0.12)",
          mb: 2,
        }}
      >
        <Icon size={22} />
      </Box>

      <Typography
        level="title-md"
        sx={{
          color: "#082f49",
          letterSpacing: "-0.02em",
          mb: 0.75,
        }}
      >
        {title}
      </Typography>

      <Typography level="body-sm" sx={{ color: "#475569", lineHeight: 1.65 }}>
        {description}
      </Typography>
    </Box>
  );
}

function RelevanceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "22px",
        bgcolor: "rgba(240, 249, 255, 0.76)",
        border: "1px solid rgba(2, 132, 199, 0.12)",
      }}
    >
      <Typography
        level="title-md"
        sx={{
          color: "#075985",
          mb: 0.8,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </Typography>

      <Typography level="body-sm" sx={{ color: "#475569", lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Box>
  );
}

const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #f0f9ff 0%, #ffffff 46%, #f8fafc 100%)",
        color: "#082f49",
      }}
    >
      <EtherealBackground />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 8, md: 11 },
          pb: { xs: 7, md: 10 },
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 6, lg: 8 }}
          alignItems="center"
        >
          <Box sx={{ flex: 1, maxWidth: 720 }}>
            <Chip
              variant="soft"
              size="lg"
              sx={{
                mb: 2.5,
                color: "#0369a1",
                bgcolor: "rgba(186, 230, 253, 0.58)",
                border: "1px solid rgba(2, 132, 199, 0.14)",
                borderRadius: "999px",
                backdropFilter: "blur(14px)",
              }}
              startDecorator={<VscGraph />}
            >
              Open-source workflow orchestration runtime
            </Chip>

            <Typography
              level="h1"
              sx={{
                fontSize: {
                  xs: "2.45rem",
                  sm: "3.3rem",
                  md: "4.35rem",
                  lg: "4.9rem",
                },
                lineHeight: 0.98,
                letterSpacing: "-0.065em",
                fontWeight: 800,
                color: "#082f49",
                maxWidth: 760,
              }}
            >
              A headless control plane for CI/CD and automation systems.
            </Typography>

            <Typography
              level="body-lg"
              sx={{
                mt: 3,
                maxWidth: 670,
                color: "#334155",
                fontSize: { xs: "1.03rem", md: "1.15rem" },
                lineHeight: 1.8,
              }}
            >
              Conveyor CI is an embeddable workflow orchestration runtime for
              platform developers. It manages workflows, jobs, state
              transitions, events, and logs, while execution is delegated to
              infrastructure-specific drivers.
            </Typography>

            <Typography
              level="body-md"
              sx={{
                mt: 2,
                maxWidth: 650,
                color: "#475569",
                lineHeight: 1.75,
              }}
            >
              It is intended for teams building internal developer platforms,
              custom CI/CD systems, deployment backends, and automation layers
              that need control over how and where workloads run.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              <Button
                size="lg"
                component={Link}
                href="/docs/introduction"
                endDecorator={<MdArrowForward />}
                sx={{
                  px: 3.5,
                  py: 1.35,
                  borderRadius: "999px",
                  bgcolor: "#0284c7",
                  boxShadow: "0 18px 45px rgba(2, 132, 199, 0.18)",
                  "&:hover": {
                    bgcolor: "#0369a1",
                  },
                }}
              >
                Read documentation
              </Button>

              <Button
                size="lg"
                variant="outlined"
                component={Link}
                href="https://github.com/open-ug/conveyor"
                startDecorator={<FaGithub />}
                sx={{
                  px: 3.5,
                  py: 1.35,
                  borderRadius: "999px",
                  color: "#075985",
                  borderColor: "rgba(2, 132, 199, 0.24)",
                  bgcolor: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  "&:hover": {
                    bgcolor: "rgba(186, 230, 253, 0.34)",
                    borderColor: "rgba(2, 132, 199, 0.38)",
                  },
                }}
              >
                View source
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 1.6,
                py: 1.1,
                borderRadius: "14px",
                bgcolor: "rgba(8, 47, 73, 0.92)",
                color: "#e0f2fe",
                border: "1px solid rgba(125, 211, 252, 0.22)",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                fontSize: { xs: 12.5, md: 13.5 },
                boxShadow: "0 18px 48px rgba(8, 47, 73, 0.14)",
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              <Box component="span" sx={{ color: "#7dd3fc" }}>
                $
              </Box>
              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                curl -fsSL https://conveyor.open.ug/install | sh
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, width: "100%", maxWidth: 590 }}>
            <RuntimeDiagram />
          </Box>
        </Stack>

        <Box sx={{ mt: { xs: 7, md: 10 } }}>
          <Typography
            level="h2"
            sx={{
              color: "#082f49",
              fontSize: { xs: "2rem", md: "2.7rem" },
              letterSpacing: "-0.045em",
              mb: 1,
            }}
          >
            Technical scope
          </Typography>

          <Typography
            level="body-md"
            sx={{
              color: "#475569",
              maxWidth: 760,
              lineHeight: 1.75,
              mb: 3,
            }}
          >
            Conveyor focuses on the orchestration layer of automation systems.
            It does not provide a hosted service, a dashboard-first CI product,
            or a fixed runner model.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.title} {...capability} />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 7, md: 9 } }}>
          <Typography
            level="h2"
            sx={{
              color: "#082f49",
              fontSize: { xs: "2rem", md: "2.7rem" },
              letterSpacing: "-0.045em",
              mb: 1,
            }}
          >
            Why it is technically relevant
          </Typography>

          <Typography
            level="body-md"
            sx={{
              color: "#475569",
              maxWidth: 780,
              lineHeight: 1.75,
              mb: 3,
            }}
          >
            Conveyor is useful when the workflow engine should be embedded
            inside another system rather than adopted as a complete CI/CD
            platform.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {relevancePoints.map((point) => (
              <RelevanceCard key={point.title} {...point} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
