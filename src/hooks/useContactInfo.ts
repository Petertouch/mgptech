import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface ContactInfo {
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  photo_url: string;
}

const defaultContact: ContactInfo = {
  first_name: "",
  last_name: "",
  company: "",
  title: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  photo_url: "",
};

const CONTACT_SLUG = "__contact_qr__";

export function useContactInfo() {
  return useQuery({
    queryKey: ["contact_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("content")
        .eq("slug", CONTACT_SLUG)
        .maybeSingle();
      if (error) throw error;
      if (!data?.content) return defaultContact;
      try {
        return JSON.parse(data.content) as ContactInfo;
      } catch {
        return defaultContact;
      }
    },
  });
}

export function useSaveContactInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: ContactInfo) => {
      const jsonContent = JSON.stringify(contact);

      // Check if the special blog post exists
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", CONTACT_SLUG)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update({ content: jsonContent })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert({
            title: "Contact QR Data",
            slug: CONTACT_SLUG,
            content: jsonContent,
            excerpt: "system",
            meta_description: "",
            is_published: false,
            author: "system",
            tags: [],
            reading_time: 0,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_info"] });
    },
  });
}

export function buildVCard(c: ContactInfo): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${c.first_name} ${c.last_name}`.trim(),
    `N:${c.last_name};${c.first_name};;;`,
    `ORG:${c.company}`,
    `TITLE:${c.title}`,
    `TEL;TYPE=CELL:${c.phone}`,
    `EMAIL:${c.email}`,
    `URL:${c.website}`,
    `ADR;TYPE=WORK:;;${c.address};${c.city};${c.state};${c.zip};${c.country}`,
  ];
  if (c.whatsapp) lines.push(`TEL;TYPE=MSG:${c.whatsapp}`);
  if (c.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${c.instagram}`);
  if (c.facebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${c.facebook}`);
  if (c.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${c.linkedin}`);
  if (c.photo_url) lines.push(`PHOTO;VALUE=URI:${c.photo_url}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}
