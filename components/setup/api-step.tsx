"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC } from "react"

interface APIStepProps {
  openaiAPIKey: string
  onOpenaiAPIKeyChange: (key: string) => void
}

export const APIStep: FC<APIStepProps> = ({
  openaiAPIKey,
  onOpenaiAPIKeyChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>OpenAI API Key (optional)</Label>
        <Input
          placeholder="not-needed"
          value={openaiAPIKey}
          onChange={(e) => onOpenaiAPIKeyChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Leave as <code>not-needed</code> when using your self-hosted endpoint.
        </p>
      </div>
    </div>
  )
}
