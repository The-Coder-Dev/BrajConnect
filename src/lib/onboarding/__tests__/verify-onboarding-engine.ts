import { getAllCategoryConfigs, getCategoryConfig, isRegisteredCategory } from "@/config/business-categories";
import { evaluateCondition, isFieldVisible, getNestedValue } from "@/lib/onboarding/conditions";
import { validateCategorySubmission, sanitizeCategoryData } from "@/lib/onboarding/validation";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

async function runTests() {
  console.log("==================================================");
  console.log("🧪 Running Category-Driven Onboarding Engine Tests");
  console.log("==================================================\n");

  // 1. Registry tests
  console.log("📦 1. Testing Category Registry (11 Categories)");
  const configs = getAllCategoryConfigs();
  assert(configs.length === 11, `Expected 11 category configs, found ${configs.length}`);

  const expectedSlugs = [
    "hotel", "restaurant", "college", "school", "loan",
    "property", "salon", "dental", "doctor", "coaching", "hospital"
  ];

  for (const slug of expectedSlugs) {
    const config = getCategoryConfig(slug);
    assert(config !== undefined, `Category config '${slug}' is registered`);
    assert(config?.slug === slug, `Category '${slug}' slug matches`);
    assert(config?.sections.length! > 0, `Category '${slug}' has sections defined`);
    assert(config?.documentRequirements.length! > 0, `Category '${slug}' has document requirements`);
  }

  // Check ID lookups
  assert(getCategoryConfig("cat_hotel")?.slug === "hotel", "Lookup by cat_hotel ID works");
  assert(getCategoryConfig("cat_restaurant")?.slug === "restaurant", "Lookup by cat_restaurant ID works");
  assert(isRegisteredCategory("hotel"), "isRegisteredCategory('hotel') is true");
  assert(!isRegisteredCategory("non_existent_category"), "isRegisteredCategory('non_existent') is false");

  // 2. Condition Engine Tests
  console.log("\n⚡ 2. Testing Condition Engine");
  
  // Nested values
  const testForm = {
    categoryData: {
      roomTypes: ["deluxe", "luxury"],
      hasSwimmingPool: true,
      poolHours: "6 AM - 9 PM",
      isPureVeg: false,
    },
  };

  assert(getNestedValue(testForm, "categoryData.hasSwimmingPool") === true, "getNestedValue boolean");
  assert(
    JSON.stringify(getNestedValue(testForm, "categoryData.roomTypes")) === JSON.stringify(["deluxe", "luxury"]),
    "getNestedValue array"
  );

  // Simple conditions
  assert(
    evaluateCondition(
      { field: "categoryData.hasSwimmingPool", operator: "is_true" },
      testForm
    ),
    "evaluateCondition is_true"
  );

  assert(
    evaluateCondition(
      { field: "categoryData.isPureVeg", operator: "is_false" },
      testForm
    ),
    "evaluateCondition is_false"
  );

  assert(
    evaluateCondition(
      { field: "categoryData.roomTypes", operator: "includes", value: "deluxe" },
      testForm
    ),
    "evaluateCondition includes (in array)"
  );

  assert(
    !evaluateCondition(
      { field: "categoryData.roomTypes", operator: "includes", value: "suite" },
      testForm
    ),
    "evaluateCondition includes (not in array)"
  );

  // Compound condition (AND)
  assert(
    evaluateCondition(
      {
        all: [
          { field: "categoryData.hasSwimmingPool", operator: "is_true" },
          { field: "categoryData.roomTypes", operator: "includes", value: "luxury" },
        ],
      },
      testForm
    ),
    "evaluateCondition compound ALL (true)"
  );

  assert(
    !evaluateCondition(
      {
        all: [
          { field: "categoryData.hasSwimmingPool", operator: "is_true" },
          { field: "categoryData.roomTypes", operator: "includes", value: "non_existent" },
        ],
      },
      testForm
    ),
    "evaluateCondition compound ALL (false)"
  );

  // Compound condition (OR)
  assert(
    evaluateCondition(
      {
        any: [
          { field: "categoryData.roomTypes", operator: "includes", value: "suite" },
          { field: "categoryData.roomTypes", operator: "includes", value: "deluxe" },
        ],
      },
      testForm
    ),
    "evaluateCondition compound ANY (true)"
  );

  // 3. Category Validation Tests
  console.log("\n🛡️ 3. Testing Category Validation Engine");

  // Hotel Validation
  const hotelConfig = getCategoryConfig("hotel")!;
  
  // Incomplete Hotel Data (missing required starRating, roomTypes, checkin/checkout)
  const incompleteHotel = {
    propertyType: "hotel",
  };
  const hotelFailResult = validateCategorySubmission(hotelConfig, incompleteHotel);
  assert(!hotelFailResult.success, "Incomplete Hotel submission fails validation correctly");

  // Valid Hotel Data
  const validHotel = {
    propertyType: "hotel",
    starRating: "4_star",
    totalRooms: 45,
    roomTypes: ["deluxe", "luxury"],
    deluxeDetails: {
      roomsCount: 15,
      pricePerNight: 4500,
      maxOccupancy: 3,
      bedType: "king",
      hasAC: true,
      hasAttachedBathroom: true,
    },
    luxuryDetails: {
      roomsCount: 10,
      pricePerNight: 8500,
      maxOccupancy: 4,
      bedType: "king",
      hasAC: true,
      hasAttachedBathroom: true,
    },

    hasSwimmingPool: true,
    poolTiming: "6:00 AM - 8:00 PM",
    hasBanquetHall: false,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    coupleFriendly: true,
    cancellationPolicy: "flexible",
  };


  const hotelSuccessResult = validateCategorySubmission(hotelConfig, validHotel);
  assert(hotelSuccessResult.success, "Valid Hotel submission passes validation");

  // Restaurant Validation
  const restConfig = getCategoryConfig("restaurant")!;
  const validRestaurant = {
    restaurantType: "fine_dining",
    averageCostForTwo: 1200,
    seatingCapacity: 80,
    cuisines: ["north_indian", "braj_traditional", "italian"],
    isPureVeg: true,
    jainFoodAvailable: true,
    services: ["dine_in", "takeaway", "table_reservation"],
    airConditioned: true,
    freeWifi: true,
  };

  const restSuccessResult = validateCategorySubmission(restConfig, validRestaurant);
  assert(restSuccessResult.success, "Valid Restaurant submission passes validation");

  // College Validation (with repeatable courses)
  const collegeConfig = getCategoryConfig("college")!;
  const validCollege = {
    institutionType: "engineering",
    affiliatingUniversity: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    naacGrade: "a_plus",
    regulatoryApproval: ["ugc", "aicte"],
    courses: [
      {
        courseName: "B.Tech Computer Science & Engineering",
        degreeLevel: "ug",
        durationYears: 4,
        totalSeats: 120,
        annualFee: 95000,
        eligibilityCriteria: "10+2 PCM 60% + JEE Score",
      },
      {
        courseName: "M.Tech Artificial Intelligence",
        degreeLevel: "pg",
        durationYears: 2,
        totalSeats: 30,
        annualFee: 110000,
      },
    ],
    campusFacilities: ["boys_hostel", "girls_hostel", "digital_library", "advanced_labs", "wifi"],
    highestPackageLPA: 28.5,
    averagePackageLPA: 7.2,
  };

  const collegeSuccessResult = validateCategorySubmission(collegeConfig, validCollege);
  assert(collegeSuccessResult.success, "Valid College submission with repeatable courses passes validation");

  // School Validation
  const schoolConfig = getCategoryConfig("school")!;
  const validSchool = {
    schoolType: "senior_secondary",
    boardAffiliation: "cbse",
    mediumOfInstruction: "english",
    classesOffered: "Nursery to 12th",
    affiliationNumber: "CBSE/AFF/2130456",
    annualFeeRange: 48000,
    schoolFacilities: ["smart_classes", "science_labs", "computer_lab", "sports_ground"],
  };
  const schoolRes = validateCategorySubmission(schoolConfig, validSchool);
  assert(schoolRes.success, "Valid School passes validation");

  // Loan Validation
  const loanConfig = getCategoryConfig("loan")!;
  const validLoan = {
    providerType: "nbfc",
    loanTypes: ["personal_loan", "home_loan", "business_loan"],
    minLoanAmount: 50000,
    maxLoanAmount: 10000000,
    minInterestRateAPR: 8.9,
    maxTenureYears: 20,
    eligibleEmploymentTypes: ["salaried", "self_employed_pro"],
  };
  const loanRes = validateCategorySubmission(loanConfig, validLoan);
  assert(loanRes.success, "Valid Loan passes validation");

  // Property Validation
  const propertyConfig = getCategoryConfig("property")!;
  const validProperty = {
    listingPurpose: "sale",
    propertyType: "apartment",
    expectedPrice: 4500000,
    bedroomsBHK: "3_bhk",
    bathrooms: 3,
    furnishingStatus: "semi_furnished",
    carpetAreaSqFt: 1450,
  };
  const propertyRes = validateCategorySubmission(propertyConfig, validProperty);
  assert(propertyRes.success, "Valid Property passes validation");

  // Salon Validation
  const salonConfig = getCategoryConfig("salon")!;
  const validSalon = {
    salonType: "unisex",
    bookingMode: "both",
    servicesOffered: ["hair_styling", "hair_color", "facials", "bridal_makeup"],
    brandsUsed: "L'Oreal, MAC, O3+",
  };
  const salonRes = validateCategorySubmission(salonConfig, validSalon);
  assert(salonRes.success, "Valid Salon passes validation");

  // Dental Validation
  const dentalConfig = getCategoryConfig("dental")!;
  const validDental = {
    leadDentistName: "Dr. Rohit Mathur",
    qualifications: "BDS, MDS (Orthodontics)",
    councilRegistrationNumber: "UP-DCI-98432",
    yearsOfExperience: 10,
    consultationFee: 300,
    treatmentsOffered: ["rct", "implants", "aligners_braces"],
    digitalXRayOnsite: true,
  };
  const dentalRes = validateCategorySubmission(dentalConfig, validDental);
  assert(dentalRes.success, "Valid Dental passes validation");

  // Doctor Validation
  const doctorConfig = getCategoryConfig("doctor")!;
  const validDoctor = {
    doctorFullName: "Dr. Sunita Sharma",
    primarySpecialization: "cardiologist",
    medicalDegrees: "MBBS, MD (Medicine), DM (Cardiology)",
    medicalCouncilRegNumber: "MCI-48291",
    experienceYears: 16,
    consultationModes: ["in_clinic", "video"],
    inClinicFee: 700,
    videoConsultationFee: 500,
  };
  const doctorRes = validateCategorySubmission(doctorConfig, validDoctor);
  assert(doctorRes.success, "Valid Doctor passes validation");

  // Coaching Validation
  const coachingConfig = getCategoryConfig("coaching")!;
  const validCoaching = {
    targetExams: ["jee", "neet"],
    deliveryModes: ["offline", "live_online"],
    batches: [
      {
        batchName: "NEET Rankers Batch 2026",
        targetCategory: "NEET UG",
        durationMonths: 12,
        totalFee: 75000,
        timingSlot: "morning",
        installmentAllowed: true,
      },
    ],
    freeDemoClass: true,
    instituteFeatures: ["study_material", "test_series", "doubt_sessions"],
  };
  const coachingRes = validateCategorySubmission(coachingConfig, validCoaching);
  assert(coachingRes.success, "Valid Coaching passes validation");

  // Hospital Validation
  const hospitalConfig = getCategoryConfig("hospital")!;
  const validHospital = {
    hospitalType: "multi_specialty",
    totalBedCapacity: 120,
    icuBedCapacity: 20,
    emergencyInfrastructure: ["emergency_trauma", "pharmacy", "radiology", "ambulance"],
    departments: ["cardiology", "neurology", "orthopedics", "surgery", "pediatrics"],
    cashlessInsuranceAccepted: true,
    ayushmanBharatEmpanelled: true,
  };
  const hospitalRes = validateCategorySubmission(hospitalConfig, validHospital);
  assert(hospitalRes.success, "Valid Hospital passes validation");


  // 4. Data Sanitization & Leak Prevention
  console.log("\n🔒 4. Testing Category Switching & Leak Prevention");
  const mixedData = {
    ...validHotel,
    // Stray restaurant fields
    cuisines: ["north_indian"],
    averageCostForTwo: 500,
    // Stray unconfigured field
    maliciousInject: "DROP TABLE users;",
  };

  const sanitizedHotelData = sanitizeCategoryData(hotelConfig, mixedData);
  assert(sanitizedHotelData.propertyType === "hotel", "Sanitized hotel retains valid propertyType");
  assert(sanitizedHotelData.deluxeDetails !== undefined, "Sanitized hotel retains deluxe room config");
  assert(sanitizedHotelData.cuisines === undefined, "Stray restaurant cuisine field is stripped from hotel");
  assert(sanitizedHotelData.averageCostForTwo === undefined, "Stray averageCostForTwo is stripped from hotel");
  assert(sanitizedHotelData.maliciousInject === undefined, "Unconfigured malicious injection is stripped");

  console.log("\n🎉 ALL 32 ONBOARDING ENGINE TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}


runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
