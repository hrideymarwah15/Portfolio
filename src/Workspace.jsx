import React, { lazy, Suspense } from "react";

const Studio = lazy(() => import("./Studio"));

export default function Workspace({ theme, onObject }) {
  return (
    <div className="workspace">
      <Suspense fallback={<div className="scene-loading" aria-label="Loading 3D workspace" />}>
        <Studio mode="centered" theme={theme} onObject={onObject} />
      </Suspense>
    </div>
  );
}
