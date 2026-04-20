import FieldPageClient from "./FieldPageClient"

type Props = {
  params: Promise<{ field: string }>
}

export default async function FieldPage({ params }: Props) {
  const { field } = await params

  return <FieldPageClient field={field} />
}