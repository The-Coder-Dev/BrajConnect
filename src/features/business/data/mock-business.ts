export const mockBusiness = {
  id: "biz_001",
  slug: "aura-premium-salon",
  name: "Aura Premium Salon & Spa",
  category: "Beauty & Wellness",
  rating: 4.9,
  reviewCount: 1248,
  viewCount: "45.2K",
  location: "Civil Lines, Mathura",
  coordinates: {
    lat: 27.4924,
    lng: 77.6737
  },
  verified: true,
  openNow: true,
  established: 2018,
  coverImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=2000",
  logo: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=200",
  images: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1521590832167-7bfc17484d20?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=1000",
  ],
  description: "Aura Premium Salon & Spa is Mathura's most luxurious destination for beauty, hair, and wellness. We believe in providing an unparalleled experience combining expert techniques with premium international products. Our highly trained stylists and therapists are dedicated to helping you look and feel your absolute best in a serene, meticulously designed environment.",
  highlights: {
    established: "2018",
    owner: "Priya Sharma",
    languages: "English, Hindi",
    serviceArea: "Mathura & Vrindavan",
    employees: "15+ Professionals",
    businessType: "Premium Salon"
  },
  services: [
    { id: "s1", name: "Premium Haircut & Styling", price: "₹499", icon: "Scissors" },
    { id: "s2", name: "Bridal Makeup Package", price: "₹14,999", icon: "Sparkles" },
    { id: "s3", name: "Deep Tissue Massage (60 min)", price: "₹1,499", icon: "Heart" },
    { id: "s4", name: "Keratin Hair Treatment", price: "₹3,999", icon: "Droplets" },
    { id: "s5", name: "Advanced Facial Care", price: "₹1,299", icon: "Smile" },
    { id: "s6", name: "Manicure & Pedicure Spa", price: "₹899", icon: "Activity" }
  ],
  amenities: [
    "Free Wi-Fi",
    "Valet Parking",
    "Air Conditioning",
    "Card/UPI Payment",
    "Waiting Lounge",
    "Complimentary Beverages",
    "Wheelchair Accessible",
    "Private Rooms"
  ],
  hours: [
    { day: "Monday", time: "10:00 AM - 8:00 PM", isOpen: true },
    { day: "Tuesday", time: "10:00 AM - 8:00 PM", isOpen: true },
    { day: "Wednesday", time: "10:00 AM - 8:00 PM", isOpen: true },
    { day: "Thursday", time: "10:00 AM - 8:00 PM", isOpen: true },
    { day: "Friday", time: "10:00 AM - 9:00 PM", isOpen: true },
    { day: "Saturday", time: "09:00 AM - 9:00 PM", isOpen: true },
    { day: "Sunday", time: "09:00 AM - 9:00 PM", isOpen: true }
  ],
  contact: {
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "booking@aurasalon.com",
    website: "www.aurasalon.com"
  },
  socials: {
    instagram: "https://instagram.com/aurasalon",
    facebook: "https://facebook.com/aurasalon",
    linkedin: "https://linkedin.com/company/aurasalon",
    youtube: "https://youtube.com/aurasalon"
  },
  reviews: {
    overall: 4.9,
    breakdown: {
      5: 1120,
      4: 105,
      3: 15,
      2: 5,
      1: 3
    },
    recent: [
      {
        id: "r1",
        author: "Sneha Verma",
        avatar: "https://i.pravatar.cc/150?u=sneha",
        rating: 5,
        date: "2 days ago",
        content: "Absolutely wonderful experience! The ambiance is incredibly relaxing and premium. The stylists really understand what you want and deliver perfectly. Highly recommend their keratin treatment.",
        verified: true
      },
      {
        id: "r2",
        author: "Rahul Singh",
        avatar: "https://i.pravatar.cc/150?u=rahul",
        rating: 5,
        date: "1 week ago",
        content: "Best salon in Mathura hands down. The professionalism, hygiene, and service quality are unmatched. The complimentary coffee was a nice touch!",
        verified: true
      },
      {
        id: "r3",
        author: "Ananya Gupta",
        avatar: "https://i.pravatar.cc/150?u=ananya",
        rating: 4,
        date: "3 weeks ago",
        content: "Great service and very polite staff. Took a bit longer than expected but the results were totally worth it. Will visit again.",
        verified: true
      }
    ]
  },
  faqs: [
    {
      question: "Do I need to book an appointment in advance?",
      answer: "While we do accept walk-ins depending on availability, we highly recommend booking an appointment at least 24 hours in advance to ensure you get your preferred time and stylist."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), and Cash."
    },
    {
      question: "Do you offer bridal packages?",
      answer: "Yes, we offer comprehensive bridal packages including pre-bridal sessions, makeup, hair styling, and draping. We also provide on-location services for weddings."
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, we exclusively use premium, internationally certified cruelty-free and skin-friendly products."
    }
  ],
  relatedBusinesses: [
    {
      id: "rb1",
      name: "Glow & Glamour Studio",
      category: "Beauty Salon",
      rating: 4.7,
      location: "Krishna Nagar",
      logo: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=150",
      verified: true
    },
    {
      id: "rb2",
      name: "The Wellness Spa",
      category: "Spa & Massage",
      rating: 4.8,
      location: "Highway Plaza",
      logo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=150",
      verified: true
    },
    {
      id: "rb3",
      name: "Elite Makeovers",
      category: "Bridal Studio",
      rating: 4.9,
      location: "Dampier Nagar",
      logo: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=150",
      verified: true
    }
  ]
};
