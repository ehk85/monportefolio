export type Testimonial = {
  id: string;
  name: string | null;
  is_anonymous: boolean;
  company: string;
  comment: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
