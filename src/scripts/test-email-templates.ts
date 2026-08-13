import "dotenv/config";
import {
  renderBusinessSubmittedEmail,
  renderBusinessApprovedEmail,
  renderBusinessRejectedEmail,
  renderBusinessResubmittedEmail,
} from "../lib/email";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log("Starting Transactional Email Templates Validation...\n");

  // Test 1: BUSINESS_SUBMITTED
  const sub = renderBusinessSubmittedEmail({
    ownerName: "Radha Krishna Sharma",
    businessName: "Braj Mathura Sweets & Crafts",
  });
  console.log("[Test 1: BUSINESS_SUBMITTED]");
  console.log(`Subject: ${sub.subject}`);
  assert(sub.subject === "Your business has been submitted to BachatLal", "Invalid subject for submitted email");
  assert(sub.html.includes("Radha Krishna Sharma"), "Owner name missing in submitted email");
  assert(sub.html.includes("Braj Mathura Sweets &amp; Crafts"), "Escaped business name missing in submitted email");
  assert(sub.html.includes("Pending Review"), "Pending review status missing in submitted email");
  assert(sub.html.includes("/dashboard"), "Dashboard CTA missing in submitted email");
  assert(sub.html.includes("logo.webp"), "Logo image missing in base template");
  console.log("✓ Passed\n");

  // Test 2: BUSINESS_APPROVED
  const app = renderBusinessApprovedEmail({
    ownerName: "Gopal Das",
    businessName: "Vrindavan Handloom Emporium",
    businessSlug: "vrindavan-handloom-emporium",
  });
  console.log("[Test 2: BUSINESS_APPROVED]");
  console.log(`Subject: ${app.subject}`);
  assert(app.subject === "Your business is now live on BachatLal", "Invalid subject for approved email");
  assert(app.html.includes("Gopal Das"), "Owner name missing in approved email");
  assert(app.html.includes("Vrindavan Handloom Emporium"), "Business name missing in approved email");
  assert(app.html.includes("/business/vrindavan-handloom-emporium"), "Public business link missing");
  assert(app.html.includes("/dashboard"), "Secondary dashboard link missing");
  assert(app.html.includes("Live on BachatLal"), "Live status indicator missing in approved email");
  console.log("✓ Passed\n");

  // Test 3: BUSINESS_REJECTED
  const rej = renderBusinessRejectedEmail({
    ownerName: "Mohan Lal",
    businessName: "Govardhan Dairy Farm",
    businessId: "biz_govardhan_123",
    rejectionReason: "Electricity bill document image was blurry and unreadable. Please upload a clear official copy.",
  });
  console.log("[Test 3: BUSINESS_REJECTED]");
  console.log(`Subject: ${rej.subject}`);
  assert(rej.subject === "Action required: Your BachatLal business listing", "Invalid subject for rejected email");
  assert(rej.html.includes("Mohan Lal"), "Owner name missing in rejected email");
  assert(rej.html.includes("Govardhan Dairy Farm"), "Business name missing in rejected email");
  assert(rej.html.includes("Electricity bill document image was blurry"), "Admin rejection reason missing in rejected email");
  assert(rej.html.includes("/dashboard/businesses/biz_govardhan_123"), "Review listing link missing in rejected email");
  console.log("✓ Passed\n");

  // Test 4: BUSINESS_RESUBMITTED
  const resub = renderBusinessResubmittedEmail({
    ownerName: "Mohan Lal",
    businessName: "Govardhan Dairy Farm",
  });
  console.log("[Test 4: BUSINESS_RESUBMITTED]");
  console.log(`Subject: ${resub.subject}`);
  assert(resub.subject === "Your business listing has been resubmitted", "Invalid subject for resubmitted email");
  assert(resub.html.includes("Mohan Lal"), "Owner name missing in resubmitted email");
  assert(resub.html.includes("Govardhan Dairy Farm"), "Business name missing in resubmitted email");
  assert(resub.html.includes("Pending Review"), "Pending review status missing in resubmitted email");
  assert(resub.html.includes("/dashboard"), "Dashboard link missing in resubmitted email");
  console.log("✓ Passed\n");

  console.log("All transactional email template tests completed successfully! 🎉");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
