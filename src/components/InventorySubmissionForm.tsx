import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  waste_type: z.enum(["yarn_waste", "comber_noil", "flat_strips", "other"]),
  quantity: z.string().min(1).transform(Number),
  unit_price: z.string().min(1).transform(Number),
  location: z.string().min(3, "Location must be at least 3 characters"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function InventorySubmissionForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waste_type: "yarn_waste",
      quantity: "",
      unit_price: "",
      location: "",
      description: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.from("inventory_items").insert([
        {
          waste_type: data.waste_type,
          quantity: data.quantity,
          unit_price: data.unit_price,
          location: data.location,
          description: data.description || null,
        },
      ])

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your inventory has been submitted for review.",
      })
      form.reset()
    } catch (error) {
      console.error("Error submitting inventory:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit inventory. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Submit New Inventory</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="waste_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waste Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yarn_waste">Yarn Waste</SelectItem>
                    <SelectItem value="comber_noil">Comber Noil</SelectItem>
                    <SelectItem value="flat_strips">Flat Strips</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter quantity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price (₹/kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price per kg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Inventory"}
          </Button>
        </form>
      </Form>
    </div>
  )
}