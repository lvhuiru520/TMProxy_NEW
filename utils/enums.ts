enum EServerStatus {
    "ready",
    "running",
    "closed",
}

enum EUpdateStatus {
    "ready",
    "update-available",
    "update-cancelled",
    "update-not-available",
    "checking-for-update",
    "update-downloaded",
    "download-progress",
}

export { EServerStatus, EUpdateStatus };
