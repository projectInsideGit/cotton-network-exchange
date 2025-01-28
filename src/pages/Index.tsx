import { useAuth } from "@/providers/AuthProvider"
import { InventorySubmissionForm } from "@/components/InventorySubmissionForm"

export default function Index() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Cotton Waste Management</h1>
      {user ? <InventorySubmissionForm /> : (
        <p className="text-center text-gray-600">
          Please log in to submit inventory.
        </p>
      )}
    </div>
  )
}