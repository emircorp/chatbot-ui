"use client"

import { FC } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LimitDisplay } from "@/components/ui/limit-display"
import { PROFILE_DISPLAY_NAME_MAX } from "@/db/limits"

interface ProfileStepProps {
  displayName: string
  onDisplayNameChange: (name: string) => void
}

export const ProfileStep: FC<ProfileStepProps> = ({
  displayName = "",
  onDisplayNameChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Chat Display Name</Label>

        <Input
          placeholder="Your Name"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          maxLength={PROFILE_DISPLAY_NAME_MAX}
        />

        <LimitDisplay used={displayName.length} limit={PROFILE_DISPLAY_NAME_MAX} />
      </div>
    </div>
  )
}
