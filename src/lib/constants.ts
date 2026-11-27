export const BRAND_NAME = "FORCE FUEL";
export const PRODUCT_NAME = "EAGLE ENDURANCE FOR MEN";
export const PRODUCT_NAME_BN = "ঈগল এন্ডুরেন্স ফর মেন";
export const PRODUCT_SUBTITLE = "পুরুষদের প্রাকৃতিক শক্তি ও স্ট্যামিনার জন্য প্রিমিয়াম ডায়েটারি সাপ্লিমেন্ট";
export const PRODUCT_PRICE = 1850; // BDT
export const PRODUCT_REGULAR_PRICE = 2450; // BDT
export const DEFAULT_STOCK = 120;

export const DEFAULT_SETTINGS = {
  delivery_charge_inside_dhaka: 70,
  delivery_charge_outside_dhaka: 130,
  contact_phone: "+880 1700-000000",
  whatsapp_number: "+880 1700-000000",
  announcement_text: "আজকের অর্ডারে নিশ্চিত ক্যাশ অন ডেলিভারি ও দ্রুততম সময়ে হোম ডেলিভারি!",
  announcement_enabled: true,
  facebook_pixel_id: "",
  courier_provider: "steadfast",
  steadfast_api_key: "",
  steadfast_secret_key: "",
  pathao_client_id: "",
  pathao_client_secret: "",
  pathao_store_id: "",
};

export const INITIAL_PRODUCT_IMAGES = [
  {
    id: "img-1",
    url: "/images/product/product-1.jpg",
    alt: "FORCE FUEL ঈগল এন্ডুরেন্স বোতল ও প্যাকেজিং স্টুডিও ডিসপ্লে",
    is_primary: true,
    display_order: 1,
  },
  {
    id: "img-2",
    url: "/images/product/product-2.jpg",
    alt: "FORCE FUEL ঈগল এন্ডুরেন্স ডায়েটারি সাপ্লিমেন্ট বক্স ও বোতল",
    is_primary: false,
    display_order: 2,
  },
  {
    id: "img-3",
    url: "/images/product/product-3.jpg",
    alt: "FORCE FUEL প্রাকৃতিক হারবাল পরিবেশে সাজানো বোতল",
    is_primary: false,
    display_order: 3,
  },
  {
    id: "img-4",
    url: "/images/product/product-4.jpg",
    alt: "FORCE FUEL ডায়েটারি সাপ্লিমেন্ট বোতল হাতে গ্রাহক",
    is_primary: false,
    display_order: 4,
  },
];

export const VERIFIED_INGREDIENTS = [
  {
    name: "স্ট্যান্ডার্ডাইজড G115® জিনসেং এক্সট্রাক্ট",
    source: "Panax Ginseng Extract (G115®)",
    description:
      "প্যাকেজিংয়ে উল্লিখিত বিশ্বখ্যাত স্ট্যান্ডার্ডাইজড প্যানাক্স জিনসেং এক্সট্রাক্ট। এটি শারীরিক ক্লান্তি দূর করতে, দীর্ঘস্থায়ী স্ট্যামিনা ও কার্যক্ষমতা বজায় রাখতে কার্যকরভাবে সহায়তা করে।",
    badge: "প্যাকেজিং ভেরিফায়েড",
  },
  {
    name: "KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্ট",
    source: "Full-Spectrum Root Extract (KSM-66®)",
    description:
      "বিশ্বজুড়ে শীর্ষ মানের ফুল-স্পেকট্রাম অশ্বগন্ধা মূলের নির্যাস। এটি পুরুষদের মানসিক চাপ প্রশমিত করতে, ভাইটালিটি ধরে রাখতে এবং প্রাকৃতিক শক্তি ও স্থায়িত্ব বৃদ্ধিতে বিশেষ উপযোগী।",
    badge: "প্যাকেজিং ভেরিফায়েড",
  },
];

export const PRODUCT_HIGHLIGHTS = [
  {
    title: "স্ট্যান্ডার্ডাইজড G115®",
    description: "আসল G115® জিনসেং এক্সট্রাক্ট সমৃদ্ধ যা প্রতিদিনের প্রাণশক্তি ও কর্মক্ষমতা বজায় রাখতে সাহায্য করে।",
    icon: "ShieldCheck",
  },
  {
    title: "KSM-66® অশ্বগন্ধা",
    description: "প্রিমিয়াম ফুল-স্পেকট্রাম রুট এক্সট্রাক্ট যা মানসিক প্রশান্তি, শারীরিক শক্তি ও সহনশীলতা প্রদান করে।",
    icon: "Sparkles",
  },
  {
    title: "প্রতি বোতলে ৬০ ডোজ",
    description: "প্রতিটি সিল্ড বোতলে রয়েছে পূর্ণ ৬০ ডোজ খাদ্যতালিকাগত ও পুষ্টিকর ক্যাপসুল, যা দীর্ঘমেয়াদী ব্যবহারের জন্য পর্যাপ্ত।",
    icon: "PackageCheck",
  },
  {
    title: "ক্যাশ অন ডেলিভারি",
    description: "সারা বাংলাদেশে ঘরে বসে পণ্য হাতে পেয়ে ও প্যাকেট দেখে মূল্য পরিশোধ করার ১০০% নিরাপদ সুবিধা।",
    icon: "Truck",
  },
];

export const PRODUCT_SPECS = [
  { label: "ব্র্যান্ডের নাম", value: "FORCE FUEL" },
  { label: "পণ্যের নাম", value: "EAGLE ENDURANCE FOR MEN (ঈগল এন্ডুরেন্স)" },
  { label: "ক্যাটাগরি", value: "মেনস ডায়েটারি সাপ্লিমেন্ট (Men's Dietary Supplement)" },
  { label: "পরিমাণ / ডোজ", value: "৬০ ডোজ / ক্যাপসুল" },
  { label: "মূল কার্যকরী উপাদান", value: "স্ট্যান্ডার্ডাইজড G115® ও KSM-66® এক্সট্রাক্ট" },
  { label: "ব্যবহারের ধরন", value: "মুখে সেব্য ক্যাপসুল (Oral Capsules)" },
  { label: "প্যাকেজিং নিরাপত্তা", value: "ইউভি-সুরক্ষিত সিল্ড ব্ল্যাক বোতল ও প্রিমিয়াম সিকিউরিটি কার্টন" },
  { label: "মূল্য পরিশোধ পদ্ধতি", value: "সারা দেশে ক্যাশ অন ডেলিভারি (COD)" },
];

export const FAQS = [
  {
    question: "FORCE FUEL – EAGLE ENDURANCE FOR MEN কী?",
    answer:
      "FORCE FUEL হলো পুরুষদের শারীরিক স্ট্যামিনা, প্রাকৃতিক শক্তি এবং দীর্ঘস্থায়ী সহনশীলতা বৃদ্ধির লক্ষ্যে তৈরি একটি প্রিমিয়াম ডায়েটারি সাপ্লিমেন্ট। এটি বিশ্বখ্যাত স্ট্যান্ডার্ডাইজড G115® জিনসেং এবং KSM-66® অশ্বগন্ধা মূলের নির্যাসের সমন্বয়ে প্রস্তুত।",
  },
  {
    question: "এতে কী কী মূল উপাদান রয়েছে?",
    answer:
      "পণ্যের প্যাকেজিংয়ে স্পষ্টভাবে উল্লিখিত হয়েছে যে এটি আসল G115® প্যানাক্স জিনসেং এবং KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্ট দ্বারা সমৃদ্ধ। এতে কোনো ক্ষতিকর কেমিক্যাল বা অননুমোদিত ড্রাগ নেই।",
  },
  {
    question: "একটি বোতলে কতগুলো ডোজ বা ক্যাপসুল থাকে?",
    answer:
      "প্রতিটি সিল করা বোতলে রয়েছে পূর্ণ ৬০ ডোজ / ক্যাপসুল, যা আপনার নিয়মিত ব্যবহারের জন্য ১ থেকে ২ মাসের সম্পূর্ণ ডোজ নিশ্চিত করে।",
  },
  {
    question: "এটি কীভাবে সেবন করতে হবে?",
    answer:
      "বোতলের লেবেলে প্রদত্ত নির্দেশিকা অনুযায়ী সেবন করুন। সাধারণত প্রতিদিন পর্যাপ্ত পানি সহ খাবারের সাথে বা খাবারের পর সেব্য। অতিরিক্ত মাত্রায় সেবন থেকে বিরত থাকুন।",
  },
  {
    question: "কারা এটি ব্যবহার করতে পারবেন এবং সতর্কতা কী?",
    answer:
      "এটি শুধুমাত্র প্রাপ্তবয়স্ক পুরুষদের (১৮ বছর বা তদূর্ধ্ব) জন্য তৈরি। শিশুদের নাগালের বাইরে রাখুন। যদি আপনার কোনো জটিল স্বাস্থ্যগত বা কার্ডিওভাসকুলার সমস্যা থাকে অথবা নিয়মিত কোনো প্রেসক্রিপশন মেডিসিন গ্রহণ করেন, তবে চিকিৎসকের পরামর্শ নিয়ে সেবন করুন।",
  },
  {
    question: "ক্যাশ অন ডেলিভারি (COD) কীভাবে কাজ করে?",
    answer:
      "সারা বাংলাদেশের ৬৪টি জেলাতেই আমাদের ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পণ্য ডেলিভারিম্যানের কাছ থেকে বুঝে নিয়ে এবং প্যাকেটের সিল দেখে তারপর সরাসরি নগদে মূল্য পরিশোধ করবেন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।",
  },
  {
    question: "ডেলিভারি চার্জ কত এবং কতদিনে ডেলিভারি পাওয়া যাবে?",
    answer:
      "ঢাকা শহরের ভেতরে ডেলিভারি চার্জ মাত্র ৳৭০ (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)। ঢাকা শহরের বাইরে সারা বাংলাদেশে ডেলিভারি চার্জ ৳১৩০ (৪৮ থেকে ৭২ ঘণ্টার মধ্যে ডেলিভারি)।",
  },
];

export const BANGLADESH_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Gazipur",
  "Narayanganj",
  "Cumilla",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Bogura",
  "Barishal",
  "Mymensingh",
  "Rangpur",
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Bhola",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chuadanga",
  "Cox's Bazar",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Naogaon",
  "Narail",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rangamati",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Tangail",
  "Thakurgaon",
];
