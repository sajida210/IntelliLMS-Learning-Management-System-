export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpay = async ({
  courseId,
  amount,
  studentId,
  studentEmail,
  courseTitle,
}) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: "rzp_test_1234567890", // ✅ Use your Razorpay test/live key
    amount: amount * 100,
    currency: "INR",
    name: "LMS Course Enrollment",
    description: `Enroll for ${courseTitle}`,
    handler: async function (response) {
      try {
        const enrollRes = await fetch("http://localhost:5000/api/enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            courseId,
            paymentId: response.razorpay_payment_id,
            studentEmail,
            courseTitle,
          }),
        });

        const data = await enrollRes.json();
        alert(data.message || "Enrollment successful!");
        window.location.href = "/student-dashboard";
      } catch (error) {
        console.error("Enrollment failed:", error);
        alert("Enrollment failed.");
      }
    },
    prefill: {
      email: studentEmail,
    },
    theme: {
      color: "#2563eb",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
