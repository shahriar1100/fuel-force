import { z } from "zod";

// Bangladesh Phone Validation: matches 01XXXXXXXXX or +8801XXXXXXXXX
export const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "আপনার পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)")
    .max(100, "নামটি অতিরিক্ত দীর্ঘ"),
  phone: z
    .string()
    .trim()
    .regex(
      phoneRegex,
      "সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নাম্বার দিন (যেমন: 01712345678)"
    ),
  district: z.string().trim().min(2, "অনুগ্রহ করে আপনার জেলা নির্বাচন করুন"),
  fullAddress: z
    .string()
    .trim()
    .min(5, "আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/এলাকা)")
    .max(500, "ঠিকানাটি অতিরিক্ত দীর্ঘ"),
  quantity: z.coerce.number().int().min(1, "সর্বনিম্ন পরিমাণ ১").max(20, "সর্বোচ্চ পরিমাণ ২০"),
  productId: z.string().optional(),
});

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;

export const productUpdateSchema = z.object({
  name: z.string().trim().min(2, "পণ্যের নাম প্রদান করুন"),
  description: z.string().trim().min(10, "বিবরণ অন্তত ১০ অক্ষরের হতে হবে"),
  price: z.coerce.number().positive("মূল্য অবশ্যই ০ এর বেশি হতে হবে"),
  stock_quantity: z.coerce.number().int().min(0, "স্টক সংখ্যা নেগেটিভ হতে পারে না"),
});

export const settingsUpdateSchema = z.object({
  delivery_charge_inside_dhaka: z.coerce.number().min(0, "ডেলিভারি চার্জ প্রদান করুন"),
  delivery_charge_outside_dhaka: z.coerce.number().min(0, "ডেলিভারি চার্জ প্রদান করুন"),
  contact_phone: z.string().trim().min(8, "সঠিক মোবাইল নাম্বার দিন"),
  whatsapp_number: z.string().trim().min(8, "সঠিক হোয়াটসঅ্যাপ নাম্বার দিন"),
});
