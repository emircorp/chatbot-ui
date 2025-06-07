"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId, updateProfile } from "@/db/profile"
import {
  getHomeWorkspaceByUserId,
  getWorkspacesByUserId
} from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesUpdate } from "@/supabase/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { FinishStep } from "@/components/setup/finish-step"
import { ProfileStep } from "@/components/setup/profile-step"
import { APIStep } from "@/components/setup/api-step" // sadeleştirilmiş
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "@/components/setup/step-container"

export default function SetupPage() {
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace
  } = useContext(ChatbotUIContext)

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  /* Profile step */
  const [displayName, setDisplayName] = useState("")

  /* API step – yalnızca OpenAI */
  const [openaiAPIKey, setOpenaiAPIKey] = useState("not-needed")

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session
      if (!session) return router.push("/login")

      const userProfile = await getProfileByUserId(session.user.id)
      setProfile(userProfile)

      if (!userProfile.has_onboarded) {
        setLoading(false)
      } else {
        const homeId = await getHomeWorkspaceByUserId(session.user.id)
        return router.push(`/${homeId}/chat`)
      }
    })()
  }, [])

  const handleShouldProceed = (proceed: boolean) => {
    if (proceed) {
      if (currentStep === SETUP_STEP_COUNT) {
        handleSaveSetupSetting()
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    } else {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSaveSetupSetting = async () => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) return router.push("/login")

    const dbProfile = await getProfileByUserId(session.user.id)

    /* ---- sadece gerekli alanlar ---- */
    const payload: TablesUpdate<"profiles"> = {
      ...dbProfile,
      has_onboarded: true,
      display_name: displayName,
      openai_api_key: openaiAPIKey
    }

    const updated = await updateProfile(dbProfile.id, payload)
    setProfile(updated)

    const workspaces = await getWorkspacesByUserId(dbProfile.user_id)
    const home = workspaces.find((w) => w.is_home)!
    setSelectedWorkspace(home)
    setWorkspaces(workspaces)

    router.push(`/${home.id}/chat`)
  }

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <StepContainer
            stepDescription="Let's create your profile."
            stepNum={step}
            stepTitle="Welcome to Chatbot UI"
            onShouldProceed={handleShouldProceed}
            showNextButton={!!displayName}
            showBackButton={false}
          >
            <ProfileStep
              displayName={displayName}
              onDisplayNameChange={setDisplayName}
            />
          </StepContainer>
        )
      case 2:
        return (
          <StepContainer
            stepDescription="Enter your OpenAI API key (optional)."
            stepNum={step}
            stepTitle="Set OpenAI Key"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <APIStep
              openaiAPIKey={openaiAPIKey}
              onOpenaiAPIKeyChange={setOpenaiAPIKey}
            />
          </StepContainer>
        )
      case 3:
        return (
          <StepContainer
            stepDescription="You are all set up!"
            stepNum={step}
            stepTitle="Setup Complete"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <FinishStep displayName={displayName} />
          </StepContainer>
        )
      default:
        return null
    }
  }

  if (loading) return null

  return (
    <div className="flex h-full items-center justify-center">
      {renderStep(currentStep)}
    </div>
  )
}
