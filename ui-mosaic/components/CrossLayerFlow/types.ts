export type ProgressStatusType = "done" | "error" | "awaiting" | "in_progress";

export const ProgressStatus: { 
    [status in ProgressStatusType]: ProgressStatusType } = {
        done: "done",
        error: "error",
        awaiting: "awaiting",
        in_progress: "in_progress",
    }