import TestPortalClient from "../../../../test-portal/[field]/[specialty]/TestPortalClient"

type Props = {
  params: Promise<{ field: string; specialty: string }>
}

export default async function TestPortalPage({ params }: Props) {
  const { field, specialty } = await params

  return <TestPortalClient field={field} specialty={specialty} />
}