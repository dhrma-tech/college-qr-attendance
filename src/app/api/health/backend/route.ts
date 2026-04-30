import { NextResponse } from "next/server";
import { backendMode } from "@/lib/backend/env";
import { apiWorkflowPaths, databaseWorkflowPaths, deploymentChecklist } from "@/lib/backend/workflow-map";

export async function GET() {
  return NextResponse.json({
    mode: backendMode(),
    apiRoutes: apiWorkflowPaths,
    databasePaths: databaseWorkflowPaths,
    environment: deploymentChecklist.map((item) => ({
      label: item.label,
      env: item.env,
      configured: Boolean(process.env[item.env])
    }))
  });
}
