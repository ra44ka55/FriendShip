import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { insertMemorySchema } from "@shared/schema";
import type { Memory, InsertMemory } from "@shared/schema";
import { z } from "zod";

const formSchema = insertMemorySchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required")
});

export default function MemoriesTimeline() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: memories, isLoading } = useQuery<Memory[]>({
    queryKey: ['/api/memories'],
  });

  const createMemoryMutation = useMutation({
    mutationFn: async (data: InsertMemory) => {
      const response = await apiRequest('POST', '/api/memories', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memories'] });
      setIsModalOpen(false);
      form.reset();
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      type: "milestone"
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMemoryMutation.mutate(values);
  };

  const getEventColor = (index: number) => {
    const colors = ['primary', 'secondary', 'accent'];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <section id="memories" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Memory Timeline</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A journey through our favorite moments and milestones together
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full"></div>
            <div className="space-y-12">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="relative flex items-center">
                  <div className={`flex-1 ${i % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="p-6">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  {i % 2 !== 0 && <div className="flex-1 pr-8"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="memories" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4" data-testid="text-memories-title">
            Memory Timeline
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-memories-subtitle">
            A journey through our favorite moments and milestones together
          </p>
        </div>

        {!memories || memories.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-timeline text-6xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2" data-testid="text-no-memories">No memories yet</h3>
            <p className="text-muted-foreground mb-6" data-testid="text-no-memories-subtitle">
              Start documenting your journey by adding your first memory!
            </p>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-add-first-memory">
                  <i className="fas fa-plus mr-2"></i>
                  Add First Memory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Memory</DialogTitle>
                  <DialogDescription>
                    Document a special moment or milestone in your friendship journey.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Memory title" {...field} data-testid="input-memory-title" />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us about this memory..." {...field} data-testid="textarea-memory-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., January 2024" {...field} data-testid="input-memory-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={createMemoryMutation.isPending}
                      data-testid="button-submit-memory"
                    >
                      {createMemoryMutation.isPending ? 'Adding...' : 'Add Memory'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full"></div>
              
              <div className="space-y-12">
                {memories.map((memory, index) => (
                  <div key={memory.id} className="relative flex items-center">
                    <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <Card className="p-6 shadow-sm border border-border" data-testid={`card-memory-${memory.id}`}>
                        <span className="text-sm text-muted-foreground font-medium" data-testid={`text-memory-date-${memory.id}`}>
                          {memory.date}
                        </span>
                        <h3 className="text-lg font-semibold mt-1 mb-2" data-testid={`text-memory-title-${memory.id}`}>
                          {memory.title}
                        </h3>
                        <p className="text-muted-foreground" data-testid={`text-memory-description-${memory.id}`}>
                          {memory.description}
                        </p>
                      </Card>
                    </div>
                    
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-${getEventColor(index)} rounded-full border-4 border-background`}></div>
                    
                    {index % 2 !== 0 && <div className="flex-1 pr-8"></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3" data-testid="button-add-memory">
                    <i className="fas fa-plus mr-2"></i>
                    Add New Memory
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Memory</DialogTitle>
                    <DialogDescription>
                      Document a special moment or milestone in your friendship journey.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Memory title" {...field} data-testid="input-memory-title" />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about this memory..." {...field} data-testid="textarea-memory-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., January 2024" {...field} data-testid="input-memory-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={createMemoryMutation.isPending}
                        data-testid="button-submit-memory"
                      >
                        {createMemoryMutation.isPending ? 'Adding...' : 'Add Memory'}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
