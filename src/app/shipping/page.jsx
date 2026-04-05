"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../../redux/slices/shippingSlice";
import ProtectedRoute from "../admin/ProtectedRoute";

import { useForm } from "react-hook-form";

// MUI
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["Personal Info", "Shipping", "Payment"];

const ShippingPageContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const savedShipping = useSelector((state) => state.shipping.shippingInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: savedShipping || {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      phoneNo: "",
    },
  });

  /* ===================== SUBMIT ===================== */
  const onSubmit = (data, type) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    dispatch(saveShippingInfo(data));
    router.push(type === "payment" ? "/payment" : "/cod");
  };

  return (
    <div className="flex flex-col items-center -mt-13 px-4">

      {/* STEPPER */}
      <div className="w-full max-w-xl mb-6">
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {/* FORM */}
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Shipping Details
        </h2>

        <form className="space-y-4">

          {/* ADDRESS */}
          <input
            {...register("address", { required: "Address required" })}
            placeholder="Address"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}

          {/* CITY */}
          <input
            {...register("city", { required: "City required" })}
            placeholder="City"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}

          {/* STATE */}
          <input
            {...register("state", { required: "State required" })}
            placeholder="State"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.state && <p className="text-red-500">{errors.state.message}</p>}

          {/* PIN */}
          <input
            {...register("pinCode", { required: "Pin required" })}
            placeholder="Pin Code"
            className="w-full px-3 py-2 border rounded-lg"
          />

          {/* PHONE */}
          <input
            {...register("phoneNo", {
              required: "Phone required",
              pattern: {
                value: /^\d{10}$/,
                message: "Must be 10 digits",
              },
            })}
            placeholder="Phone"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.phoneNo && (
            <p className="text-red-500">{errors.phoneNo.message}</p>
          )}

          {/* COUNTRY */}
          <select
            {...register("country", { required: "Select country" })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Country</option>
            <option value="IN">India</option>
            <option value="US">USA</option>
          </select>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">

            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "payment"))}
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              Proceed to Payment
            </button>

            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "cod"))}
              className="w-full py-3 bg-green-600 text-white rounded-lg"
            >
              Cash on Delivery
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

const ShippingPage = () => {
  return (
    <ProtectedRoute>
      <ShippingPageContent />
    </ProtectedRoute>
  );
};

export default ShippingPage;